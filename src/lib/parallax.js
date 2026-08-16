/* ============================================================
   Parallax — depth from one loop, not one listener per element
   ------------------------------------------------------------
   Mark anything with `data-par="0.18"`:
     positive  the element travels further than the page (sits in front)
     negative  the element travels less than the page (sits behind)
   Optional `data-par-x` drifts sideways on the same progress.

   An element's progress is its distance from the middle of the frame
   in viewport-heights, so the drift is always zero as it passes the
   centre. Nothing jumps on entry and nothing needs a start position.

   Only elements actually on screen are written to each frame; an
   IntersectionObserver keeps the rest out of the loop entirely.
   ============================================================ */
export function initParallax(root = document) {
  if (typeof window === 'undefined') return () => {}
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  // Layout position, walked through offsetParent: unlike getBoundingClientRect
  // this is NOT affected by transforms. Measuring the rect instead would feed
  // the transform we just wrote back into the next frame's input, and the
  // element settles at an equilibrium instead of parallaxing.
  const docTop = (el) => {
    let y = 0
    let n = el
    while (n) {
      y += n.offsetTop
      n = n.offsetParent
    }
    return y
  }

  const items = Array.from(root.querySelectorAll('[data-par]')).map((el) => ({
    el,
    y: parseFloat(el.dataset.par) || 0,
    x: parseFloat(el.dataset.parX) || 0,
    top: 0,
    h: 0,
    live: false,
  }))
  if (!items.length) return () => {}

  const measure = () => {
    for (const item of items) {
      item.top = docTop(item.el)
      item.h = item.el.offsetHeight
    }
  }
  measure()
  window.addEventListener('resize', measure)
  window.addEventListener('load', measure)

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const item = items.find((i) => i.el === e.target)
        if (!item) continue
        item.live = e.isIntersecting
        item.el.style.willChange = e.isIntersecting ? 'transform' : ''
        if (!e.isIntersecting) item.el.style.transform = ''
      }
    },
    { rootMargin: '15% 0px' },
  )
  items.forEach((i) => io.observe(i.el))

  let raf = 0
  function frame() {
    const vh = window.innerHeight
    const scrolled = window.scrollY || window.pageYOffset
    for (const item of items) {
      if (!item.live) continue
      // distance from the middle of the frame, in viewport-heights
      const q = (item.top + item.h / 2 - scrolled - vh / 2) / vh
      const ty = q * item.y * 100
      const tx = q * item.x * 100
      item.el.style.transform = `translate3d(${tx.toFixed(2)}px,${ty.toFixed(2)}px,0)`
    }
    raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)

  return () => {
    cancelAnimationFrame(raf)
    io.disconnect()
    window.removeEventListener('resize', measure)
    window.removeEventListener('load', measure)
    items.forEach((i) => {
      i.el.style.transform = ''
      i.el.style.willChange = ''
    })
  }
}
