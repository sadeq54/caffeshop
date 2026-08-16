import { useEffect } from 'react'
import Nav from './components/Nav.jsx'
import FilmStage from './components/FilmStage.jsx'
import BridgeFilm from './components/BridgeFilm.jsx'
import MenuRail from './components/MenuRail.jsx'
import Visit from './components/Visit.jsx'
import Newsletter from './components/Newsletter.jsx'
import Footer from './components/Footer.jsx'
import { initSmoothScroll } from './lib/smoothScroll.js'
import { initParallax } from './lib/parallax.js'

export default function App() {
  // smooth scroll first: every engine below reads the position it lerps
  useEffect(() => {
    initSmoothScroll()
    const stopParallax = initParallax()
    return stopParallax
  }, [])

  // reveal-on-scroll for the static sections (IntersectionObserver survives
  // layout shifts, unlike position-measured tweens)
  useEffect(() => {
    const els = document.querySelectorAll('.rise')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      // Fire BEFORE the element reaches the fold. At 0.16/no-margin the
      // reveal only started once the block was well up the screen, so at
      // speed you scrolled past a second of blank space while it faded in.
      { threshold: 0.01, rootMargin: '0px 0px 20% 0px' },
    )
    els.forEach((el, i) => {
      el.style.transitionDelay = (i % 3) * 60 + 'ms'
      io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <>
      {/* the browser scrollbar is hidden; this is its replacement */}
      <div className="scroll-rail" aria-hidden="true">
        <span />
      </div>
      <Nav />
      <FilmStage />
      <BridgeFilm />
      <MenuRail />
      <Visit />
      <Newsletter />
      <Footer />
    </>
  )
}
