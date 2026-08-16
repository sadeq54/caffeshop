import { useEffect } from 'react'
import { SCRUB_LERP } from './smoothScroll.js'

/* ============================================================
   Scroll-driven film engine (shared by every film stage)
   ------------------------------------------------------------
   Maps the stage's scroll progress (0..1) onto video.currentTime
   with lerp inertia. Captions inside the stage fade through fixed
   progress windows (data-in / data-out). The mp4 is blob-loaded
   (always seekable, real download %) and seeks are coalesced —
   never issued while the decoder is still resolving the last one.

   SCRUB WINDOW
     scrubStart / scrubEnd carve the film out of the stage's scroll
     range. Progress before scrubStart is the APERTURE phase (the
     stage irises in over the previous one) and progress after
     scrubEnd is the HOLD phase (last frame held, still pinned,
     while the NEXT stage irises in over it). Captions are painted
     against the remapped film progress, so their windows stay
     authored in plain 0..1 film time.

   APERTURE (iris)
     The media layer is clipped by circle(--iris) and the exact same
     radius drives an unclipped ring, so the rim light sits precisely
     on the cut. Radius is computed in px (half the viewport diagonal
     at full open) rather than %, because CSS resolves circle(%)
     against sqrt(w²+h²)/sqrt(2) and the ring could not match it.
     clip-path circle() is compositor-driven; the clip is dropped
     entirely once fully open, and heavy filters are kept off this
     layer (captions blur, media does not).
   ============================================================ */
