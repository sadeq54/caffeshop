import { useRef } from 'react'
import useScrollStage from '../lib/useScrollStage.js'

/* The story, told the way the films used to tell it (pinned, scrolled, one
   beat at a time) but over a still of their own storefront instead of a
   reel. The iris opens the photo out of black, then the three beats cross
   the frame while the room slowly breathes behind them. */
export default function Manifesto() {
  const stageRef = useRef(null)
  const stickyRef = useRef(null)

  useScrollStage({ stageRef, stickyRef, scrubStart: 0.22, iris: true })

  return (
    <section className="stage stage-mf" ref={stageRef} aria-label="قصتنا">
      <div className="sticky" ref={stickyRef}>
        <div className="film-wrap">
          <img className="film-poster mf-img" src="/places/story-bg.webp" alt="" loading="lazy" width="1600" height="948" />
          <div className="scrim" />
          <div className="grain" />
        </div>
        <div className="iris-ring" aria-hidden="true"><i /></div>

        {/* the mark rides in with the aperture, then steps aside */}
        <div className="caption caption--center mf-mark" data-in="0" data-out="0.02">
          <h2 className="display script">كيف قهوتك؟</h2>
        </div>

        {/* 1 · THE QUESTION */}
        <div className="caption" data-in="0.24" data-out="0.4">
          <span className="eyebrow">جاوبنا على سؤال بسيط</span>
          <h2 className="display sm">
            «بقدر الواحد يقدّم قهوة خرافية،<br />
            مع تجربة بتجنن،<br />
            <em>وبسعر منطقي؟»</em>
          </h2>
          <p className="lede">
            بدايتنا كانت بشهر 10 سنة ال2019. لاحظنا إنه القهوة المختصة صارت رمز
            للـ«بريستيج» الزايد: أسعار غالية، منيو معقد، وأجواء بتحسسك إنك غريب.
            وبالمقابل، قهوة الشارع الرخيصة مستواها مش ثابت.
          </p>
          <div className="stats">
            <div className="stat"><b>34</b><span>فرع</span></div>
            <div className="stat"><b>+220</b><span>موظف</span></div>
            <div className="stat"><b>2</b><span>بلدان</span></div>
          </div>
        </div>

        {/* 2 · MORE THAN COFFEE */}
        <div className="caption caption--upright" data-in="0.44" data-out="0.62">
          <span className="eyebrow">مش بس قهوة</span>
          <h2 className="display">
            بنستثمر<br />
            بشبابنا.
          </h2>
          <p className="lede">
            70% من موظفينا الـ220+ طلاب جامعات أو خريجين. بندربهم على إدارة المخزون
            وتحليل الأرباح والخسائر والقيادة التشغيلية، ومنح دراسية بقيمة 1,000 دولار
            سنوياً للي بيكمل معنا سنة.
          </p>
          <p className="quote">
            بنوظف من شبابنا، وبندرب قادة للمستقبل، وبنرجع نستثمر بالمجتمعات اللي
            احنا جزء منها.
          </p>
        </div>

        {/* 3 · THE SYSTEM */}
        <div className="caption caption--floor" data-in="0.7" data-out="0.9">
          <span className="eyebrow">اللي بنآمن فيه · سيستم كروم</span>
          <h2 className="display sm">
            كل كاسة،<br />
            <em>بنفس المستوى.</em>
          </h2>
          <div className="cards">
            <div className="card"><b>كرم</b><p>مش بس بحجم الكاسة، بالابتسامة وطول البال.</p></div>
            <div className="card"><b>مسؤولية</b><p>كل فرد بيشتغل كأنه صاحب المحل.</p></div>
            <div className="card"><b>أوركسترا</b><p>مثل السيمفونية، كل دور إله قيمته.</p></div>
            <div className="card"><b>مسك</b><p>انطباع طيب يدوم، بأدق التفاصيل.</p></div>
          </div>
        </div>
      </div>
    </section>
  )
}
