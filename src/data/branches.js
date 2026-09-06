/* Their branches as THEY name them (about-page timeline + homepage copy).
   34 in total; these are the ones they call out by name. Map links go to a
   Google Maps search for the branch — our own locator, no hand-off to the
   old site. */
export const AREAS = ['الكل', 'عمّان', 'الزرقاء', 'المطار', 'البترا', 'لبنان']

export const BRANCHES = [
  { name: 'عبدون', area: 'عمّان', note: 'الفرع الأول · 2019', q: 'قهوة بلاك عبدون' },
  { name: 'العبدلي', area: 'عمّان', note: '2021', q: 'قهوة بلاك العبدلي' },
  { name: 'الفحيص', area: 'عمّان', note: '2021', q: 'قهوة بلاك الفحيص' },
  { name: 'المدينة', area: 'عمّان', note: '2022', q: 'قهوة بلاك المدينة الرياضية' },
  { name: 'السابع', area: 'عمّان', note: '2023', q: 'قهوة بلاك الدوار السابع' },
  { name: 'خلدا', area: 'عمّان', note: '2023', q: 'قهوة بلاك خلدا' },
  { name: 'الياسمين', area: 'عمّان', note: '2023', q: 'قهوة بلاك الياسمين' },
  { name: 'كيا', area: 'عمّان', note: '2022', q: 'قهوة بلاك كيا' },
  { name: 'الزرقاء', area: 'الزرقاء', note: '2022', q: 'قهوة بلاك الزرقاء' },
  { name: 'مطار الملكة علياء', area: 'المطار', note: 'قبل ما تسافر', q: 'قهوة بلاك مطار الملكة علياء' },
  { name: 'البترا', area: 'البترا', note: 'المدينة الوردية', q: 'قهوة بلاك البترا' },
  { name: 'الجامعة الأميركية في بيروت', area: 'لبنان', note: 'أول فرع برا الأردن · 2025', q: 'Qahwa BLK AUB Beirut' },
]

export const mapsUrl = (q) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q)
