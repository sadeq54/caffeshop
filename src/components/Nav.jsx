import { useEffect, useState } from 'react'

const LINKS = [
  ['Menu', '#menu'],
  ['Visit', '#visit'],
  ['Wholesale', '#wholesale'],
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  // the overlay owns the screen while it is up: no scrolling behind it,
  // and Escape closes it like any other dialog on the page
  useEffect(() => {
    const lenis = window.__blkLenis
    if (open) lenis?.stop()
    else lenis?.start()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lenis?.start()
    }
  }, [open])

  /* Close first, then travel. Lenis discards a scrollTo issued while it is
     stopped — `force` does not survive stop() — so the sheet has to be shut
     and scrolling resumed before the jump is asked for. */
  function go(e, href) {
    e.preventDefault()
    setOpen(false)
    const el = document.querySelector(href)
    if (!el) return
    requestAnimationFrame(() => {
      const lenis = window.__blkLenis
      if (lenis) {
        lenis.start()
        lenis.scrollTo(el)
      } else {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    })
  }

  return (
    <>
      <nav className="nav">
        <a className="logo" href="#top" onClick={() => setOpen(false)}>
          BLK
        </a>

        <div className="nav-links">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </div>

        {/* below 768px the inline links cannot fit beside the logo, so they
            move into an overlay rather than disappearing entirely */}
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-sheet"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>

      <div id="nav-sheet" className={'nav-sheet' + (open ? ' is-open' : '')} hidden={!open}>
        <ul>
          {LINKS.map(([label, href], i) => (
            <li key={href} style={{ '--i': i }}>
              <a href={href} onClick={(e) => go(e, href)}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <p className="nav-sheet-foot">Rainbow Street, Jabal Amman</p>
      </div>
    </>
  )
}
