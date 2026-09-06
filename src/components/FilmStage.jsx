import { useEffect, useRef, useState } from 'react'

/* The opening. One short film plays through ONCE, and the page holds still
   until it is done: no scroll, no nav, just the slogan arriving line by
   line with the footage. Then the frame freezes, the room lights come up,
   and the site opens. Escape hatches are non-negotiable: a skip button,
   a hard ceiling, an autoplay failure, or reduced motion all release the
   page immediately. Nobody is ever trapped behind a video. */
const LINES = [
  ['قهوة زاكية.', 0.5],
  ['كل يوم.', 3.3],
  ['بسعر منطقي.', 6.1],
]
const CEILING = 14000

export default function FilmStage() {
  const videoRef = useRef(null)
  const progRef = useRef(null)
  const [reduce] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [phase, setPhase] = useState(reduce ? LINES.length : 0)
  const [done, setDone] = useState(reduce)
  const [ready, setReady] = useState(reduce)
  const [canSkip, setCanSkip] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    let released = reduce
    let raf = 0

    const release = () => {
      if (released) return
      released = true
      html.classList.remove('is-intro')
      const lenis = window.__blkLenis
      if (lenis) lenis.start()
      setDone(true)
      setPhase(LINES.length)
    }
    // Lenis is created by the parent's effect, which runs AFTER this one:
    // keep asking until it exists, unless we have already been released.
    const lock = () => {
      if (released) return
      const lenis = window.__blkLenis
      if (lenis) lenis.stop()
      else requestAnimationFrame(lock)
    }

    if (reduce) {
      setReady(true)
      return
    }

    html.classList.add('is-intro')
    window.scrollTo(0, 0)
    lock()

    const video = videoRef.current
    const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    const small = window.matchMedia('(max-width: 860px)').matches
    video.src = coarse || small ? '/intro-m.mp4' : '/intro.mp4'

    const ceiling = setTimeout(release, CEILING)
    const skipTimer = setTimeout(() => setCanSkip(true), 1600)

    const tick = () => {
      const t = video.currentTime || 0
      const d = video.duration || 10.4
      if (progRef.current) progRef.current.style.transform = 'scaleX(' + Math.min(1, t / d).toFixed(4) + ')'
      let p = 0
      for (let i = 0; i < LINES.length; i++) if (t >= LINES[i][1]) p = i + 1
      setPhase((cur) => (p > cur ? p : cur))
      raf = requestAnimationFrame(tick)
    }

    const onCanPlay = () => {
      setReady(true)
      const p = video.play()
      if (p && p.catch) p.catch(release) // autoplay refused: open the page
      raf = requestAnimationFrame(tick)
    }
    const onEnded = () => {
      video.pause() // hold the last frame under the opened page
      release()
    }
    video.addEventListener('canplay', onCanPlay, { once: true })
    video.addEventListener('ended', onEnded)
    video.addEventListener('error', release)
    video.load()

    return () => {
      clearTimeout(ceiling)
      clearTimeout(skipTimer)
      cancelAnimationFrame(raf)
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('error', release)
      html.classList.remove('is-intro')
      window.__blkLenis?.start()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function skip() {
    const video = videoRef.current
    if (video && video.duration) {
      try {
        video.currentTime = Math.max(0, video.duration - 0.05)
      } catch {
        /* not seekable yet */
      }
      video.pause()
    }
    document.documentElement.classList.remove('is-intro')
    window.__blkLenis?.start()
    setDone(true)
    setPhase(LINES.length)
  }

  return (
    <header className={'intro' + (done ? ' is-done' : '') + (ready ? ' is-ready' : '')} id="top">
      <div className="intro-media" aria-hidden="true">
        {!reduce && (
          <video className="intro-film" ref={videoRef} muted playsInline preload="auto" disableRemotePlayback tabIndex={-1} />
        )}
        <img className="intro-poster" src={reduce ? '/intro-end.jpg' : '/poster.jpg'} alt="" fetchPriority="high" />
        <div className="intro-scrim" />
        <div className="grain" />
      </div>

      <div className="intro-copy">
        <span className="eyebrow intro-eyebrow">قهوة مختصة · الأردن ولبنان</span>
        <h1 className="display intro-title">
          {LINES.map(([text], i) => (
            <span key={text} className={'intro-line' + (phase > i ? ' in' : '')} style={{ '--i': i }}>
              <span>{text}</span>
            </span>
          ))}
        </h1>
        <div className="intro-after">
          <p className="lede">
            قهوة بلاك هي إعادة تعريف للقهوة المختصة بروح عصرية، ومبنية على مبدأ بسيط:
            الكل بيستحق قهوة زاكية، بتتقدم بابتسامة، وبسعر منطقي.
          </p>
          <div className="cta-row">
            <a className="btn btn-solid btn-icon" href="#menu">
              <span>شوف المنيو</span>
              <i className="btn-dot" aria-hidden="true">↖</i>
            </a>
            <a className="btn btn-ghost" href="#visit">اقرب فرع</a>
          </div>
        </div>
      </div>

      {/* the only chrome during the lock: how much is left, and the way out */}
      <div className="intro-bar" aria-hidden="true"><span ref={progRef} /></div>
      {!done && (
        <button type="button" className={'intro-skip' + (canSkip ? ' in' : '')} onClick={skip}>
          تخطي <i aria-hidden="true">←</i>
        </button>
      )}
      <div className="cue intro-cue">سكرول<i></i></div>
    </header>
  )
}
