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
    idle: 'One email a week, on Mondays. Unsubscribe in a click.',
    error: 'That address is missing something. Check it and try again.',
    done: 'You are on the list. The next roast note goes out Monday.',
  }[state]

  return (
    <section className="news" id="wholesale">
      <div className="wrap news-grid">
        <div className="news-copy rise">
          <span className="eyebrow">Roast list</span>
          <h2 data-par="1.0">Know what we&apos;re roasting.</h2>
          <p className="lede">One email a week. New coffees, nothing else.</p>
        </div>

        <form className="news-form rise" onSubmit={submit} noValidate>
          <div
            className={'field-shell' + (state === 'error' ? ' is-error' : '')}
            data-par="-1.0"
          >
            <div className="field-core">
              <label className="field-label" htmlFor={id}>
                Email address
              </label>
              <input
                id={id}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
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
            <span>{state === 'done' ? 'Subscribed' : 'Subscribe'}</span>
            <i className="btn-dot" aria-hidden="true">
              {state === 'done' ? '✓' : '↗'}
            </i>
          </button>
        </form>
      </div>
    </section>
  )
}
