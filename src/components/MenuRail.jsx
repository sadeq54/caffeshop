import { Fragment, useEffect, useRef, useState } from 'react'
import { GROUPS } from '../data/menu.js'
import { SCRUB_LERP } from '../lib/smoothScroll.js'
import DishDialog from './DishDialog.jsx'

/* The menu as one long rail.
   On a pointer device the page is pinned and vertical scroll pans the rail
   sideways; the images counter-drift for depth. On touch, or under reduced
   motion, the same markup becomes a native scroll-snap carousel, because
   hijacking scroll on a phone is a fight the user always loses.
   Any card opens the dish in a native <dialog>. */
export default function MenuRail() {
  const stageRef = useRef(null)
  const trackRef = useRef(null)
  const progRef = useRef(null)
  const markRef = useRef(null)
  const ruleRef = useRef(null)
  const geo = useRef({ distance: 0, tail: 0, panEnd: 1, centers: [] })
  // decided during the first render so the rail never flashes in the wrong mode
  const [mode] = useState(() => {
    const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const narrow = window.matchMedia('(max-width: 860px)').matches
    return coarse || reduce || narrow ? 'swipe' : 'pan'
  })
  const [open, setOpen] = useState(null)

  useEffect(() => {
    if (mode !== 'pan') return
    const stage = stageRef.current
    const sticky = stage.querySelector('.rail-sticky')
    const track = trackRef.current
    const prog = progRef.current
    const panels = Array.from(track.children)
    const mark = markRef.current
    const rule = ruleRef.current
    const letters = mark ? Array.from(mark.querySelectorAll('.gate-l')) : []
    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
    const smooth = (v) => v * v * (3 - 2 * v)

    let raf = 0
    let shown = 0

    function layout() {
      const distance = Math.max(0, track.scrollWidth - window.innerWidth)
      // TAIL is scroll the rail keeps AFTER the pan finishes: the wordmark
      // assembles over the last cards, then opens as Visit rises. Keeping it
      // inside this stage is what ties the two sections together instead of
      // parking a separate interlude between them.
      const tail = window.innerHeight * 2
      stage.style.height = window.innerHeight + distance + tail + 'px'
      geo.current = {
        distance,
        tail,
        panEnd: distance / (distance + tail),
        centers: panels.map((p) => p.offsetLeft + p.offsetWidth / 2),
      }
    }

    function frame() {
      const { distance, centers, panEnd } = geo.current
      const r = stage.getBoundingClientRect()
      const total = stage.offsetHeight - window.innerHeight
      const target = total > 0 ? clamp01(-r.top / total) : 0
      // snap rather than ease when the stage is far off: easing across a
      // jump (page load at a restored offset, an anchor click) would run the
      // whole tail backwards with the rail's chrome lit up over whatever
      // section is actually on screen
      shown = Math.abs(target - shown) > 0.2 ? target : shown + (target - shown) * SCRUB_LERP
      if (Math.abs(shown - target) < 0.0002) shown = target
      // nothing of this stage should paint once it is behind us
      // hide the stage once the next section has taken the frame, not just
      // when the stage itself has left: they overlap by a full screen
      const covered = r.bottom <= window.innerHeight * 0.9
      sticky.style.visibility =
        covered || r.bottom <= 0 || r.top >= window.innerHeight ? 'hidden' : 'visible'

      const pan = panEnd > 0 ? clamp01(shown / panEnd) : 0
      const x = -pan * distance
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`
      if (prog) prog.style.transform = `scaleX(${pan.toFixed(4)})`

      // Depth: every panel is placed by its distance from the centre of the
      // frame. The image slides against the rail inside its own frame, and
      // the card itself rides up or down, alternating, so the row reads as
      // objects at different distances rather than one flat strip.
      const vw = window.innerWidth
      for (let i = 0; i < panels.length; i++) {
        const panel = panels[i]
        const d = (centers[i] + x - vw / 2) / vw
        // |d| > 1.2 is more than a screen away along the rail: not visible,
        // so skip the writes. Most of the 19 panels are off-frame at any time.
        if (d < -1.2 || d > 1.2) continue
        const img = panel.querySelector('.rail-img')
        if (img) img.style.transform = `translate3d(${(-d * 88).toFixed(1)}px,0,0) scale(1.2)`
        if (panel.classList.contains('rail-card')) {
          const dir = i % 2 ? -1 : 1
          panel.style.transform = `translate3d(0,${(d * 46 * dir).toFixed(1)}px,0)`
        }
      }

      /* The tail. The rail is still pinned under all of this, so the wordmark
         forms over the board it belongs to, then opens to let the room in. */
      if (mark) {
        const t = clamp01((shown - panEnd) / (1 - panEnd))
        const ea = smooth(clamp01(t / 0.34)) // letters converge
        const eb = smooth(clamp01((t - 0.34) / 0.14)) // rule draws
        // finishes before the tail runs out, so the last stretch is clean:
        // the room must not arrive with the gate still painting over it
        const ec = smooth(clamp01((t - 0.5) / 0.34)) // open, as Visit rises
        const away = 1 - ea
        const vh = window.innerHeight
        const grow = 1 + ec * 0.4

        letters[0].style.transform =
          `translate3d(${(-away * 0.62 * vw - ec * 0.52 * vw).toFixed(1)}px,${(away * 44).toFixed(1)}px,0) rotate(${(-away * 11).toFixed(2)}deg) scale(${grow.toFixed(3)})`
        letters[1].style.transform =
          `translate3d(0,${(away * 130 - ec * 0.5 * vh).toFixed(1)}px,0) scale(${((1 - away * 0.28) * grow).toFixed(3)})`
        letters[2].style.transform =
          `translate3d(${(away * 0.62 * vw + ec * 0.52 * vw).toFixed(1)}px,${(-away * 44).toFixed(1)}px,0) rotate(${(away * 11).toFixed(2)}deg) scale(${grow.toFixed(3)})`

        const lit = ea * (1 - ec)
        // all the way to zero, not to a ghost floor
        for (const l of letters) l.style.opacity = ((0.2 + ea * 0.8) * (1 - ec)).toFixed(3)
        if (rule) rule.style.transform = `scaleX(${(eb * (1 - clamp01(ec * 2))).toFixed(3)})`
        mark.style.setProperty('--lit', lit.toFixed(3))
        // the cards recede as the name takes the frame, and are gone by the
        // time the room is up — otherwise they ghost behind its copy
        const boardOut = ((1 - ea * 0.92) * (1 - ec)).toFixed(3)
        track.style.opacity = boardOut
        if (prog) prog.parentElement.style.opacity = boardOut
        // the corner logo leaves as the wordmark forms, returns as it opens
        document.documentElement.style.setProperty('--brand-out', lit.toFixed(3))
      }
      raf = requestAnimationFrame(frame)
    }

    layout()
    window.addEventListener('resize', layout)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', layout)
      stage.style.height = ''
      track.style.transform = ''
      track.style.opacity = ''
      panels.forEach((el) => {
        el.style.transform = ''
        const im = el.querySelector('.rail-img')
        if (im) im.style.transform = ''
      })
      sticky.style.visibility = ''
      if (prog) prog.parentElement.style.opacity = ''
      document.documentElement.style.setProperty('--brand-out', '0')
    }
  }, [mode])

  /* Keyboard users tab through the cards, so bring the focused one into view.
     Three gates, because a click focuses a button too and travelling then
     yanked the rail sideways under the dialog the click had just opened:
       — :focus-visible is precisely "focus the user needs shown": false for a
         plain mouse click, true for Tab (and for focus restored after Esc),
       — a card already in frame needs no travel at all,
       — and Lenis owns the scroll position, so a native scrollTo is reverted
         on its next frame — unless the modal has it stopped, in which case it
         sticks and the rail is left panned to the wrong place. */
  function revealFocused(el) {
    if (mode !== 'pan') return
    const { distance } = geo.current
    if (!distance) return
    let keyboard = true
    try {
      keyboard = el.matches(':focus-visible')
    } catch {
      /* pre-2021 engine: fall through to the on-screen check below */
    }
    if (!keyboard) return
    const r = el.getBoundingClientRect()
    if (r.left >= 0 && r.right <= window.innerWidth) return
    const stage = stageRef.current
    const total = stage.offsetHeight - window.innerHeight
    const p = (el.offsetLeft + el.offsetWidth / 2 - window.innerWidth / 2) / distance
    const clamped = p < 0 ? 0 : p > 1 ? 1 : p
    const top = stage.offsetTop + clamped * total
    const lenis = window.__blkLenis
    if (lenis) lenis.scrollTo(top)
    else window.scrollTo({ top })
  }

  let n = -1
  return (
    <section className={'menu-rail' + (mode ? ' is-' + mode : '')} id="menu" ref={stageRef}>
      <div className="rail-sticky">
        {/* No data-lenis-prevent here. In swipe mode this is a horizontal
            scroller, and telling Lenis to ignore the wheel over it meant a
            vertical wheel did nothing at all: the browser will not turn
            vertical wheel into horizontal scroll, so the page simply stuck
            whenever the pointer sat over the carousel. Touch and trackpad
            still pan it sideways natively. */}
        <div className="rail-track" ref={trackRef}>
          {/* Fragments keep the track's children flat, so each panel's own
              centre drives its parallax */}
          {GROUPS.map((g) => (
            <Fragment key={g.title}>
              <div className="rail-chapter">
                <h2>{g.title}</h2>
                <span className="rail-chapter-count">{g.items.length} on the board</span>
              </div>

              {g.items.map((item) => {
                n += 1
                const i = n
                return (
                  <button
                    type="button"
                    className="rail-card"
                    key={item.slug}
                    onClick={() => setOpen(i)}
                    onFocus={(e) => revealFocused(e.currentTarget)}
                    aria-label={`${item.name}, ${item.price} JD. Open details`}
                  >
                    <span className="rail-frame">
                      <img
                        className="rail-img"
                        src={`/menu/${item.slug}.webp`}
                        alt=""
                        loading="lazy"
                        width="1100"
                        height="825"
                      />
                      <span className="rail-open" aria-hidden="true">↗</span>
                    </span>
                    <span className="rail-line">
                      <span className="rail-name">{item.name}</span>
                      <span className="rail-price">{item.price}</span>
                    </span>
                    <span className="rail-note">{item.note}</span>
                  </button>
                )
              })}
            </Fragment>
          ))}

          {/* the rail closes on its footnote; the wordmark moment that links
              this section to the next lives in BrandGate */}
          <div className="rail-chapter rail-chapter--end">
            <p className="menu-note">
              Oat, almond and full-fat — no charge for the swap. Prices in JD.
            </p>
          </div>
        </div>

        <div className="rail-progress" aria-hidden="true">
          <span ref={progRef} />
        </div>

        {/* the name, over the board it belongs to */}
        <div className="gate" aria-hidden="true">
          <div className="gate-mark" ref={markRef}>
            <span className="gate-l">B</span>
            <span className="gate-l">L</span>
            <span className="gate-l">K</span>
          </div>
          <span className="gate-rule" ref={ruleRef} />
        </div>
      </div>

      <DishDialog index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </section>
  )
}
