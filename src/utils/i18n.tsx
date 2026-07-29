import React, { createContext, useContext, useState } from 'react';

export type Language = 'ro' | 'ru';

export interface Translations {
  // Top bar
  storeLabel: string;
  liveStock: string;
  pickup247: string;
  deliverySouth: string;
  contact: string;
  demoRole: string;

  // Header & Search
  searchPlaceholder: string;
  askAi: string;
  favorites: string;
  account: string;
  cart: string;

  // Nav
  navHome: string;
  navProducts: string;
  navProjects: string;
  navServices: string;
  navCraftsmen: string;
  navProfessionals: string;
  navGuides: string;
  navPromotions: string;
  meisterClub: string;
  business360: string;

  // Hero
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  whatDoYouWantToDo: string;
  intentBuyProducts: string;
  intentBathroom: string;
  intentPainting: string;
  intentTile: string;
  intentFacade: string;
  intentRoof: string;
  intentMaterialList: string;
  intentCompanyQuote: string;

  // Hero CTAs & Advantages
  startProject: string;
  viewProducts: string;
  calculateMaterials: string;
  realtimeStock: string;
  deliverySouthShort: string;
  projectConsulting: string;

  // Categories Section
  mainCategoriesTitle: string;
  mainCategoriesSubtitle: string;
  allCategories: string;
  catMasonry: string;
  catFinishes: string;
  catTiles: string;
  catPaints: string;
  catInsulation: string;
  catRoof: string;
  catElectric: string;
  catPlumbing: string;
  catTools: string;
  catGarden: string;
  catPPE: string;

  // Quick Action Shortcuts
  shortcutCalcTitle: string;
  shortcutCalcSub: string;
  shortcutCalcBtn: string;
  shortcutCraftsmanTitle: string;
  shortcutCraftsmanSub: string;
  shortcutCraftsmanBtn: string;
  shortcutSolutionsTitle: string;
  shortcutSolutionsSub: string;
  shortcutSolutionsBtn: string;
  shortcutProTitle: string;
  shortcutProSub: string;
  shortcutProBtn: string;

  // Catalog Filters
  catalogTitle: string;
  catalogSubtitle: string;
  resetFilters: string;
  allProducts: string;
  newProducts: string;
  promotionsDiscount: string;
  recommendedTop: string;
  allCategoriesTab: string;

  // Stores & Trust Section
  storesNetworkTitle: string;
  storesNetworkSubtitle: string;
  viewLocationsSchedule: string;
  dopGuaranteed: string;
  craneDelivery: string;
  lockers247: string;
  return30Days: string;
  southMoldovaBadge: string;
  badgeLogisticCenter: string;
  badgeStoreShowroom: string;
  badgeMaterialsDepot: string;
  badgeLockerStore: string;

  // Cart & Checkout
  checkoutWithoutAccount: string;
  total: string;
  subtotal: string;
  quantity: string;
  addToCart: string;
  buyNow: string;
  inStock: string;
  outOfStock: string;
  pickupInStore: string;
  cartEmptyTitle: string;
  cartEmptyDesc: string;
  proceedToCheckout: string;
  placeOrder: string;
  orderNotes: string;
  paymentMethod: string;
  cashOnDelivery: string;
  cardPayment: string;
  deliveryMethod: string;
  siteDelivery: string;
  lockerPickup: string;
  storePickup: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;

  // Product Cards
  promoBadge: string;
  newBadge: string;
  viewDetails: string;
  sku: string;
  warrantyYears: string;
  techDocs: string;
  inStockAt: string;
  availablePickupToday: string;
  onOrderFrom: string;
  deliveryDays: string;
  savingAmount: string;
  proPriceLabel: string;
  retailPriceLabel: string;
  loginForProOffer: string;
  added: string;
  add: string;

  // Footer
  footerTagline: string;
  footerPhysicalStores: string;
  footerStoreAndServices: string;
  footerMaterialsCatalog: string;
  footerRenovationPackages: string;
  footerGuidesCenter: string;
  footerLocalStores: string;
  footerCraftsmenNetwork: string;
  footerSupportAndContact: string;
  footerRegionServed: string;
  footerLockers247: string;

