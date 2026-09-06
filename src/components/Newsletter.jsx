import { useId, useState } from 'react'

const VALID = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function Newsletter() {
  const id = useId()
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | error | done

  function submit(e) {
    e.preventDefault()
    if (!VALID.test(email.trim())) {
      setState('error')
      return
    }
    setState('done')
  }

  const note = {
    idle: 'ايميل واحد بالاسبوع: الجديد عالبورد، العروض، والفروع الجاي. ولا شي غير هيك.',
    error: 'الايميل ناقصه شي. تأكد منه وجرب كمان مرة.',
    done: 'تمام، صرت عالقائمة! أول ايميل بوصلك مع جديدنا الجاي.',
  }[state]

  return (
    <section className="news light" id="wholesale">
      <div className="wrap news-grid">
        <div className="news-copy rise">
          <span className="eyebrow">النشرة</span>
          <h2>اشترك الآن لتصلك آخر الأخبار!</h2>
          <p className="lede">الجديد عالمنيو، الفروع الجديدة، والايفنتات، قبل الكل.</p>
        </div>

        <form className="news-form rise" onSubmit={submit} noValidate>
          <div
            className={'field-shell' + (state === 'error' ? ' is-error' : '')}
           
          >
            <div className="field-core">
              <label className="field-label" htmlFor={id}>
                البريد الإلكتروني
              </label>
              <input
                id={id}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                dir="ltr"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (state !== 'idle') setState('idle')
                }}
                aria-invalid={state === 'error'}
                aria-describedby={`${id}-note`}
              />
            </div>
          </div>

          <p
            className={
              'field-note' + (state === 'error' ? ' is-error' : state === 'done' ? ' is-done' : '')
            }
            id={`${id}-note`}
            role="status"
          >
            {note}
          </p>

          <button className="btn btn-solid btn-icon" type="submit" disabled={state === 'done'}>
            <span>{state === 'done' ? 'تم الاشتراك' : 'إرسال'}</span>
            <i className="btn-dot" aria-hidden="true">
              {state === 'done' ? '✓' : '↖'}
            </i>
          </button>
        </form>
      </div>
    </section>
  )
}
