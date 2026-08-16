import { useRef } from 'react'
import useScrollFilm from '../lib/useScrollFilm.js'

/* Bridge film: the title card between the brand story and the menu.
   Irises in over the hero across its first 100vh of scroll, scrubs the
   café reel, then holds its last frame while the menu irises in over it. */
export default function BridgeFilm() {
  const stageRef = useRef(null)
  const stickyRef = useRef(null)
  const videoRef = useRef(null)

  useScrollFilm({
    stageRef,
    stickyRef,
    videoRef,
    src: '/bridge-film.mp4',
    srcMobile: '/bridge-film-m.mp4',
    lazy: true,
    iris: true,
    // no hold tail: the menu below is a normal section, so the film runs to
    // its last frame exactly as the sticky releases
    scrubStart: 0.3333,
  })

  return (
    <div className="stage stage-bridge" ref={stageRef}>
      <div className="sticky" ref={stickyRef}>
        <div className="film-wrap">
          <video
            className="film"
            ref={videoRef}
            muted
            playsInline
            preload="none"
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
          />
          <img className="film-poster" src="/bridge-poster.jpg" alt="" loading="lazy" />
          <div className="scrim" />
          <div className="grain" />
        </div>
        <div className="iris-ring" aria-hidden="true"><i /></div>

        <div className="caption caption--center" data-in="0.06" data-out="0.86">
          <span className="eyebrow">Menu</span>
          <h2 className="display">What we pour.</h2>
        </div>
      </div>
    </div>
  )
}
