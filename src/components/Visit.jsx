import { useEffect, useRef, useState } from 'react'
import { AREAS, BRANCHES, mapsUrl } from '../data/branches.js'

const NUMBERS = [
  [33, 'بالأردن'],
  [1, 'بلبنان'],
  [2, 'بلدان'],
  [34, 'مجموع الأفرع'],
]

/* Their about-page counters render 0 0 0 0 — the animation never fires.
   This one counts up once, on entry, and lands exactly. */
function Counters() {
  const ref = useRef(null)
  useEffect(() => {
    const root = ref.current
    const els = Array.from(root.querySelectorAll('b'))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      els.forEach((el, i) => (el.textContent = String(NUMBERS[i][0])))
      return
    }
    let raf = 0
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        const t0 = performance.now()
        const dur = 1400
        const tick = (now) => {
          const t = Math.min(1, (now - t0) / dur)
          const ease = 1 - Math.pow(1 - t, 3)
          els.forEach((el, i) => (el.textContent = String(Math.round(NUMBERS[i][0] * ease))))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(root)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div className="counters rise" ref={ref}>
      {NUMBERS.map(([, label]) => (
        <div className="counter" key={label}>
          <b>0</b>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

/* Locations. No parallax here any more: nothing drifts, nothing overlaps.
   The two photographs arrive with a curtain reveal on entry and then hold
   still, the facts sit in their own row, and the locator is plain text
   one tap from directions. */
export default function Visit() {
  const [area, setArea] = useState('الكل')
  const list = area === 'الكل' ? BRANCHES : BRANCHES.filter((b) => b.area === area)

  return (
    <section className="pad visit-section" id="visit">
      <div className="wrap">
        <div className="visit-head">
          <div className="rise">
            <span className="eyebrow">مواقعنا</span>
            <h2 className="display">
              موجودين<br />
              وين ما كنتوا.
            </h2>
          </div>
          <div className="visit-lead rise">
            <p className="lede">
              بتلاقونا بكل مكان؛ من جامعاتنا والمراكز الحيوية بالمدينة، لمواقع
              الدرايف ثرو، ومطار الملكة علياء، وكمان وصلنا البترا، المدينة
              الوردية؛ وحدة من عجائب الدنيا السبع.
            </p>
            <div className="cta-row">
              <a className="btn btn-solid btn-icon" href="#branches">
                <span>اقرب فرع</span>
                <i className="btn-dot" aria-hidden="true">↓</i>
              </a>
              <a className="btn btn-ghost" href="http://del.blk.jo" target="_blank" rel="noreferrer">
                اطلب اونلاين
              </a>
            </div>
          </div>
        </div>

        <div className="visit-gallery">
          <figure className="reveal vg-tall">
            <div className="reveal-clip"><img src="/places/storefront.webp" alt="واجهة فرع قهوة بلاك" loading="lazy" width="900" height="1125" /></div>
            <figcaption>الفرع الجديد · عمّان</figcaption>
          </figure>
          <figure className="reveal vg-wide">
            <div className="reveal-clip"><img src="/places/drive.webp" alt="نافذة الدرايف ثرو في قهوة بلاك" loading="lazy" width="1000" height="750" /></div>
            <figcaption>درايف ثرو · عمّان</figcaption>
          </figure>
        </div>

        <dl className="facts">
          <div className="rise">
            <dt>وين بنوصل</dt>
            <dd>جامعات · درايف ثرو · مطار الملكة علياء · البترا · بيروت (AUB)</dd>
          </div>
          <div className="rise">
            <dt>الرحلة</dt>
            <dd>من فرع واحد بـ2019 لـ34 فرع ببلدين، ولسا</dd>
          </div>
          <div className="rise">
            <dt>الجاي</dt>
            <dd>2026: نوصل العراق والامارات</dd>
          </div>
        </dl>

        {/* the locator */}
        <div className="branches rise" id="branches">
          <div className="branches-head">
            <h3>أبرز الفروع</h3>
            <span className="branches-count">{list.length} من 34 فرع</span>
          </div>
          <div className="chips" role="tablist" aria-label="المنطقة">
            {AREAS.map((a) => (
              <button
                key={a}
                type="button"
                role="tab"
                aria-selected={area === a}
                className={'chip' + (area === a ? ' is-on' : '')}
                onClick={() => setArea(a)}
              >
                {a}
              </button>
            ))}
          </div>
          <ul className="branch-list">
            {list.map((b) => (
              <li key={b.name} className="branch">
                <div className="branch-name">
                  <b>{b.name}</b>
                  <span>{b.area} · {b.note}</span>
                </div>
                <a className="branch-go" href={mapsUrl(b.q)} target="_blank" rel="noreferrer">
                  الاتجاهات <i aria-hidden="true">↖</i>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <Counters />
      </div>
    </section>
  )
}