export default function useScrollFilm({
  stageRef,
  stickyRef,
  videoRef,
  cueRef,
  progRef,
  src,
  srcMobile,
  lazy = false,
  scrubStart = 0,
  scrubEnd = 1,
  iris = false,
  onProgress,
  onReady,
}) {
  useEffect(() => {
    const stage = stageRef.current
    const sticky = stickyRef.current
    const video = videoRef.current
    const cue = cueRef ? cueRef.current : null
    const prog = progRef ? progRef.current : null
    const captions = Array.from(stage.querySelectorAll('.caption'))

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    const smallMQ = window.matchMedia('(max-width: 860px)')
    const isMobile = () => coarse || smallMQ.matches

    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
    const smooth = (e0, e1, x) => {
      const t = clamp01((x - e0) / (e1 - e0))
      return t * t * (3 - 2 * t)
    }

    let raf = 0
    let target = 0
    let shown = 0
    let duration = 0
    let blobUrl = null
    let started = false
    let irisOpen = null
    const aperture = iris && scrubStart > 0
    const aperturePhase = (p) => (aperture ? clamp01(p / scrubStart) : 1)
    const filmPhase = (p) => clamp01((p - scrubStart) / (scrubEnd - scrubStart))
    const aborter = new AbortController()

    let rect = null
    function measure() {
      rect = stage.getBoundingClientRect()
      const total = stage.offsetHeight - window.innerHeight
      target = total > 0 ? clamp01(-rect.top / total) : 0
      return rect.top
    }
    // one viewport of slack each way, because these stages deliberately
    // overlap their neighbours while one irises over the other
    const nearViewport = () =>
      rect && rect.bottom > -window.innerHeight && rect.top < window.innerHeight * 2

    function paintAperture(p) {
      if (!aperture) return
      const t = aperturePhase(p)
      // full-open radius reaches the viewport corners with a little margin
      const full = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 2
      if (reduce) {
        // no zoom, no eased wipe: a plain scroll-linked crossfade instead
        stage.style.setProperty('--iris', full + 'px')
        stage.style.setProperty('--iris-scale', '1')
        stage.style.setProperty('--iris-ring', '0')
        sticky.style.opacity = t.toFixed(3)
        return
      }
      const e = t * t * (3 - 2 * t)
      stage.style.setProperty('--iris', (e * full).toFixed(1) + 'px')
      stage.style.setProperty('--iris-scale', (1 + (1 - e) * 0.14).toFixed(4))
      // rim light blooms as the aperture travels, gone before it settles
      const ring = smooth(0, 0.14, t) * (1 - smooth(0.72, 1, t))
      stage.style.setProperty('--iris-ring', ring.toFixed(3))
      // drop the clip (and its compositing cost) once fully open
      const open = t >= 1
      if (open !== irisOpen) {
        irisOpen = open
        stage.classList.toggle('is-open', open)
      }
    }

    function paintCaptions(fp, p) {
      // Copy never sits over a half-open aperture: it is held back until the
      // iris has almost finished travelling. Without this gate a caption whose
      // window opens at ~0 is already part-faded-in during the whole reveal.
      const gate = aperture ? smooth(0.85, 1, aperturePhase(p)) : 1
      for (const c of captions) {
        const a = +c.dataset.in
        const b = +c.dataset.out
        const fade = 0.1
        const o = gate * smooth(a - fade, a, fp) * (1 - smooth(b, b + fade, fp))
        // depth: how far this beat is from the middle of its own window,
        // so its parts can travel at different rates as it crosses
        if (!reduce) {
          const span = Math.max(0.001, b - a)
          const d = clamp01((fp - (a - fade)) / (span + fade * 2)) - 0.5
          c.style.setProperty('--d', d.toFixed(4))
        }
        c.style.opacity = o.toFixed(3)
        if (!reduce) {
          // the entry offset only — CSS owns the transform, so each caption
          // can be anchored anywhere in the frame without the engine knowing
          c.style.setProperty('--enter', ((1 - o) * 26).toFixed(1) + 'px')
          c.style.filter = o < 0.02 ? 'blur(6px)' : 'none'
        }
        c.style.pointerEvents = o > 0.5 ? 'auto' : 'none'
      }
      if (cue) cue.style.opacity = (1 - smooth(0, 0.06, fp)).toFixed(3)
      if (prog) prog.style.width = (fp * 100).toFixed(2) + '%'
    }

    async function loadFilm() {
      const url = isMobile() && srcMobile ? srcMobile : src
      try {
        const res = await fetch(url, { signal: aborter.signal })
        if (!res.ok || !res.body) throw new Error(String(res.status))
        const total = +res.headers.get('content-length') || 0
        const reader = res.body.getReader()
        const chunks = []
        let received = 0
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          chunks.push(value)
          received += value.length
          if (total && onProgress) onProgress(Math.round((received / total) * 100))
        }
        if (onProgress) onProgress(100)
        blobUrl = URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }))
        video.src = blobUrl
      } catch (err) {
        if (err && err.name === 'AbortError') return
        video.src = url // fall back to normal streaming
        // the poster alone is a perfectly good page: never hold the site
        // hostage to a film that will not arrive
        if (onReady) onReady()
      }
    }

    function maybeStart(stageTop) {
      if (started || reduce) return
      if (!lazy || stageTop < window.innerHeight * 2.5) {
        started = true
        // Let the poster and fonts win the connection first. The poster is
        // this film's own first frame, so the stage looks finished while a
        // multi-megabyte file is still arriving behind it.
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(loadFilm, { timeout: 1500 })
        } else {
          setTimeout(loadFilm, 300)
        }
      }
    }

    function loop() {
      const top = measure()
      maybeStart(top)
      // far off screen: nothing it paints can be seen, so skip the seek and
      // the per-caption writes entirely and just keep the frame ticking
      if (!nearViewport()) {
        shown = target
        raf = requestAnimationFrame(loop)
        return
      }
      shown = reduce ? target : shown + (target - shown) * SCRUB_LERP
      if (Math.abs(shown - target) < 0.0002) shown = target
      const fp = filmPhase(shown)
      if (duration > 0 && !video.seeking && video.readyState >= 2) {
        const t = fp * Math.max(0, duration - 0.06)
        const eps = isMobile() ? 0.02 : 0.008 // coarser step on phones = fewer decodes
        if (Math.abs(video.currentTime - t) > eps) {
          try {
            video.currentTime = t
          } catch {
            /* not seekable yet */
          }
        }
      }
      paintAperture(shown)
      paintCaptions(fp, shown)
      raf = requestAnimationFrame(loop)
    }

    const onMeta = () => {
      duration = video.duration || 0
    }
    const onCanPlay = () => {
      if (onReady) onReady()
    }
    const onError = () => {
      if (onReady) onReady()
    }
    video.addEventListener('error', onError)
    // the poster (exact first frame) stays up until a real frame has painted —
    // on iOS a seeked-but-never-played muted video can stay blank otherwise
    const onFirstSeek = () => sticky.classList.add('has-film')
    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('seeked', onFirstSeek, { once: true })

    // iOS decodes muted video reliably only after a user gesture
    const prime = () => {
      if (!isMobile() || !video.src) return
      const p = video.play()
      if (p && p.then) p.then(() => video.pause()).catch(() => {})
    }
    window.addEventListener('pointerdown', prime, { once: true, passive: true })
    window.addEventListener('touchstart', prime, { once: true, passive: true })

    if (reduce && onReady) onReady() // poster stays up, no film download

    measure()
    shown = target
    loop()

    return () => {
      cancelAnimationFrame(raf)
      aborter.abort()
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('error', onError)
      video.removeEventListener('seeked', onFirstSeek)
      window.removeEventListener('pointerdown', prime)
      window.removeEventListener('touchstart', prime)
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
