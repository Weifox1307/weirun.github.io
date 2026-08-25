export const SITE = {
  name: "WEIRUN",
  tagline: "Победы начинаются с тебя",
  kicker: "Современный и быстрый трекер",
  headline: "для бега",
  description:
    "GPS-трекер, статистика, тренерские планы, история забегов и многое другое — в одном приложении.",
  launchAt: "2026-08-25T11:15:00+03:00",
  // GitHub Releases, not the repo tree. Example:
  // https://github.com/LOGIN/REPO/releases/latest/download/WEIRUN.apk
  apkUrl: "https://github.com/Weifox1307/weirun.github.io/releases/download/v1.0.0/WEIRUN.apk",
  apkFileName: "WEIRUN.apk",
  rustoreUrl: "https://www.rustore.ru/",
  appgalleryUrl: "https://appgallery.huawei.com/",
  year: 2026,
} as const;

export const NAV = [
  { href: "#features", label: "Возможности" },
  { href: "#showcase", label: "Экраны" },
  { href: "#download", label: "Скачать" },
] as const;

export const FEATURES = [
  {
    id: "gps",
    title: "GPS-трекер",
    text: "Карта, готовность спутников и старт одной кнопкой. Пишет маршрут в любых условиях.",
    icon: "navigation",
  },
  {
    id: "live",
    title: "Живая статистика",
    text: "Темп, время, шаги, набор высоты и калории — на одном экране во время забега.",
    icon: "activity",
  },
  {
    id: "coach",
    title: "Тренерский хаб",
    text: "Подключение к тренеру по ID и недельные планы с прогрессом всегда под рукой.",
    icon: "whistle",
  },
  {
    id: "profile",
    title: "Профиль атлета",
    text: "Уровни, Runner ID, физические показатели и верифицированный социальный профиль.",
    icon: "user",
  },
  {
    id: "archive",
    title: "Архив треков",
    text: "Вся история забегов: поиск, фильтры по дистанции, темп, скорость и шаги.",
    icon: "history",
  },
  {
    id: "stats",
    title: "Аналитика",
    text: "Прогресс и форма за всё время.",
    icon: "chart",
  },
  {
    id: "achievements",
    title: "До 100 достижений",
    text: "Дистанция, серии дней, темп — цели разного уровня сложности и опыт за каждую.",
    icon: "medal",
  },
] as const;

export const SCREENS = [
  { src: "/screens/01.jpg", alt: "Главный экран WEIRUN со стартом и картой", caption: "Старт" },
  { src: "/screens/02.jpg", alt: "Экран записи забега с живой статистикой", caption: "Трекинг" },
  { src: "/screens/03.jpg", alt: "Подключение к тренеру и недельный план", caption: "Тренер" },
  { src: "/screens/04.jpg", alt: "Профиль атлета и основные данные", caption: "Профиль" },
  { src: "/screens/05.jpg", alt: "Архив треков и история забегов", caption: "Архив" },
  { src: "/screens/06.jpg", alt: "Аналитика прогресса и формы", caption: "Аналитика" },
  { src: "/screens/07.jpg", alt: "Достижения и уровни сложности", caption: "Достижения" },
] as const;