  // AI & Search
  aiTitle: string;
  aiDisclaimer: string;
  noResultsFound: string;
  trySearching: string;
}

const translationsRO: Translations = {
  storeLabel: 'Magazin',
  liveStock: 'Stoc live',
  pickup247: 'Ridicare 24/7',
  deliverySouth: 'Livrare în sudul Moldovei',
  contact: 'Contact',
  demoRole: 'Admin Demo',

  searchPlaceholder: 'Caută produse, coduri, categorii sau soluții (ex: adeziv CM17, glet, vopsea)...',
  askAi: 'Întreabă AI',
  favorites: 'Favorite',
  account: 'Contul meu',
  cart: 'Coș',

  navHome: 'Acasă',
  navProducts: 'Produse',
  navProjects: 'Proiecte & calculatoare',
  navServices: 'Servicii',
  navCraftsmen: 'Meșteri',
  navProfessionals: 'Profesioniști',
  navGuides: 'Ghiduri & idei',
  navPromotions: 'Promoții',
  meisterClub: 'Meister Club (Meșteri)',
  business360: 'Business 360 (Companii)',

  heroTitle1: 'Spune-ne ce construiești.',
  heroTitle2: 'Noi calculăm, pregătim și livrăm.',
  heroSubtitle: 'Produse compatibile, cantități calculate, stoc real în Cahul și livrare programată pentru proiectul tău.',
  whatDoYouWantToDo: 'Ce vrei să faci astăzi?',
  intentBuyProducts: 'Cumpăr produse',
  intentBathroom: 'Renovez o baie',
  intentPainting: 'Zugrăvesc locuința',
  intentTile: 'Montez gresie',
  intentFacade: 'Izolez fațada',
  intentRoof: 'Construiesc acoperișul',
  intentMaterialList: 'Am o listă de materiale',
  intentCompanyQuote: 'Solicit ofertă companie',

  startProject: 'Începe un proiect',
  viewProducts: 'Vezi produsele',
  calculateMaterials: 'Calculează necesarul de materiale',
  realtimeStock: 'Stoc actualizat în timp real',
  deliverySouthShort: 'Livrare în sudul Moldovei',
  projectConsulting: 'Consultanță proiect',

  mainCategoriesTitle: 'Categorii principale de materiale',
  mainCategoriesSubtitle: 'Găsește rapid tot ce ai nevoie pentru proiectul tău de la fond la cheie.',
  allCategories: 'Toate categoriile',
  catMasonry: 'Construcții & zidărie',
  catFinishes: 'Finisaje & Gleturi',
  catTiles: 'Gresie & Faianță',
  catPaints: 'Vopsele & Lavabile',
  catInsulation: 'Termoizolații',
  catRoof: 'Sistem Acoperiș',
  catElectric: 'Instalații Electrice',
  catPlumbing: 'Instalații Sanitare',
  catTools: 'Scule & Unelte Pro',
  catGarden: 'Grădină & Exterior',
  catPPE: 'Echipament Protecție',

  shortcutCalcTitle: 'Calculează materialele',
  shortcutCalcSub: 'Află cantitatea necesară și rezerva recomandată.',
  shortcutCalcBtn: 'Deschide calculatorul',
  shortcutCraftsmanTitle: 'Găsește un meșter',
  shortcutCraftsmanSub: 'Alege profesioniști verificați din regiunea ta.',
  shortcutCraftsmanBtn: 'Vezi meșterii',
  shortcutSolutionsTitle: 'Soluții complete',
  shortcutSolutionsSub: 'Pachete pentru baie, zugrăvire, gresie și termoizolație.',
  shortcutSolutionsBtn: 'Alege lucrarea',
  shortcutProTitle: 'Pentru profesioniști',
  shortcutProSub: 'Prețuri speciale, comenzi pe șantier și avantaje Meister Club.',
  shortcutProBtn: 'Descoperă avantajele',

  catalogTitle: 'Catalog produse CodeBau',
  catalogSubtitle: 'Descoperă materiale și echipamente disponibile în',
  resetFilters: 'Resetează filtrele',
  allProducts: 'Toate Produsele',
  newProducts: 'Noutăți',
  promotionsDiscount: 'Promoții & Reduceri',
  recommendedTop: 'Recomandate (Top Calitate)',
  allCategoriesTab: 'Toate Categoriile',

  storesNetworkTitle: 'Rețeaua de magazine & Lockers 24/7 CodeBau',
  storesNetworkSubtitle: 'Operăm cu stocuri reale și 4 magazine fizice de mari dimensiuni în Cahul, Cantemir, Vulcănești și Taraclia + lockere automatizate pentru ridicare 24/7.',
  viewLocationsSchedule: 'Vezi locațiile & programul',
  dopGuaranteed: 'Declarații de Performanță (DoP) garantate',
  craneDelivery: 'Livrare cu macara pe șantier',
  lockers247: 'Lockere de ridicare 24/7',
  return30Days: 'Retur garantat 30 zile',
  southMoldovaBadge: 'Sudul Republicii Moldova',
  badgeLogisticCenter: 'Centru Logistic',
  badgeStoreShowroom: 'Magazin & Showroom',
  badgeMaterialsDepot: 'Depozit Materiale',
  badgeLockerStore: 'Locker 24/7 + Magazin',

  checkoutWithoutAccount: 'Cumpără fără cont',
  total: 'Total',
  subtotal: 'Subtotal',
  quantity: 'Cantitate',
  addToCart: 'Adaugă în coș',
  buyNow: 'Cumpără acum',
  inStock: 'În stoc',
  outOfStock: 'Stoc epuizat',
  pickupInStore: 'Ridicare din magazin',
  cartEmptyTitle: 'Coșul tău este gol',
  cartEmptyDesc: 'Adaugă materiale de calitate din catalog pentru a începe comanda.',
  proceedToCheckout: 'Continuă spre finalizare',
  placeOrder: 'Trimite comanda',
  orderNotes: 'Mențiuni comanda / șantier',
  paymentMethod: 'Metodă de plată',
  cashOnDelivery: 'Plată la livrare (numerar / card)',
  cardPayment: 'Plată online cu cardul',
  deliveryMethod: 'Metodă de livrare',
  siteDelivery: 'Livrare pe șantier cu descărcare',
  lockerPickup: 'Ridicare 24/7 din Locker CodeBau',
  storePickup: 'Ridicare din magazinul selectat',
  fullName: 'Nume și Prenume',
  phone: 'Număr de telefon',
  address: 'Adresa de livrare',
  city: 'Oraș / Localitate',

  promoBadge: 'PROMOȚIE',
  newBadge: 'NOUTATE',
  viewDetails: 'Vezi detalii',
  sku: 'Cod',
  warrantyYears: 'Garanție',
  techDocs: 'Documentație tehnică',
  inStockAt: 'În stoc la',
  availablePickupToday: 'Ridicare disponibilă astăzi',
  onOrderFrom: 'La comandă din',
  deliveryDays: 'Livrare în 1–2 zile',
  savingAmount: 'Economisești',
  proPriceLabel: 'Preț Meister / B2B',
  retailPriceLabel: 'Preț Persoană Fizică',
  loginForProOffer: 'Autentifică-te pentru oferta meșteri / B2B',
  added: 'Adăugat!',
  add: 'Adaugă',

  footerTagline: 'Soluția completă pentru construcții, renovări și materiale de calitate în sudul Republicii Moldova.',
  footerPhysicalStores: 'Magazine fizice & Lockers 24/7:',
  footerStoreAndServices: 'Magazin și servicii',
  footerMaterialsCatalog: 'Catalog Materiale',
  footerRenovationPackages: 'Pachete Renovare',
  footerGuidesCenter: 'Centrul CodeBau (Ghiduri)',
  footerLocalStores: 'Magazine & Stocuri Local',
  footerCraftsmenNetwork: 'Rețeaua de Meșteri',
  footerSupportAndContact: 'Suport și contact',
  footerRegionServed: 'Regiune deservită: Sudul Republicii Moldova',
  footerLockers247: 'Ridicare și lockere 24/7 în magazinele selectate',

  aiTitle: 'Asistent AI CodeBau',
  aiDisclaimer: 'Răspuns bazat pe documentația tehnică disponibilă.',
  noResultsFound: 'Nu am găsit exact acest produs.',
  trySearching: 'Încearcă să folosești un termen mai general sau pune o întrebare Asistentului AI.'
};

