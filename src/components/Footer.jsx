export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div>
            <div className="foot-mark">BLK</div>
          </div>
          <div>
            <p className="lede" style={{ fontSize: 14, maxWidth: '26ch', marginBottom: 22 }}>
              Small-batch coffee.<br />
              Amman, Jordan.
            </p>
            <div className="foot-links">
              <a href="#menu">Menu</a>
              <a href="#visit">Visit</a>
              <a href="#wholesale">Wholesale</a>
              <a href="#">@blk.coffee</a>
            </div>
          </div>
        </div>
        <div className="foot-bot">
          <span>© 2026 BLK Coffee Roasters.</span>
          <span>Serving BLK in your café? hello@blk.coffee</span>
        </div>
      </div>
    </footer>
  )
}
