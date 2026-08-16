import { Fragment, useEffect, useRef, useState } from 'react'
import { GROUPS } from '../data/menu.js'
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
  const geo = useRef({ distance: 0, centers: [] })
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
    const track = trackRef.current
    const prog = progRef.current
    const panels = Array.from(track.children)
    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

    let raf = 0
    let shown = 0

    function layout() {
      const distance = Math.max(0, track.scrollWidth - window.innerWidth)
      // the stage is exactly as tall as the sideways travel, plus one screen
      stage.style.height = window.innerHeight + distance + 'px'
      geo.current = {
        distance,
        centers: panels.map((p) => p.offsetLeft + p.offsetWidth / 2),
      }
    }

    function frame() {
      const { distance, centers } = geo.current
      const r = stage.getBoundingClientRect()
      const total = stage.offsetHeight - window.innerHeight
      const target = total > 0 ? clamp01(-r.top / total) : 0
      shown += (target - shown) * 0.12
      if (Math.abs(shown - target) < 0.0002) shown = target

      const x = -shown * distance
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`
      if (prog) prog.style.transform = `scaleX(${shown.toFixed(4)})`

      // depth: each image drifts against the rail by its distance from centre
      const vw = window.innerWidth
      for (let i = 0; i < panels.length; i++) {
        const img = panels[i].querySelector('.rail-img')
        if (!img) continue
        const d = (centers[i] + x - vw / 2) / vw
        img.style.transform = `translate3d(${(-d * 30).toFixed(1)}px,0,0) scale(1.14)`
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
    }
  }, [mode])

  /* keyboard users tab through the cards, so bring the focused one into view */
  function revealFocused(el) {
    if (mode !== 'pan') return
    const { distance } = geo.current
    if (!distance) return
    const stage = stageRef.current
    const total = stage.offsetHeight - window.innerHeight
    const p = (el.offsetLeft + el.offsetWidth / 2 - window.innerWidth / 2) / distance
    const clamped = p < 0 ? 0 : p > 1 ? 1 : p
    window.scrollTo({ top: stage.offsetTop + clamped * total })
  }

  let n = -1
  return (
    <section className={'menu-rail' + (mode ? ' is-' + mode : '')} id="menu" ref={stageRef}>
      <div className="rail-sticky">
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

          <div className="rail-chapter rail-chapter--end">
            <p className="menu-note">
              Oat, almond and full-fat — no charge for the swap. Prices in JD.
            </p>
          </div>
        </div>

        <div className="rail-progress" aria-hidden="true">
          <span ref={progRef} />
        </div>
      </div>

      <DishDialog index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </section>
  )
}
