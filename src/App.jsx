import { useEffect } from 'react'
import Nav from './components/Nav.jsx'
import FilmStage from './components/FilmStage.jsx'
import BridgeFilm from './components/BridgeFilm.jsx'
import MenuRail from './components/MenuRail.jsx'
import Visit from './components/Visit.jsx'
import Newsletter from './components/Newsletter.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
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
      { threshold: 0.16 },
    )
    els.forEach((el, i) => {
      el.style.transitionDelay = (i % 3) * 90 + 'ms'
      io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <>
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
