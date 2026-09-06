import { useEffect, useRef } from 'react'
import { DISHES } from '../data/menu.js'

/* Native <dialog> opened with showModal(): the focus trap, the inert page
   behind, Esc-to-close and the top layer all come from the platform. We add
   backdrop-click, arrow-key paging between dishes, and focus restore. */
export default function DishDialog({ index, onClose, onIndex }) {
  const ref = useRef(null)
  const opener = useRef(null)
  const open = index !== null
  const dish = open ? DISHES[index] : null

  useEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    const lenis = window.__blkLenis
    if (open && !dlg.open) {
      opener.current = document.activeElement
      dlg.showModal()
      // the page behind a modal must not keep scrolling under the wheel
      if (lenis) lenis.stop()
    } else if (!open && dlg.open) {
      dlg.close()
      if (lenis) lenis.start()
      // preventScroll: the opener is a card on a horizontal rail, and the
      // browser's own "reveal the focused element" would slide it sideways
      if (opener.current && opener.current.focus) opener.current.focus({ preventScroll: true })
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        onIndex((index + 1) % DISHES.length)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onIndex((index - 1 + DISHES.length) % DISHES.length)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, index, onIndex])

  return (
    <dialog
      className="dd"
      ref={ref}
      aria-labelledby="dd-title"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        // the dialog box itself is the backdrop hit area
        if (e.target === ref.current) onClose()
      }}
    >
      {dish && (
        <div className="dd-panel">
          <button className="dd-close" type="button" onClick={onClose} aria-label="اغلاق">
            <span aria-hidden="true">✕</span>
          </button>

          <div className="dd-figure">
            <img src={dish.img} alt="" width="224" height="310" />
          </div>

          <div className="dd-body">
            <span className="eyebrow">{dish.group} · {dish.en}</span>
            <h2 id="dd-title" className="display sm">{dish.name}</h2>
            <p className="dd-price">{dish.price} JOD</p>
            <p className="lede">{dish.note}</p>

            <dl className="dd-meta">
              {dish.meta.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>

            <p className="dd-story">{dish.story}</p>

            <div className="dd-nav">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => onIndex((index - 1 + DISHES.length) % DISHES.length)}
              >
                السابق
              </button>
              <span className="dd-count">
                {String(index + 1).padStart(2, '0')} / {DISHES.length}
              </span>
              <button
                type="button"
                className="btn btn-solid btn-icon"
                onClick={() => onIndex((index + 1) % DISHES.length)}
              >
                <span>التالي</span>
                <i className="btn-dot" aria-hidden="true">←</i>
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}