const translationsRU: Translations = {
  storeLabel: 'Магазин',
  liveStock: 'Live-наличие',
  pickup247: 'Самовывоз 24/7',
  deliverySouth: 'Доставка по югу Молдовы',
  contact: 'Контакты',
  demoRole: 'Админ Демо',

  searchPlaceholder: 'Поиск товаров, кодов, категорий, решений (напр: клей CM17, шпатлевка, краска)...',
  askAi: 'Спросить ИИ',
  favorites: 'Избранное',
  account: 'Мой аккаунт',
  cart: 'Корзина',

  navHome: 'Главная',
  navProducts: 'Товары',
  navProjects: 'Проекты и калькуляторы',
  navServices: 'Услуги',
  navCraftsmen: 'Мастера',
  navProfessionals: 'Профессионалам',
  navGuides: 'Гиды и идеи',
  navPromotions: 'Акции',
  meisterClub: 'Meister Club (Мастера)',
  business360: 'Business 360 (Компании)',

  heroTitle1: 'Скажите, что вы строите.',
  heroTitle2: 'Мы рассчитаем, подготовим и доставим.',
  heroSubtitle: 'Совместимые товары, рассчитанное количество, реальное наличие в Кагуле и запланированная доставка для вашего проекта.',
  whatDoYouWantToDo: 'Что вы хотите сделать сегодня?',
  intentBuyProducts: 'Купить товары',
  intentBathroom: 'Ремонт ванной',
  intentPainting: 'Покраска жилья',
  intentTile: 'Укладка плитки',
  intentFacade: 'Утепление фасада',
  intentRoof: 'Монтаж крыши',
  intentMaterialList: 'Есть список материалов',
  intentCompanyQuote: 'Запросить КП компании',

  startProject: 'Начать проект',
  viewProducts: 'Смотреть товары',
  calculateMaterials: 'Рассчитать расход материалов',
  realtimeStock: 'Наличие в реальном времени',
  deliverySouthShort: 'Доставка по югу Молдовы',
  projectConsulting: 'Консультация по проекту',

  mainCategoriesTitle: 'Основные категории материалов',
  mainCategoriesSubtitle: 'Быстро найдите всё необходимое для вашего проекта от фундамента до отделки.',
  allCategories: 'Все категории',
  catMasonry: 'Строительство и кладка',
  catFinishes: 'Отделка и шпатлевки',
  catTiles: 'Плитка и керамогранит',
  catPaints: 'Краски и грунтовки',
  catInsulation: 'Теплоизоляция',
  catRoof: 'Кровельные системы',
  catElectric: 'Электромонтаж',
  catPlumbing: 'Сантехника и водопровод',
  catTools: 'Профессиональный инструмент',
  catGarden: 'Сад и благоустройство',
  catPPE: 'Спецодежда и защита',

  shortcutCalcTitle: 'Расчет материалов',
  shortcutCalcSub: 'Узнайте необходимое количество и рекомендуемый запас.',
  shortcutCalcBtn: 'Открыть калькулятор',
  shortcutCraftsmanTitle: 'Найти мастера',
  shortcutCraftsmanSub: 'Выберите проверенных специалистов в вашем регионе.',
  shortcutCraftsmanBtn: 'Смотреть мастеров',
  shortcutSolutionsTitle: 'Готовые решения',
  shortcutSolutionsSub: 'Комплекты для ванной, покраски, плитки и утепления.',
  shortcutSolutionsBtn: 'Выбрать решение',
  shortcutProTitle: 'Для профессионалов',
  shortcutProSub: 'Специальные цены, заказ на объект и бонусы Meister Club.',
  shortcutProBtn: 'Узнать преимущества',

  catalogTitle: 'Каталог товаров CodeBau',
  catalogSubtitle: 'Откройте для себя материалы и оборудование в наличии в',
  resetFilters: 'Сбросить фильтры',
  allProducts: 'Все товары',
  newProducts: 'Новинки',
  promotionsDiscount: 'Акции и скидки',
  recommendedTop: 'Рекомендуемые (Топ качество)',
  allCategoriesTab: 'Все категории',

  storesNetworkTitle: 'Сеть магазинов и локкеров 24/7 CodeBau',
  storesNetworkSubtitle: 'Мы работаем с реальным наличием и 4 крупными магазинами в Кагуле, Кантемире, Вулканештах и Тараклии + автоматизированные локкеры 24/7.',
  viewLocationsSchedule: 'Локации и график работы',
  dopGuaranteed: 'Гарантированные Декларации качества (DoP)',
  craneDelivery: 'Доставка манипулятором на объект',
  lockers247: 'Локкеры выдачи 24/7',
  return30Days: 'Гарантия возврата 30 дней',
  southMoldovaBadge: 'Юг Республики Молдова',
  badgeLogisticCenter: 'Логистический Центр',
  badgeStoreShowroom: 'Магазин и Шоурум',
  badgeMaterialsDepot: 'Склад материалов',
  badgeLockerStore: 'Локкер 24/7 + Магазин',

  checkoutWithoutAccount: 'Покупка без регистрации',
  total: 'Итого',
  subtotal: 'Подытог',
  quantity: 'Количество',
  addToCart: 'В корзину',
  buyNow: 'Купить сейчас',
  inStock: 'В наличии',
  outOfStock: 'Нет в наличии',
  pickupInStore: 'Самовывоз из магазина',
  cartEmptyTitle: 'Ваша корзина пуста',
  cartEmptyDesc: 'Добавьте качественные материалы из каталога, чтобы начать заказ.',
  proceedToCheckout: 'Перейти к оформлению',
  placeOrder: 'Отправить заказ',
  orderNotes: 'Заметки к заказу / объекту',
  paymentMethod: 'Способ оплаты',
  cashOnDelivery: 'Оплата при получении (наличными / картой)',
  cardPayment: 'Онлайн-оплата картой',
  deliveryMethod: 'Способ доставки',
  siteDelivery: 'Доставка на объект с выгрузкой',
  lockerPickup: 'Выдача 24/7 из локкера CodeBau',
  storePickup: 'Самовывоз из выбранного магазина',
  fullName: 'Имя и Фамилия',
  phone: 'Номер телефона',
  address: 'Адрес доставки',
  city: 'Город / Населенный пункт',

  promoBadge: 'АКЦИЯ',
  newBadge: 'НОВИНКА',
  viewDetails: 'Подробнее',
  sku: 'Код',
  warrantyYears: 'Гарантия',
  techDocs: 'Техдокументация',
  inStockAt: 'В наличии в',
  availablePickupToday: 'Забрать можно сегодня',
  onOrderFrom: 'Под заказ из',
  deliveryDays: 'Доставка за 1–2 дня',
  savingAmount: 'Экономия',
  proPriceLabel: 'Цена Meister / B2B',
  retailPriceLabel: 'Розничная цена',
  loginForProOffer: 'Войдите для спеццены мастеров / B2B',
  added: 'Добавлено!',
  add: 'Добавить',

  footerTagline: 'Комплексное решение для строительства, ремонта и качественных материалов на юге Республики Молдова.',
  footerPhysicalStores: 'Физические магазины и локкеры 24/7:',
  footerStoreAndServices: 'Магазин и услуги',
  footerMaterialsCatalog: 'Каталог материалов',
  footerRenovationPackages: 'Комплекты для ремонта',
  footerGuidesCenter: 'Центр CodeBau (Гиды)',
  footerLocalStores: 'Магазины и локальное наличие',
  footerCraftsmenNetwork: 'Сеть мастеров',
  footerSupportAndContact: 'Поддержка и контакты',
  footerRegionServed: 'Обслуживаемый регион: Юг Республики Молдова',
  footerLockers247: 'Выдача и локкеры 24/7 в выбранных магазинах',

  aiTitle: 'ИИ Консультант CodeBau',
  aiDisclaimer: 'Ответ на основе доступной технической документации.',
  noResultsFound: 'Точный товар не найден.',
  trySearching: 'Попробуйте ввести более общий термин или задайте вопрос ИИ Консультанту.'
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ro',
  setLanguage: () => {},
  t: translationsRO,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('codebau_lang');
    return (saved === 'ru' || saved === 'ro') ? saved : 'ro';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('codebau_lang', lang);
  };

  const t = language === 'ru' ? translationsRU : translationsRO;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

