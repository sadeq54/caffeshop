import { useEffect, useRef } from 'react'

/* The menu, as photography. Groups keep their own rhythm (a wide plate, a
   narrower one, then a trio) so no two groups scan the same way. Each card
   wipes up from its own baseline while the image settles out of a slow zoom;
   hovering one card dims the rest so a single dish holds the page. */
const GROUPS = [
  {
    title: 'Espresso',
    spans: ['wide', 'mid', 'sm', 'sm', 'sm'],
    items: [
      ['Espresso', '1.50', 'Dense, sweet, chocolate finish.', 'espresso'],
      ['Cortado', '2.00', 'Equal parts. For people who want to taste the coffee.', 'cortado'],
      ['Flat White', '2.50', 'Silky milk, double shot, no foam hat.', 'flat-white'],
      ['Latte', '2.50', 'Softer, longer, comforting.', 'latte'],
      ['Piccolo', '2.00', 'One shot, a little milk. Espresso with the edges softened.', 'piccolo'],
    ],
  },
  {
    title: 'Filter & Cold',
    spans: ['mid', 'wide', 'sm', 'sm', 'sm'],
    items: [
      ['V60', '3.00', "Brewed to order. Ask what's on today.", 'v60'],
      ['Batch Brew', '2.00', 'Fresh every 40 minutes. Never stewed.', 'batch-brew'],
      ['Cold Brew', '2.75', '18 hours, steeped slow. Smooth, low acid.', 'cold-brew'],
      ['Iced Latte', '3.00', 'Over hand-cut ice.', 'iced-latte'],
      ['Espresso Tonic', '3.25', 'Tonic, ice, a shot poured over. Bright and bitter.', 'espresso-tonic'],
    ],
  },
  {
    title: 'Beans to take home',
    spans: ['sm', 'sm', 'sm', 'wide', 'mid'],
    items: [
      ['BLK House', '9.00', '250g · Chocolate, hazelnut, brown sugar.', 'blk-house'],
      ['Yirgacheffe', '11.00', '250g · Bright and fruity. Rotates monthly.', 'yirgacheffe'],
      ['Huila', '10.00', '250g · Red apple, caramel, clean finish.', 'huila'],
      ['Nyeri', '11.50', '250g · Blackcurrant and cane sugar. Bold.', 'nyeri'],
      ['Decaf', '9.00', '250g · Sugarcane process. Everything but the caffeine.', 'decaf'],
    ],
  },
]

export default function MenuGrid() {
  const root = useRef(null)

  useEffect(() => {
    const cards = root.current.querySelectorAll('.dish, .dish-head')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )
    cards.forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [])

  return (
    <section className="pad menu-section" id="menu" ref={root}>
      <div className="wrap">
        {GROUPS.map((g) => (
          <div className="dish-group" key={g.title}>
            <header className="dish-head">
              <h2>{g.title}</h2>
            </header>

            <div className="dish-grid">
              {g.items.map(([name, price, note, slug], i) => (
                <article
                  className={`dish dish--${g.spans[i]}`}
                  key={slug}
                  style={{ '--i': i }}
                >
                  <div className="dish-frame">
                    <img src={`/menu/${slug}.webp`} alt="" loading="lazy" width="1100" height="825" />
                  </div>
                  <div className="dish-line">
                    <h3>{name}</h3>
                    <span className="dish-price">{price}</span>
                  </div>
                  <p className="dish-note">{note}</p>
                </article>
              ))}
            </div>
          </div>
        ))}

        <p className="menu-note dish-head">
          Oat, almond and full-fat — no charge for the swap. Prices in JD.
        </p>
      </div>
    </section>
  )
}
