export default function Visit() {
  return (
    <section className="pad visit-section" id="visit">
      <div className="wrap">
        <div className="visit">
          <div className="rise">
            <span className="eyebrow">The place</span>
            <h2 className="display" style={{ margin: '20px 0 22px' }}>
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
          <dl className="info rise">
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
    </section>
  )
}
