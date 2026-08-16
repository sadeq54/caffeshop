export default function Visit() {
  return (
    <section className="pad visit-section" id="visit">
      <div className="wrap">
        {/* Four depth layers, overlapping on purpose: the room plate sits
            deepest and lags, the copy rides near the page, the bar plate
            cuts across between them, and the panel floats in front. The
            overlap is what makes the parallax legible — flat columns
            side by side have nothing to travel against. */}
        <div className="visit-stack">
          <figure className="vs-plate vs-plate--a rise" data-par="-1.8">
            <img src="/room/room-a.webp" alt="" loading="lazy" width="900" height="1200" />
          </figure>

          <div className="vs-copy rise">
            <span className="eyebrow">The place</span>
            <h2 className="display">
              Come sit<br />
              with us.
            </h2>
            <p className="lede">
              We built a room worth staying in — good light, real tables, no rush to turn
              your seat. Bring your laptop, bring a friend, or bring nobody at all.
            </p>
            <div className="cta-row">
              <a className="btn btn-solid btn-icon" href="#">
                <span>Open in Maps</span>
                <i className="btn-dot" aria-hidden="true">↗</i>
              </a>
              <a className="btn btn-ghost" href="#">Instagram</a>
            </div>
          </div>

          <figure className="vs-plate vs-plate--b rise" data-par="-0.7">
            <img src="/room/room-b.webp" alt="" loading="lazy" width="1000" height="750" />
          </figure>

          <div className="vs-panel rise">
            <div data-par="1.8">
              <dl className="info">
                <div>
                  <dt>Address</dt>
                  <dd>Rainbow Street, Jabal Amman<br />Amman, Jordan</dd>
                </div>
                <div>
                  <dt>Hours</dt>
                  <dd>Sun–Thu &nbsp;7:00 – 22:00<br />Fri–Sat &nbsp;8:00 – 23:00</dd>
                </div>
                <div>
                  <dt>Contact</dt>
                  <dd>+962 7 9000 0000<br />hello@blk.coffee</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
