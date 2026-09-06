import { useEffect } from 'react'
import { SCRUB_LERP } from './smoothScroll.js'

/* ============================================================
   Scroll stage without a film.
   ------------------------------------------------------------
   The same grammar the film stages used — a pinned sticky, an
   optional iris aperture over the media layer, captions fading
   through fixed progress windows (data-in / data-out) — driven
   purely by scroll. One rAF, bails when the stage is off screen.
   ============================================================ */
export default function useScrollStage({ stageRef, stickyRef, scrubStart = 0, scrubEnd = 1, iris = false }) {
  useEffect(() => {
    const stage = stageRef.current
    const sticky = stickyRef.current
    const captions = Array.from(stage.querySelectorAll('.caption'))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
    const smooth = (e0, e1, x) => {
      const t = clamp01((x - e0) / (e1 - e0))
      return t * t * (3 - 2 * t)
    }
    const aperture = iris && scrubStart > 0
    const aperturePhase = (p) => (aperture ? clamp01(p / scrubStart) : 1)
    const filmPhase = (p) => clamp01((p - scrubStart) / (scrubEnd - scrubStart))

    let raf = 0
    let target = 0
    let shown = 0
    let irisOpen = null
    let rect = null

    function measure() {
      rect = stage.getBoundingClientRect()
      const total = stage.offsetHeight - window.innerHeight
      target = total > 0 ? clamp01(-rect.top / total) : 0
    }
    const nearViewport = () =>
      rect && rect.bottom > -window.innerHeight && rect.top < window.innerHeight * 2

    function paintAperture(p) {
      if (!aperture) return
      const t = aperturePhase(p)
      const full = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 2
      if (reduce) {
        stage.style.setProperty('--iris', full + 'px')
        stage.style.setProperty('--iris-scale', '1')
        stage.style.setProperty('--iris-ring', '0')
        sticky.style.opacity = t.toFixed(3)
        return
      }
      const e = t * t * (3 - 2 * t)
      stage.style.setProperty('--iris', (e * full).toFixed(1) + 'px')
      stage.style.setProperty('--iris-scale', (1 + (1 - e) * 0.14).toFixed(4))
      const ring = smooth(0, 0.14, t) * (1 - smooth(0.72, 1, t))
      stage.style.setProperty('--iris-ring', ring.toFixed(3))
      const open = t >= 1
      if (open !== irisOpen) {
        irisOpen = open
        stage.classList.toggle('is-open', open)
      }
    }

    function paintCaptions(fp, p) {
      const gate = aperture ? smooth(0.85, 1, aperturePhase(p)) : 1
      for (const c of captions) {
        const a = +c.dataset.in
        const b = +c.dataset.out
        const fade = 0.1
        const o = gate * smooth(a - fade, a, fp) * (1 - smooth(b, b + fade, fp))
        if (!reduce) {
          const span = Math.max(0.001, b - a)
          const d = clamp01((fp - (a - fade)) / (span + fade * 2)) - 0.5
          c.style.setProperty('--d', d.toFixed(4))
          c.style.setProperty('--enter', ((1 - o) * 26).toFixed(1) + 'px')
          c.style.filter = o < 0.02 ? 'blur(6px)' : 'none'
        }
        c.style.opacity = o.toFixed(3)
        c.style.pointerEvents = o > 0.5 ? 'auto' : 'none'
      }
      // the whole stage's own progress, for anything CSS wants to ride
      stage.style.setProperty('--p', fp.toFixed(4))
    }

    function loop() {
      measure()
      if (!nearViewport()) {
        shown = target
        raf = requestAnimationFrame(loop)
        return
      }
      shown = reduce ? target : shown + (target - shown) * SCRUB_LERP
      if (Math.abs(shown - target) < 0.0002) shown = target
      paintAperture(shown)
      paintCaptions(filmPhase(shown), shown)
      raf = requestAnimationFrame(loop)
    }

    measure()
    shown = target
    loop()
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
