import Lenis from 'lenis'

/* ============================================================
   Smooth scroll — the same mechanism both reference sites use
   ------------------------------------------------------------
   Lenis v1 lerps the REAL scroll position (it does not transform a
   wrapper), so position:sticky, getBoundingClientRect and every
   scroll-driven engine on this page keep working untouched. That is
   the whole reason it can be dropped under a site built like this one.

   The instance is parked on `window`, not in module scope: a module
   singleton is re-created on every hot reload and the old rAF loop
   keeps running, so the loops stack until the compositor starves.
   ============================================================ */
const KEY = '__blkLenis'

export function initSmoothScroll() {
  if (typeof window === 'undefined') return null
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  if (window[KEY]) return window[KEY]

  const lenis = new Lenis({
    lerp: 0.09, // weight; lower is heavier
    wheelMultiplier: 1,
    smoothWheel: true,
    // touch keeps the platform's own scrolling: smoothing it fights the
    // finger and breaks the rail's snap carousel
    syncTouch: false,
  })

  let raf = 0
  const loop = (time) => {
    lenis.raf(time)
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)

  // in-page links go through Lenis, or they hard-jump out of the easing
  const onClick = (e) => {
    const a = e.target.closest?.('a[href^="#"]')
    if (!a) return
    const id = a.getAttribute('href')
    if (!id || id === '#') return
    const el = document.querySelector(id)
    if (!el) return
    e.preventDefault()
    // force: an overlay that locked scrolling (the mobile nav sheet) is still
    // stopped at the moment its own link is clicked, and a normal scrollTo
    // would be discarded before the overlay's effect can start Lenis again
    lenis.scrollTo(el, { offset: 0, force: true })
  }
  document.addEventListener('click', onClick)

  // Landing on /#menu must actually arrive there. The browser performs its
  // hash jump before these stages have measured themselves — the rail sets
  // its own height in JS — so the target moves out from under it and the
  // page stays at the top. Re-aim a few times while the layout settles.
  if (location.hash && location.hash.length > 1) {
    let target = null
    try {
      target = document.querySelector(location.hash)
    } catch {
      target = null
    }
    if (target) {
      let tries = 0
      const aim = () => {
        lenis.scrollTo(target, { immediate: true })
        if (++tries < 8) setTimeout(aim, 140)
      }
      setTimeout(aim, 120)
    }
  }

  window[KEY] = lenis
  lenis.destroyAll = () => {
    cancelAnimationFrame(raf)
    document.removeEventListener('click', onClick)
    lenis.destroy()
    delete window[KEY]
  }
  return lenis
}

/* Scroll engines on this page lerp internally as well. With Lenis in front
   of them that would be two lags stacked, so they follow the smoothed
   position much more closely and let Lenis carry the weight. */
export const SCRUB_LERP = 0.24
