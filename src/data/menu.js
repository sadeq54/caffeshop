/* The menu, with the detail each item opens into.
   `meta` is the spec a regular reads; `story` is the reason it is on the bar. */
export const GROUPS = [
  {
    title: 'Espresso',
    items: [
      {
        name: 'Espresso', price: '1.50', slug: 'espresso',
        note: 'Dense, sweet, chocolate finish.',
        meta: [['Dose', '18g'], ['Time', '26 to 30s'], ['Serve', '40ml, ceramic']],
        story: 'Our house blend, pulled short. If it runs long we pour it away and start again.',
      },
      {
        name: 'Cortado', price: '2.00', slug: 'cortado',
        note: 'Equal parts. For people who want to taste the coffee.',
        meta: [['Dose', '18g'], ['Milk', '60ml'], ['Serve', '120ml glass']],
        story: 'Steamed just past warm, so the milk sweetens without burying the shot.',
      },
      {
        name: 'Flat White', price: '2.50', slug: 'flat-white',
        note: 'Silky milk, double shot, no foam hat.',
        meta: [['Dose', '18g'], ['Milk', '140ml'], ['Serve', '180ml']],
        story: 'Poured flat, no dome. Here the milk is texture, not decoration.',
      },
      {
        name: 'Latte', price: '2.50', slug: 'latte',
        note: 'Softer, longer, comforting.',
        meta: [['Dose', '18g'], ['Milk', '220ml'], ['Serve', '260ml']],
        story: 'The one to sit with. Longer and milder, built on the same shot.',
      },
      {
        name: 'Piccolo', price: '2.00', slug: 'piccolo',
        note: 'One shot, a little milk. Espresso with the edges softened.',
        meta: [['Dose', '18g'], ['Milk', '40ml'], ['Serve', '90ml glass']],
        story: 'For when a cortado is too much milk and an espresso is too little.',
      },
    ],
  },
  {
    title: 'Filter & Cold',
    items: [
      {
        name: 'V60', price: '3.00', slug: 'v60',
        note: "Brewed to order. Ask what's on today.",
        meta: [['Dose', '15g'], ['Water', '250ml'], ['Time', '2:45']],
        story: 'Single origin, ground at the bar, poured in four stages.',
      },
      {
        name: 'Batch Brew', price: '2.00', slug: 'batch-brew',
        note: 'Fresh every 40 minutes. Never stewed.',
        meta: [['Dose', '60g'], ['Water', '1L'], ['Hold', '40 minutes']],
        story: 'Brewed by the litre and binned on the clock, whether it sold or not.',
      },
      {
        name: 'Cold Brew', price: '2.75', slug: 'cold-brew',
        note: '18 hours, steeped slow. Smooth, low acid.',
        meta: [['Steep', '18 hours'], ['Ratio', '1:8'], ['Serve', '250ml over ice']],
        story: 'Steeped cold overnight, filtered twice, kept four days at the most.',
      },
      {
        name: 'Iced Latte', price: '3.00', slug: 'iced-latte',
        note: 'Over hand-cut ice.',
        meta: [['Dose', '18g'], ['Milk', '180ml'], ['Ice', 'Hand-cut']],
        story: 'Big pieces melt slower, so the last mouthful tastes like the first.',
      },
      {
        name: 'Espresso Tonic', price: '3.25', slug: 'espresso-tonic',
        note: 'Tonic, ice, a shot poured over. Bright and bitter.',
        meta: [['Dose', '18g'], ['Tonic', '150ml'], ['Serve', 'Tall, over ice']],
        story: 'Built cold so the shot floats before it folds in. Order it on a hot afternoon.',
      },
    ],
  },
  {
    title: 'Beans to take home',
    items: [
      {
        name: 'BLK House', price: '9.00', slug: 'blk-house',
        note: '250g · Chocolate, hazelnut, brown sugar.',
        meta: [['Origin', 'Brazil, Colombia'], ['Process', 'Washed'], ['Roast', 'Medium']],
        story: 'The blend the bar runs on, roasted three times a week.',
      },
      {
        name: 'Yirgacheffe', price: '11.00', slug: 'yirgacheffe',
        note: '250g · Bright and fruity. Rotates monthly.',
        meta: [['Origin', 'Ethiopia'], ['Process', 'Washed'], ['Roast', 'Light']],
        story: 'Floral and citric. The lot changes month to month, so the notes move with it.',
      },
      {
        name: 'Huila', price: '10.00', slug: 'huila',
        note: '250g · Red apple, caramel, clean finish.',
        meta: [['Origin', 'Colombia'], ['Process', 'Washed'], ['Roast', 'Medium light']],
        story: 'Grown high in Huila, bought direct, paid above the commodity price.',
      },
      {
        name: 'Nyeri', price: '11.50', slug: 'nyeri',
        note: '250g · Blackcurrant and cane sugar. Bold.',
        meta: [['Origin', 'Kenya'], ['Process', 'Washed'], ['Roast', 'Light']],
        story: 'Kenyan SL28. Sharp, sweet and unmistakable in the cup.',
      },
      {
        name: 'Decaf', price: '9.00', slug: 'decaf',
        note: '250g · Sugarcane process. Everything but the caffeine.',
        meta: [['Origin', 'Colombia'], ['Process', 'Sugarcane EA'], ['Roast', 'Medium']],
        story: 'Decaffeinated with sugarcane ethyl acetate, so the cup keeps its body.',
      },
    ],
  },
]

/* one flat list for the rail and for prev/next inside the dialog */
export const DISHES = GROUPS.flatMap((g) => g.items.map((it) => ({ ...it, group: g.title })))
