import { useRef } from 'react'
import useScrollFilm from '../lib/useScrollFilm.js'

/* Menu film: irises in over the bridge, then the 20s reel walks through
   espresso pulls, filter brewing and beans while each group's items
   gather over its part of the footage. */
export default function MenuFilm() {
  const stageRef = useRef(null)
  const stickyRef = useRef(null)
  const videoRef = useRef(null)
  const progRef = useRef(null)

  useScrollFilm({
    stageRef,
    stickyRef,
    videoRef,
    progRef,
    src: '/menu-film.mp4',
    srcMobile: '/menu-film-m.mp4',
    lazy: true,
    iris: true,
    scrubStart: 0.2174,
  })

  return (
    <div className="stage stage-menu" id="menu" ref={stageRef}>
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
          <img className="film-poster" src="/menu-poster.jpg" alt="" loading="lazy" />
          <div className="scrim" />
          <div className="grain" />
        </div>
        <div className="iris-ring" aria-hidden="true"><i /></div>

        {/* 1 · ESPRESSO — over the espresso pulls */}
        <div className="caption" data-in="0.04" data-out="0.40">
          <h2 className="display sm">Espresso</h2>
          <dl className="menu-items">
            <div className="item"><dt>Espresso</dt><dd>1.50</dd><p className="desc">Dense, sweet, chocolate finish.</p></div>
            <div className="item"><dt>Cortado</dt><dd>2.00</dd><p className="desc">Equal parts. For people who want to taste the coffee.</p></div>
            <div className="item"><dt>Flat White</dt><dd>2.50</dd><p className="desc">Silky milk, double shot, no foam hat.</p></div>
            <div className="item"><dt>Latte</dt><dd>2.50</dd><p className="desc">Softer, longer, comforting.</p></div>
          </dl>
        </div>

        {/* 2 · FILTER & COLD — over the V60 brew */}
        <div className="caption" data-in="0.52" data-out="0.68">
          <h2 className="display sm">Filter &amp; Cold</h2>
          <dl className="menu-items">
            <div className="item"><dt>V60</dt><dd>3.00</dd><p className="desc">Brewed to order. Ask what&apos;s on today.</p></div>
            <div className="item"><dt>Batch Brew</dt><dd>2.00</dd><p className="desc">Fresh every 40 minutes. Never stewed.</p></div>
            <div className="item"><dt>Cold Brew</dt><dd>2.75</dd><p className="desc">18 hours, steeped slow. Smooth, low acid.</p></div>
            <div className="item"><dt>Iced Latte</dt><dd>3.00</dd><p className="desc">Over hand-cut ice.</p></div>
          </dl>
        </div>

        {/* 3 · BEANS — over the falling beans */}
        <div className="caption" data-in="0.80" data-out="0.96">
          <h2 className="display sm">Beans to take home</h2>
          <dl className="menu-items">
            <div className="item"><dt>BLK House</dt><dd>9.00</dd><p className="desc">250g · Chocolate, hazelnut, brown sugar.</p></div>
            <div className="item"><dt>Yirgacheffe</dt><dd>11.00</dd><p className="desc">250g · Bright and fruity. Rotates monthly.</p></div>
          </dl>
          <p className="menu-note">Oat, almond and full-fat — no charge for the swap. Prices in JD.</p>
        </div>

        <div className="prog" ref={progRef} />
      </div>
    </div>
  )
}
