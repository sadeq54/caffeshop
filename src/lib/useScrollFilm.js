import { useEffect } from 'react'

/* ============================================================
   Scroll-driven film engine (shared by every film stage)
   ------------------------------------------------------------
   Maps the stage's scroll progress (0..1) onto video.currentTime
   with lerp inertia. Captions inside the stage fade through fixed
   progress windows (data-in / data-out). The mp4 is blob-loaded
   (always seekable, real download %) and seeks are coalesced —
   never issued while the decoder is still resolving the last one.
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
    const aborter = new AbortController()

    function measure() {
      const r = stage.getBoundingClientRect()
      const total = stage.offsetHeight - window.innerHeight
      target = total > 0 ? clamp01(-r.top / total) : 0
      return r.top
    }

    function paintCaptions(p) {
      for (const c of captions) {
        const a = +c.dataset.in
        const b = +c.dataset.out
        const fade = 0.1
        const o = smooth(a - fade, a, p) * (1 - smooth(b, b + fade, p))
        c.style.opacity = o.toFixed(3)
        if (!reduce) {
          c.style.transform = 'translateY(calc(-50% + ' + ((1 - o) * 26).toFixed(1) + 'px))'
          c.style.filter = o < 0.02 ? 'blur(6px)' : 'none'
        }
        c.style.pointerEvents = o > 0.5 ? 'auto' : 'none'
      }
      if (cue) cue.style.opacity = (1 - smooth(0, 0.06, p)).toFixed(3)
      if (prog) prog.style.width = (p * 100).toFixed(2) + '%'
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
      }
    }

    function maybeStart(stageTop) {
      if (started || reduce) return
      if (!lazy || stageTop < window.innerHeight * 2.5) {
        started = true
        loadFilm()
      }
    }

    function loop() {
      const top = measure()
      maybeStart(top)
      shown = reduce ? target : shown + (target - shown) * 0.11
      if (Math.abs(shown - target) < 0.0002) shown = target
      if (duration > 0 && !video.seeking && video.readyState >= 2) {
        const t = clamp01(shown) * Math.max(0, duration - 0.06)
        const eps = isMobile() ? 0.02 : 0.008
        if (Math.abs(video.currentTime - t) > eps) {
          try {
            video.currentTime = t
          } catch {
            /* not seekable yet */
          }
        }
      }
      paintCaptions(shown)
      raf = requestAnimationFrame(loop)
    }

    const onMeta = () => {
      duration = video.duration || 0
    }
    const onCanPlay = () => {
      if (onReady) onReady()
    }
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
      video.removeEventListener('seeked', onFirstSeek)
      window.removeEventListener('pointerdown', prime)
      window.removeEventListener('touchstart', prime)
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
