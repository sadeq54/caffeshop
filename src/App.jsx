import { useEffect } from 'react'
import Nav from './components/Nav.jsx'
import FilmStage from './components/FilmStage.jsx'
import Manifesto from './components/Manifesto.jsx'
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

  // reveal-on-scroll for the static sections
  useEffect(() => {
    const els = document.querySelectorAll('.rise, .reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
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
      <div className="scroll-rail" aria-hidden="true"><span /></div>
      <Nav />
      <FilmStage />
      <Manifesto />
      <MenuRail />
      <Visit />
      <Newsletter />
      <Footer />
    </>
  )
}
