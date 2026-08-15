import { useState } from 'react'

export default function Newsletter() {
  const [sent, setSent] = useState(false)

  return (
    <section className="news" id="wholesale">
      <div className="wrap rise">
        <h2>Know what we&apos;re roasting.</h2>
        <p>One email a week. New coffees, nothing else.</p>
        <form
          className="field"
          onSubmit={(e) => {
            e.preventDefault()
            setSent(true)
          }}
        >
          <input type="email" placeholder="your@email.com" required aria-label="Email address" />
          <button type="submit">{sent ? 'Thanks' : 'Subscribe'}</button>
        </form>
      </div>
    </section>
  )
}
