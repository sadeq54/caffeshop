export default function Footer() {
  return (
    <footer className="light" id="contact">
      <div className="wrap">
        <div className="foot-hero">
          <div className="foot-mark">كيف قهوتك؟</div>
          <a className="btn btn-solid btn-icon foot-order" href="http://del.blk.jo" target="_blank" rel="noreferrer">
            <span>اطلب اونلاين</span>
            <i className="btn-dot" aria-hidden="true">↖</i>
          </a>
        </div>

        <div className="foot-grid">
          <div className="foot-col foot-about">
            <img className="foot-logo" src="/brand/qahwa-blk-black.webp" alt="قهوة بلاك" width="46" height="62" />
            <p className="lede">
              قهوة بلاك هي إعادة تعريف للقهوة المختصة بروح عصرية:
              قهوة زاكية، بتتقدم بابتسامة، وبسعر منطقي.
            </p>
          </div>
          <div className="foot-col">
            <h4>الصفحات</h4>
            <a href="#top">الرئيسية</a>
            <a href="#menu">المنيو</a>
            <a href="#visit">مواقعنا</a>
          </div>
          <div className="foot-col">
            <h4>تواصل معنا</h4>
            <a href="https://blktable.blk.jo/f/?t=contact-us" target="_blank" rel="noreferrer">تواصل معنا</a>
            <a href="https://blktable.blk.jo/apply/" target="_blank" rel="noreferrer">الوظائف</a>
            <a href="https://blktable.blk.jo/f/?t=franchise-apply" target="_blank" rel="noreferrer">فرصة شراكة</a>
          </div>
          <div className="foot-col">
            <h4>تابعونا</h4>
            <a href="https://www.instagram.com/qahwablk" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.tiktok.com/@qahwablk" target="_blank" rel="noreferrer">TikTok</a>
            <a href="https://snapchat.com/t/N6NINhaN" target="_blank" rel="noreferrer">Snapchat</a>
            <a href="https://www.linkedin.com/company/qahwablk/" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>

        <div className="foot-bot">
          <span>قهوة بلاك © 2026 جميع الحقوق محفوظة.</span>
          <span>مقترح إعادة تصميم — 2026</span>
        </div>
      </div>
    </footer>
  )
}
