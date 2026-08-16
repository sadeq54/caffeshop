import { useRef, useState } from 'react'
import useScrollFilm from '../lib/useScrollFilm.js'

/* Hero film: 520vh scroll stage, footage scrubbed by scroll,
   brand captions fading through fixed progress windows. */
export default function FilmStage() {
  const stageRef = useRef(null)
  const stickyRef = useRef(null)
  const videoRef = useRef(null)
  const cueRef = useRef(null)
  const progRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useScrollFilm({
    stageRef,
    stickyRef,
    videoRef,
    cueRef,
    progRef,
    src: '/film.mp4',
    srcMobile: '/film-m.mp4',
    // the last 100vh of the stage is a hold: the film has finished, the
    // sticky stays pinned, and the bridge irises in over a held frame
    scrubEnd: 0.8077,
    onProgress: setProgress,
    onReady: () => setReady(true),
  })

  return (
    <div className="stage" id="top" ref={stageRef}>
      <div className={'loader' + (ready ? ' done' : '')} aria-hidden="true">
        <span className="loader-mark">BLK</span>
        <span className="loader-pct">{progress}%</span>
      </div>

      <div className="sticky" ref={stickyRef}>
        <div className="film-wrap">
          <video
            className="film"
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
          />
          <img className="film-poster" src="/poster.jpg" alt="" />
          <div className="scrim" />
          <div className="grain" />
        </div>

        {/* 1 · HERO */}
        <div className="caption" data-in="0" data-out="0.15">
          <span className="eyebrow">Amman · Roasted in small batches</span>
          <h1 className="display">
            Coffee,<br />
            <em>slowed down.</em>
          </h1>
          <p className="lede">
            Sourced from farms we can name. Roasted three times a week. Poured like it
            matters — because it does.
          </p>
          <div className="cta-row">
            <a className="btn btn-solid btn-icon" href="#menu">
              <span>See the menu</span>
              <i className="btn-dot" aria-hidden="true">↗</i>
            </a>
            <a className="btn btn-ghost" href="#visit">Find us</a>
          </div>
        </div>

        {/* 2 · THE PROMISE */}
        <div className="caption caption--upright" data-in="0.30" data-out="0.42">
          <span className="eyebrow">The promise</span>
          <h2 className="display">
            Fresh isn&apos;t<br />
            a word.<br />
            <em>It&apos;s a date.</em>
          </h2>
          <p className="lede">
            Most coffee you buy was roasted months ago and shipped until the flavour left
            it. Ours carries the day it was roasted printed on the bag.
          </p>
          <div className="stats">
            <div className="stat"><b>3&times;</b><span>roasts per week</span></div>
            <div className="stat"><b>14</b><span>days shelf life</span></div>
            <div className="stat"><b>100%</b><span>traceable to farm</span></div>
          </div>
        </div>

        {/* 3 · ORIGIN */}
        <div className="caption caption--floor" data-in="0.56" data-out="0.66">
          <span className="eyebrow">Origin</span>
          <h2 className="display">
            We know<br />
            the farm.
          </h2>
          <p className="lede">
            We buy directly wherever we can — Yirgacheffe, Huila, Nyeri — and we pay above
            commodity price every time. It costs us more. It is the entire reason the cup
            tastes the way it does.
          </p>
          <p className="quote">
            You can taste the difference between coffee that was bought and coffee that
            was chosen.
          </p>
        </div>

        {/* 4 · THE CRAFT */}
        {/* out by film-end so the screen is clear when the bridge irises in */}
        <div className="caption" data-in="0.78" data-out="0.88">
          <span className="eyebrow">The craft</span>
          <h2 className="display sm">
            Eighteen&nbsp;grams.<br />
            <em>Twenty-eight&nbsp;seconds.</em>
          </h2>
          <p className="lede">
            Every shot is weighed in, weighed out and timed. We recalibrate through the
            day as the humidity shifts — a recipe that was right at 8am is wrong by 3pm.
          </p>
          <div className="cards">
            <div className="card"><b>Weighed</b><p>Every shot, in and out. Never guessed.</p></div>
            <div className="card"><b>Timed</b><p>26–30 seconds, or we start again.</p></div>
            <div className="card"><b>Tuned</b><p>Recalibrated through the day, every day.</p></div>
          </div>
        </div>

        <div className="cue" ref={cueRef}>
          Scroll<i></i>
        </div>
        <div className="prog" ref={progRef} />
      </div>
    </div>
  )
}
