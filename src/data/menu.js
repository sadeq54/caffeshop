/* The real Qahwa BLK board — items, prices and categories as they stand on
   blk.jo (crawled 2026-08). Names verbatim from their menu; `note` and
   `story` are pitch copy in their own casual register. Prices in JOD.
   `img` points at their real product cards in /public/menu-blk/. */
export const GROUPS = [
  {
    title: 'قهوة بلاك',
    en: 'Black Coffee',
    items: [
      {
        name: 'اسبريسو', en: 'Espresso', price: '1.00', slug: 'espresso',
        img: '/menu-blk/Espresso.webp',
        note: 'الأساس. كل شي عندنا بلش من هون.',
        meta: [['التحضير', 'دبل شوت'], ['الحجم', '60 مل'], ['السعر', '1.00 JOD']],
        story: 'قهوة مختصة بسعر دينار. هاي الجملة اللي بنيت عليها قهوة بلاك كلها.',
      },
      {
        name: 'امريكانو', en: 'Hot Americano', price: '1.00', slug: 'americano',
        img: '/menu-blk/Hot_Americano.webp',
        note: 'شوت اسبريسو ومي سخنة. بسيطة وزاكية.',
        meta: [['التحضير', 'اسبريسو + مي'], ['يتقدم', 'سخن'], ['السعر', '1.00 JOD']],
        story: 'نفس البن المختص اللي بتلاقيه بأغلى الكافيهات — بس بدينار واحد.',
      },
      {
        name: 'ايسد أميريكانو', en: 'Iced Americano', price: '1.00', slug: 'iced-americano',
        img: '/menu-blk/Iced_Americano.webp',
        note: 'نفس الشوت، على ثلج. لأيام عمّان الحرّة.',
        meta: [['التحضير', 'اسبريسو + مي'], ['يتقدم', 'بارد عالثلج'], ['السعر', '1.00 JOD']],
        story: 'الطلب الأكثر مبيعاً بمواقع الدرايف ثرو — سريع، منعش، وما بيغلى عليك.',
      },
      {
        name: 'قهوة غلي', en: 'Turkish Coffee', price: '1.00', slug: 'turkish',
        img: '/menu-blk/Turkish_Coffee.webp',
        note: 'عالأصول. هيل وقلب مظبوط.',
        meta: [['التحضير', 'عالركوة'], ['يتقدم', 'مع مي'], ['السعر', '1.00 JOD']],
        story: 'مش كل شي لازم يكون سبيشالتي — في قهوة إلها مكانها من زمان.',
      },
    ],
  },
  {
    title: 'قهوة ميلك',
    en: 'Milk Coffee',
    items: [
      {
        name: 'كابوتشينو', en: 'Cappuccino', price: '1.50', slug: 'cappuccino',
        img: '/menu-blk/Cappuccino.webp',
        note: 'رغوة غنية فوق دبل شوت.',
        meta: [['التحضير', 'دبل شوت'], ['الحليب', 'مرغي'], ['السعر', '1.50 JOD']],
        story: 'حليب مبخر عالدرجة الصح — رغوة بتضل لآخر شفة.',
      },
      {
        name: 'لاتيه', en: 'Hot Latte', price: '1.50', slug: 'latte',
        img: '/menu-blk/Hot_Latte.webp',
        note: 'الرفيق اليومي. ناعم وهادي.',
        meta: [['التحضير', 'دبل شوت'], ['الحليب', 'مبخر'], ['السعر', '1.50 JOD']],
        story: 'الكاسة اللي بتمشي معك عالجامعة كل يوم — عشان هيك سعرها منطقي.',
      },
      {
        name: 'فلات وايت', en: 'Flat White', price: '1.50', slug: 'flat-white',
        img: '/menu-blk/Hot_Flat_White.webp',
        note: 'حليب حريري، بدون قبعة رغوة.',
        meta: [['التحضير', 'دبل شوت'], ['الحليب', 'حريري'], ['السعر', '1.50 JOD']],
        story: 'للي بدهم يحسّوا بالقهوة مش بس بالحليب.',
      },
      {
        name: 'لاتيه بارد', en: 'Iced Latte', price: '1.50', slug: 'iced-latte',
        img: '/menu-blk/Iced_Latte.webp',
        note: 'عالثلج، منعش وخفيف.',
        meta: [['التحضير', 'دبل شوت'], ['يتقدم', 'بارد عالثلج'], ['السعر', '1.50 JOD']],
        story: 'الكاسة اللي بشوارع عمّان بالصيف — بإيد كل طالب جامعة.',
      },
    ],
  },
  {
    title: 'قهوة سويت',
    en: 'Sweet Coffee',
    // their cup copy, in their hand — the flirt on the board
    phrase: 'كلهم سادة إلا انتِ حلوة',
    items: [
      {
        name: 'سبانيش لاتيه', en: 'Spanish Latte', price: '2.00', slug: 'spanish-latte',
        img: '/menu-blk/Spanish_Latte.webp',
        note: 'الأشهر عالبورد. حلو ومظبوط.',
        meta: [['التحضير', 'دبل شوت'], ['الحليب', 'محلى ومكثف'], ['السعر', '2.00 JOD']],
        story: 'الطلب الأول عند نص زباينّا — سبانيش بدينارين، وين بتلاقيها؟',
      },
      {
        name: 'بستاشيو لاتيه', en: 'Pistachio Latte', price: '2.50', slug: 'pistachio-latte',
        img: '/menu-blk/Pistachio_Latte.webp',
        note: 'فستق حلبي حقيقي، مش نكهة.',
        meta: [['التحضير', 'دبل شوت'], ['النكهة', 'فستق حلبي'], ['السعر', '2.50 JOD']],
        story: 'أكتر كاسة بتنصور عندنا — خضرا، حلوة، وبتجنن.',
      },
      {
        name: 'كراميل لاتيه', en: 'Caramel Latte', price: '2.50', slug: 'caramel-latte',
        img: '/menu-blk/Caramel_Latte.webp',
        note: 'كراميل محروق عالقد.',
        meta: [['التحضير', 'دبل شوت'], ['النكهة', 'كراميل'], ['السعر', '2.50 JOD']],
        story: 'حلاوة الكراميل بدون ما تغطي عالبن — التوازن هو السر.',
      },
      {
        name: 'لوتس لاتيه', en: 'Lotus Latte', price: '2.00', slug: 'lotus-latte',
        img: '/menu-blk/Lotus_Latte.webp',
        note: 'بسكوت اللوتس بكاسة.',
        meta: [['التحضير', 'دبل شوت'], ['النكهة', 'لوتس'], ['السعر', '2.00 JOD']],
        story: 'الكاسة اللي بتاخذها معك عالمشوار وبتندم إنك ما أخذت ثنتين.',
      },
    ],
  },
  {
    // the winter set — their own «٥ شريبة قهوة» collages, drinks lifted out
    // of the campaign shots. Cup copy is verbatim off their cups.
    title: 'برررد',
    en: 'Winter Warmers',
    phrase: 'بغض النظر',
    items: [
      {
        name: 'كابوتشينو', en: 'Cappuccino', price: '1.50', slug: 'iced-cappuccino',
        img: '/menu-blk/iced-cappuccino.webp',
        note: 'رغوة حريرية فوق دبل شوت، بكاسة زجاج.',
        meta: [['التحضير', 'دبل شوت'], ['الحليب', 'مرغي حرير'], ['السعر', '1.50 JOD']],
        story: 'نفس الكابوتشينو، بس بتشوف الطبقات. بغض النظر عن كل شي — القهوة أول.',
      },
      {
        name: 'هوت شوكليت', en: 'Hot Chocolate', price: '2.00', slug: 'hot-chocolate',
        img: '/menu-blk/hot-chocolate.webp',
        note: 'شوكولا سخنة مع مارشميلو. للأيام الباردة.',
        meta: [['التحضير', 'شوكولا حقيقية'], ['فوقها', 'مارشميلو'], ['السعر', '2.00 JOD']],
        story: 'أحلى شي بأيام الشتا: كاسة برررد من برا، دافية من جوا.',
      },
      {
        name: 'هوت ماتشا', en: 'Hot Matcha', price: '3.50', slug: 'hot-matcha',
        img: '/menu-blk/hot-matcha.webp',
        note: 'ماتشا سيريمونيال سخنة، بكاسة الموسم.',
        meta: [['الدرجة', 'سيريمونيال'], ['يتقدم', 'سخن'], ['السعر', '3.50 JOD']],
        story: 'نفس الماتشا اللي بتحبوها، بس دافية — وبكاسة الشتا الخاصة.',
      },
    ],
  },
  {
    title: 'ماتشا',
    en: 'Matcha',
    items: [
      {
        name: 'ماتشا كلاسيك', en: 'Classic Matcha', price: '3.50', slug: 'classic-matcha',
        img: '/menu-blk/Classic_Matcha.webp',
        note: 'ماتشا سيريمونيال، مخفوقة طازة.',
        meta: [['الدرجة', 'سيريمونيال'], ['يتقدم', 'سخن او بارد'], ['السعر', '3.50 JOD']],
        story: 'دخلنا الماتشا لما صارت زباينّا تسأل عنها — وعملناها صح من أول يوم.',
      },
      {
        name: 'ماتشا فانيلا', en: 'Vanilla Matcha', price: '3.50', slug: 'vanilla-matcha',
        img: '/menu-blk/Vanilla_Matcha.webp',
        note: 'الفانيلا بتنعّم الماتشا للي لسا جديد عليها.',
        meta: [['الدرجة', 'سيريمونيال'], ['النكهة', 'فانيلا'], ['السعر', '3.50 JOD']],
        story: 'البوابة المثالية لعالم الماتشا — ناعمة وحلوة عالقد.',
      },
      {
        name: 'ماتشا ايرل جريه', en: 'Earl Grey Matcha', price: '3.50', slug: 'earl-grey-matcha',
        img: '/menu-blk/Earl_Grey_Matcha.webp',
        note: 'برغموت وماتشا — تركيبة ما بتتوقعها.',
        meta: [['الدرجة', 'سيريمونيال'], ['النكهة', 'ايرل جريه'], ['السعر', '3.50 JOD']],
        story: 'أغرب تركيبة عالبورد وأكثر وحدة بترجع تنطلب.',
      },
    ],
  },
]

/* one flat list for the rail and for prev/next inside the dialog */
export const DISHES = GROUPS.flatMap((g) => g.items.map((it) => ({ ...it, group: g.title })))
