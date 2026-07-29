import { CatalogProduct } from '../types/catalog';
import { MOCK_PRODUCTS } from './mockData';

export const FIVE_PILOT_TEMPLATES: Partial<CatalogProduct>[] = [
  {
    sku: 'PILOT-ADH-ECO-25',
    brandName: 'Ceresit',
    categoryId: 'adezivi',
    categoryName: { ro: 'Adezivi și Chituril', ru: 'Клеи и Затирки' },
    level: 'economic',
    name: {
      ro: 'Adeziv Standard Ceresit CM 9 pentru Plăci Ceramice la Interior',
      ru: 'Стандартный клей Ceresit CM 9 для керамической плитки (интерьер)'
    },
    shortDescription: {
      ro: 'Adeziv economic sub formă de pulbere pentru montarea plăcilor ceramice pe suprafețe minerale nedeformabile la interior.',
      ru: 'Экономичный клей для монтажа керамической плитки на недеформируемые минеральные основания внутри помещений.'
    },
    fullDescription: {
      ro: 'Ceresit CM 9 este destinat fixării plăcilor ceramice la interior pe tencuieli de ciment-var, șape de ciment și zidării de cărămidă. Asigură o aderență optimă pentru amenajări interioare economice.',
      ru: 'Ceresit CM 9 предназначен для крепления керамической плитки внутри помещений на цементно-известковые штукатурки и цементные стяжки.'
    },
    benefits: {
      ro: ['Raport excelent calitate-preț', 'Ușor de preparat și aplicat', 'Aderență bună pe suporturi minerale'],
      ru: ['Отличное соотношение цена-качество', 'Прост в приготовлении и нанесении', 'Хорошая адгезия']
    },
    applications: {
      ro: ['Plăci ceramice de dimensiuni mici și medii', 'Băi, bucătării și holuri la interior', 'Suporturi minerale rigide'],
      ru: ['Керамическая плитка малого и среднего формата', 'Внутренние помещения', 'Жесткие минеральные основания']
    },
    limitations: {
      ro: ['Nu se utilizează pe încălzire în pardoseală', 'Nu se recomandă la exterior', 'Nu este potrivit pentru plăci porțelanate mari'],
      ru: ['Не использовать на теплых полах', 'Не рекомендуется для наружных работ', 'Не подходит для крупноформатного керамогранита']
    },
    warnings: {
      ro: ['Conține ciment. Provoacă iritarea pielii.', 'A se păstra la loc uscat, ferit de umezeală.'],
      ru: ['Содержит цемент. Вызывает раздражение кожи.', 'Хранить в сухом месте.']
    },
    salesUnit: 'bag',
    salesUnitDisplay: { ro: 'sac 25kg', ru: 'мешок 25кг' },
    packageQuantity: 1,
    packageWeightKg: 25,
    consumptionPerSqM: 4.0,
    consumptionUnit: 'kg/m²',
    logistics: {
      weightKg: 25,
      heavyProduct: true,
      bulkyProduct: false,
      lockerEligible: false,
      craneDeliveryRecommended: true,
      unitsPerPallet: 48
    },
    price: {
      currency: 'MDL',
      vatRate: 0.20,
      regularPrice: 79.90,
      promotionalPrice: 74.90,
      promotionActive: true,
      packageDiscountEligible: true,
      pricePro: 69.50
    },
    inventory: [
      { storeId: 'cahul', storeName: 'CodeBau Cahul', physicalStock: 120, reservedStock: 10, availableOnline: 110, pickupEnabled: true, deliveryEnabled: true, status: 'test' },
      { storeId: 'cantemir', storeName: 'CodeBau Cantemir', physicalStock: 45, reservedStock: 0, availableOnline: 45, pickupEnabled: true, deliveryEnabled: true, status: 'test' },
      { storeId: 'vulcanesti', storeName: 'CodeBau Vulcănești', physicalStock: 30, reservedStock: 0, availableOnline: 30, pickupEnabled: true, deliveryEnabled: true, status: 'test' },
      { storeId: 'taraclia', storeName: 'CodeBau Taraclia', physicalStock: 50, reservedStock: 5, availableOnline: 45, pickupEnabled: true, deliveryEnabled: true, status: 'test' }
    ],
    technicalAttributes: [
      { code: 'classification', label: { ro: 'Clasificare EN 12004', ru: 'Классификация EN 12004' }, value: 'C1' },
      { code: 'consumption', label: { ro: 'Consum specific', ru: 'Удельный расход' }, value: 4.0, unit: 'kg/m²' },
      { code: 'openTime', label: { ro: 'Timp deschis', ru: 'Открытое время' }, value: '20 minute' },
      { code: 'floorHeating', label: { ro: 'Încălzire în pardoseală', ru: 'Подогрев пола' }, value: false },
      { code: 'interiorExterior', label: { ro: 'Utilizare', ru: 'Использование' }, value: 'Interior' }
    ]
  },
  {
    sku: 'PILOT-ADH-STD-25',
    brandName: 'Ceresit',
    categoryId: 'adezivi',
    categoryName: { ro: 'Adezivi și Chituril', ru: 'Клеи и Затирки' },
    level: 'standard',
    name: {
      ro: 'Adeziv Ceresit CM 11 Plus C1TE pentru Gresie și Gresie Porțelanată la Interior',
      ru: 'Клей Ceresit CM 11 Plus C1TE для плитки и керамогранита (интерьер)'
    },
    shortDescription: {
      ro: 'Adeziv îmbunătățit rezistent la alunecare cu timp deschis extins, ideal pentru gresie porțelanată la interior și plăci ceramice la exterior.',
      ru: 'Улучшенный клей с увеличенным открытым временем для керамогранита внутри и керамики снаружи.'
    },
    fullDescription: {
      ro: 'Ceresit CM 11 Plus este conceput pentru montarea plăcilor ceramice și porțelanate (până la 40x40 cm) pe suporturi minerale la interior și spații acoperite la exterior.',
      ru: 'Ceresit CM 11 Plus предназначен для укладки керамической плитки и керамогранита на минеральные основания.'
    },
    benefits: {
      ro: ['Aderență sporită C1TE', 'Rezistență excelentă la alunecare pe verticală', 'Timp deschis extins până la 30 min'],
      ru: ['Повышенная адгезия C1TE', 'Стойкость к сползанию', 'Увеличенное открытое время']
    },
    applications: {
      ro: ['Gresie porțelanată la interior', 'Plăci ceramice pe terase acoperite', 'Băi, bucătării, spații comerciale minerale'],
      ru: ['Керамогранит в интерьере', 'Плитка на крытых террасах', 'Ванные и коммерческие помещения']
    },
    limitations: {
      ro: ['Nu se folosește pe încălzire peste plăci mari', 'Necesită grunduire pe plăci de gips-carton'],
      ru: ['Не использовать для крупных форматов на теплом полу']
    },
    warnings: {
      ro: ['Protejați de îngheț în timpul uscării.'],
      ru: ['Беречь от замерзания при высыхании.']
    },
    salesUnit: 'bag',
    salesUnitDisplay: { ro: 'sac 25kg', ru: 'мешок 25кг' },
    packageQuantity: 1,
    packageWeightKg: 25,
    consumptionPerSqM: 4.5,
    consumptionUnit: 'kg/m²',
    logistics: {
      weightKg: 25,
      heavyProduct: true,
      bulkyProduct: false,
      lockerEligible: false,
      craneDeliveryRecommended: true,
      unitsPerPallet: 48
    },
    price: {
      currency: 'MDL',
      vatRate: 0.20,
      regularPrice: 119.00,
      promotionalPrice: 109.00,
      promotionActive: true,
      packageDiscountEligible: true,
      pricePro: 99.00
    },
    inventory: [
      { storeId: 'cahul', storeName: 'CodeBau Cahul', physicalStock: 180, reservedStock: 20, availableOnline: 160, pickupEnabled: true, deliveryEnabled: true, status: 'test' },
      { storeId: 'cantemir', storeName: 'CodeBau Cantemir', physicalStock: 80, reservedStock: 0, availableOnline: 80, pickupEnabled: true, deliveryEnabled: true, status: 'test' },
      { storeId: 'vulcanesti', storeName: 'CodeBau Vulcănești', physicalStock: 60, reservedStock: 0, availableOnline: 60, pickupEnabled: true, deliveryEnabled: true, status: 'test' },
      { storeId: 'taraclia', storeName: 'CodeBau Taraclia', physicalStock: 75, reservedStock: 5, availableOnline: 70, pickupEnabled: true, deliveryEnabled: true, status: 'test' }
    ],
    technicalAttributes: [
      { code: 'classification', label: { ro: 'Clasificare EN 12004', ru: 'Классификация EN 12004' }, value: 'C1TE' },
      { code: 'consumption', label: { ro: 'Consum specific', ru: 'Удельный расход' }, value: 4.5, unit: 'kg/m²' },
      { code: 'openTime', label: { ro: 'Timp deschis', ru: 'Открытое время' }, value: '30 minute' },
      { code: 'floorHeating', label: { ro: 'Încălzire în pardoseală', ru: 'Подогрев пола' }, value: false },
      { code: 'interiorExterior', label: { ro: 'Utilizare', ru: 'Использование' }, value: 'Interior & Exterior acoperit' }
    ]
  },
  {
    sku: 'PILOT-ADH-PREM-25',
    brandName: 'Ceresit',
    categoryId: 'adezivi',
    categoryName: { ro: 'Adezivi și Chituril', ru: 'Клеи и Затирки' },
    level: 'premium',
    name: {
      ro: 'Adeziv Flexibil Ceresit CM 17 C2TE S1 pentru Plăci Mari și Încălzire în Pardoseală',
      ru: 'Эластичный клей Ceresit CM 17 C2TE S1 для крупных форматов и теплого пола'
    },
    shortDescription: {
      ro: 'Adeziv super-flexibil C2TE S1 ranforsat cu fibre Fibre Force pentru plăci porțelanate mari, terase exterioare, piscine și încălzire în pardoseală.',
      ru: 'Суперэластичный клей C2TE S1 с волокнами Fibre Force для крупноформатного керамогранита, террас и теплых полов.'
    },
    fullDescription: {
      ro: 'Ceresit CM 17 oferă aderență extremă și deformabilitate înaltă S1, fiind soluția tehnică supremă pentru placări ceramice solicitate mecanic și termic la interior și exterior.',
      ru: 'Ceresit CM 17 обеспечивает высочайшую адгезию и деформируемость S1 для сложных оснований.'
    },
    benefits: {
      ro: ['Deformabilitate înaltă Clasa S1', 'Fibre Force pentru rezistență la impact', 'Ideale pentru plăci mari > 120x120cm', 'Compatibil 100% cu încălzirea în pardoseală și terase acoperite/descoperite'],
      ru: ['Класс деформируемости S1', 'Волокна Fibre Force', 'Форматы более 120x120см', 'Совместим с теплым полом и бассейнами']
    },
    applications: {
      ro: ['Plăci porțelanate de mari dimensiuni', 'Încălzire în pardoseală', 'Terase, fațade și piscine', 'Placă peste placă'],
      ru: ['Крупноформатный керамогранит', 'Теплые полы', 'Террасы, фасады и бассейны', 'Плитка на плитку']
    },
    limitations: {
      ro: ['Temperatura de aplicare între +5°C și +30°C'],
      ru: ['Температура применения от +5°C до +30°C']
    },
    warnings: {
      ro: ['Nu diluați cu aditivi neautorizați.'],
      ru: ['Не разбавлять посторонними добавками.']
    },
    salesUnit: 'bag',
    salesUnitDisplay: { ro: 'sac 25kg', ru: 'мешок 25кг' },
    packageQuantity: 1,
    packageWeightKg: 25,
    consumptionPerSqM: 4.8,
    consumptionUnit: 'kg/m²',
    logistics: {
      weightKg: 25,
      heavyProduct: true,
      bulkyProduct: false,
      lockerEligible: false,
      craneDeliveryRecommended: true,
      unitsPerPallet: 48
    },
    price: {
      currency: 'MDL',
      vatRate: 0.20,
      regularPrice: 245.00,
      promotionalPrice: 229.00,
      promotionActive: true,
      packageDiscountEligible: true,
      pricePro: 209.00
    },
    inventory: [
      { storeId: 'cahul', storeName: 'CodeBau Cahul', physicalStock: 250, reservedStock: 30, availableOnline: 220, pickupEnabled: true, deliveryEnabled: true, status: 'test' },
      { storeId: 'cantemir', storeName: 'CodeBau Cantemir', physicalStock: 110, reservedStock: 10, availableOnline: 100, pickupEnabled: true, deliveryEnabled: true, status: 'test' },
      { storeId: 'vulcanesti', storeName: 'CodeBau Vulcănești', physicalStock: 90, reservedStock: 5, availableOnline: 85, pickupEnabled: true, deliveryEnabled: true, status: 'test' },
      { storeId: 'taraclia', storeName: 'CodeBau Taraclia', physicalStock: 100, reservedStock: 10, availableOnline: 90, pickupEnabled: true, deliveryEnabled: true, status: 'test' }
    ],
    technicalAttributes: [
      { code: 'classification', label: { ro: 'Clasificare EN 12004', ru: 'Классификация EN 12004' }, value: 'C2TE S1' },
      { code: 'consumption', label: { ro: 'Consum specific', ru: 'Удельный расход' }, value: 4.8, unit: 'kg/m²' },
      { code: 'openTime', label: { ro: 'Timp deschis', ru: 'Открытое время' }, value: '30 minute' },
      { code: 'floorHeating', label: { ro: 'Încălzire în pardoseală', ru: 'Подогрев пола' }, value: true },
      { code: 'interiorExterior', label: { ro: 'Utilizare', ru: 'Использование' }, value: 'Interior & Exterior extrem' }
    ]
  },
  {
    sku: 'PILOT-PRM-CT17-10',
    brandName: 'Ceresit',
    categoryId: 'grunduri',
    categoryName: { ro: 'Grunduri și Amorse', ru: 'Грунтовки и Пропитки' },
    level: 'standard',
    name: {
      ro: 'Grund de Aderență și Profunzime Ceresit CT 17 (10 litri)',
      ru: 'Грунтовка глубокого проникновения Ceresit CT 17 (10 литров)'
    },
    shortDescription: {
      ro: 'Grund profesional fărā solvenți pentru consolidarea suporturilor absorbante și îmbunătățirea aderenței adezivilor și șapelor.',
      ru: 'Профессиональная грунтовка без растворителей для укрепления впитывающих оснований.'
    },
    fullDescription: {
      ro: 'Ceresit CT 17 penetrează în profunzime suporturile minerale absorbante (beton, tencuieli, gips-carton), egalizând absorbția de apă și prevenind uscarea prematură a adezivilor.',
      ru: 'Ceresit CT 17 глубоко проникает в минеральные основания, укрепляя их и выравнивая впитывающую способность.'
    },
    benefits: {
      ro: ['Consolidare profundă a suportului', 'Reduce și egalizează absorbția', 'Fără solvenți organici', 'Culoare galbenă pentru identificare ușoară'],
      ru: ['Глубокое укрепление', 'Снижает и выравнивает впитываемость', 'Без растворителей', 'Желтый цвет для контроля нанесения']
    },
    applications: {
      ro: ['Pregătirea pereților înainte de placare', 'Tencuieli de ipsos și gips-carton', 'Șape minerale și șape autonivelante'],
      ru: ['Подготовка стен перед облицовкой', 'Гипсовые штукатурки и гипсокартон', 'Минеральные стяжки']
    },
    limitations: {
      ro: ['Nu se aplică pe suporturi neabsorbante (metal, plastic)'],
      ru: ['Не наносить на невпитывающие основания']
    },
    warnings: {
      ro: ['Feriți de îngheț în timpul depozitării.'],
      ru: ['Беречь от замерзания.']
    },
    salesUnit: 'can',
    salesUnitDisplay: { ro: 'bidon 10L', ru: 'канистра 10л' },
    packageQuantity: 1,
    packageVolumeL: 10,
    consumptionPerSqM: 0.15,
    consumptionUnit: 'L/m²',
    logistics: {
      weightKg: 10.5,
      heavyProduct: false,
      bulkyProduct: false,
      lockerEligible: true,
      craneDeliveryRecommended: false,
      unitsPerPallet: 60
    },
    price: {
      currency: 'MDL',
      vatRate: 0.20,
      regularPrice: 189.00,
      promotionalPrice: 169.00,
      promotionActive: true,
      packageDiscountEligible: true,
      pricePro: 155.00
    },
    inventory: [
      { storeId: 'cahul', storeName: 'CodeBau Cahul', physicalStock: 90, reservedStock: 5, availableOnline: 85, pickupEnabled: true, deliveryEnabled: true, status: 'test' },
      { storeId: 'cantemir', storeName: 'CodeBau Cantemir', physicalStock: 40, reservedStock: 0, availableOnline: 40, pickupEnabled: true, deliveryEnabled: true, status: 'test' },
      { storeId: 'vulcanesti', storeName: 'CodeBau Vulcănești', physicalStock: 25, reservedStock: 0, availableOnline: 25, pickupEnabled: true, deliveryEnabled: true, status: 'test' },
      { storeId: 'taraclia', storeName: 'CodeBau Taraclia', physicalStock: 35, reservedStock: 0, availableOnline: 35, pickupEnabled: true, deliveryEnabled: true, status: 'test' }
    ],
    technicalAttributes: [
      { code: 'consumption', label: { ro: 'Consum mediu', ru: 'Средний расход' }, value: 0.15, unit: 'L/m²' },
      { code: 'dryingTime', label: { ro: 'Timp de uscare', ru: 'Время высыхания' }, value: '2-4 ore' },
      { code: 'density', label: { ro: 'Densitate', ru: 'Плотность' }, value: '1.0 kg/L' }
    ]
  },
  {
    sku: 'PILOT-ACC-SPACER-15',
    brandName: 'RKA Pro',
    categoryId: 'scule',
    categoryName: { ro: 'Scule și Unelte', ru: 'Инструменты и Аксессуары' },
    level: 'standard',
    name: {
      ro: 'Sistem de Nivelare Gresie - Clipsuri 1.5mm (Pachet 500 bucăți)',
      ru: 'Система выравнивания плитки - СВП зажимы 1.5мм (Упаковка 500 штук)'
    },
    shortDescription: {
      ro: 'Clipsuri profesionale de unică folosință pentru montajul rapid și perfect nivelat al gresiei și faianței.',
      ru: 'Профессиональные одноразовые зажимы СВП для идеального выравнивания плитки.'
    },
    fullDescription: {
      ro: 'Sistemul de nivelare previne decalajele între plăci în timpul uscării adezivului, garantând rosturi uniforme de 1.5mm și suprafețe perfect plane.',
      ru: 'Система выравнивания предотвращает перепады между плитками при высыхании клея.'
    },
    benefits: {
      ro: ['Garantează planeitate perfectă', 'Economisește timp la montaj', 'Compatibil cu plăci de grosime 3-12mm'],
      ru: ['Гарантирует идеальную плоскость', 'Экономит время укладки', 'Для плитки толщиной 3-12мм']
    },
    applications: {
      ro: ['Placări ceramice pardoseli și pereți', 'Plăci porțelanate de format mare'],
      ru: ['Укладка плитки на пол и стены', 'Крупный формат']
    },
    limitations: {
      ro: ['Pană reutilizabilă se achiziționează separat.'],
      ru: ['Клинья приобретаются отдельно.']
    },
    warnings: {
      ro: ['A se îndepărta prin lovire laterală după uscarea adezivului.'],
      ru: ['Удалять боковым ударом после высыхания клея.']
    },
    salesUnit: 'box',
    salesUnitDisplay: { ro: 'pachet 500 buc', ru: 'упак 500 шт' },
    packageQuantity: 500,
    logistics: {
      weightKg: 1.2,
      heavyProduct: false,
      bulkyProduct: false,
      lockerEligible: true,
      craneDeliveryRecommended: false
    },
    price: {
      currency: 'MDL',
      vatRate: 0.20,
      regularPrice: 149.00,
      promotionalPrice: 135.00,
      promotionActive: true,
      packageDiscountEligible: true,
      pricePro: 120.00
    },
    inventory: [
      { storeId: 'cahul', storeName: 'CodeBau Cahul', physicalStock: 150, reservedStock: 10, availableOnline: 140, pickupEnabled: true, deliveryEnabled: true, status: 'test' },
      { storeId: 'cantemir', storeName: 'CodeBau Cantemir', physicalStock: 50, reservedStock: 0, availableOnline: 50, pickupEnabled: true, deliveryEnabled: true, status: 'test' },
      { storeId: 'vulcanesti', storeName: 'CodeBau Vulcănești', physicalStock: 40, reservedStock: 0, availableOnline: 40, pickupEnabled: true, deliveryEnabled: true, status: 'test' },
      { storeId: 'taraclia', storeName: 'CodeBau Taraclia', physicalStock: 60, reservedStock: 0, availableOnline: 60, pickupEnabled: true, deliveryEnabled: true, status: 'test' }
    ],
    technicalAttributes: [
      { code: 'jointWidth', label: { ro: 'Lățime rost', ru: 'Ширина шва' }, value: '1.5 mm' },
      { code: 'tileThickness', label: { ro: 'Grosime placă', ru: 'Толщина плитки' }, value: '3 - 12 mm' },
      { code: 'piecesPerPack', label: { ro: 'Bucăți/pachet', ru: 'Штук/упаковка' }, value: 500 }
    ]
  }
];

/**
 * Converts existing mock product array into full CatalogProduct array.
 */
export function convertMockProductsToCatalogProducts(): CatalogProduct[] {
  return MOCK_PRODUCTS.map((p, idx) => {
    const isMainCeresit = p.id === 'prod-1';
    const level: any = p.qualityTier || 'standard';

    return {
      id: p.id,
      slug: p.slug || `produs-${p.id}`,
      sku: p.sku || `SKU-${1000 + idx}`,
      barcode: p.barcode || `482000000${100 + idx}`,
      brandId: p.brand.toLowerCase(),
      brandName: p.brand,
      categoryId: p.category.toLowerCase().replace(/\s+/g, '-'),
      categoryName: { ro: p.category, ru: p.category },
      subcategoryId: p.subcategory ? p.subcategory.toLowerCase().replace(/\s+/g, '-') : undefined,
      subcategoryName: p.subcategory ? { ro: p.subcategory, ru: p.subcategory } : undefined,
      status: isMainCeresit ? 'active' : 'demo',
      dataValidationStatus: isMainCeresit ? 'validated' : 'demo',
      inventoryStatus: 'test',
      level,
      name: { ro: p.name, ru: p.name },
      shortDescription: { ro: p.description || '', ru: p.description || '' },
      fullDescription: { ro: p.description || '', ru: p.description || '' },
      benefits: { ro: ['Fiabilitate garantată', 'Calitate verificată CodeBau'], ru: ['Гарантированное качество', 'Проверено CodeBau'] },
      applications: { ro: ['Construcții și amenajări interioare / exterioare'], ru: ['Строительство и ремонт'] },
      limitations: { ro: ['A se respecta fișa tehnică'], ru: ['Соблюдать инструкцию'] },
      warnings: { ro: ['A se utiliza conform indicațiilor producătorului'], ru: ['Использовать по назначению'] },
      salesUnit: 'bag',
      salesUnitDisplay: { ro: p.unit, ru: p.unit },
      packageQuantity: 1,
      packageWeightKg: p.unit.includes('25kg') ? 25 : 1,
      consumptionPerSqM: p.consumptionPerSqM || 4.5,
      consumptionUnit: p.consumptionUnit || 'kg/m²',
      logistics: {
        weightKg: p.unit.includes('25kg') ? 25 : 1,
        heavyProduct: p.unit.includes('25kg'),
        bulkyProduct: false,
        lockerEligible: !!p.lockerEligible,
        craneDeliveryRecommended: p.unit.includes('25kg')
      },
      price: {
        currency: 'MDL',
        vatRate: 0.20,
        regularPrice: p.priceRetail,
        promotionalPrice: p.priceRetail < 100 ? p.priceRetail - 5 : p.priceRetail - 15,
        promotionActive: false,
        packageDiscountEligible: true,
        pricePro: p.pricePro
      },
      inventory: [
        { storeId: 'cahul', storeName: 'CodeBau Cahul', physicalStock: p.inStockCahul || 50, reservedStock: 0, availableOnline: p.inStockCahul || 50, pickupEnabled: true, deliveryEnabled: true, status: 'test' },
        { storeId: 'cantemir', storeName: 'CodeBau Cantemir', physicalStock: p.inStockCantemir || 20, reservedStock: 0, availableOnline: p.inStockCantemir || 20, pickupEnabled: true, deliveryEnabled: true, status: 'test' },
        { storeId: 'vulcanesti', storeName: 'CodeBau Vulcănești', physicalStock: p.inStockVulcanesti || 15, reservedStock: 0, availableOnline: p.inStockVulcanesti || 15, pickupEnabled: true, deliveryEnabled: true, status: 'test' },
        { storeId: 'taraclia', storeName: 'CodeBau Taraclia', physicalStock: p.inStockTaraclia || 25, reservedStock: 0, availableOnline: p.inStockTaraclia || 25, pickupEnabled: true, deliveryEnabled: true, status: 'test' }
      ],
      images: [
        {
          id: `img-${p.id}-main`,
          productId: p.id,
          type: 'main',
          fileName: 'main_product.jpg',
          mimeType: 'image/jpeg',
          sortOrder: 1,
          alt: { ro: p.name, ru: p.name },
          url: p.image
        },
        ...(p.images || []).map((img, i) => ({
          id: `img-${p.id}-${i}`,
          productId: p.id,
          type: img.type as any,
          fileName: `image_${i}.jpg`,
          mimeType: 'image/jpeg',
          sortOrder: i + 2,
          alt: { ro: img.alt, ru: img.alt },
          url: img.url
        }))
      ],
      documents: [
        {
          id: `doc-${p.id}-1`,
          productId: p.id,
          type: 'technical_sheet',
          title: { ro: `Fișă Tehnică - ${p.name}`, ru: `Техническая карта - ${p.name}` },
          language: 'ro',
          fileName: `Fisa_Tehnica_${p.sku || p.id}.pdf`,
          mimeType: 'application/pdf',
          validated: true,
          version: '1.0'
        }
      ],
      technicalAttributes: Object.entries(p.specs || {}).map(([key, val]) => ({
        code: key.toLowerCase().replace(/\s+/g, '_'),
        label: { ro: key, ru: key },
        value: val
      })),
      searchTerms: {
        ro: [p.name, p.brand, p.category],
        ru: [p.name, p.brand, p.category]
      },
      complementaryProductIds: p.complementaryProductIds || p.complementaryIds || [],
      similarProductIds: p.relatedProductIds || [],
      alternativeProductIds: {},
      projectIds: [],
      calculatorIds: [],
      packageIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: isMainCeresit ? new Date().toISOString() : undefined,
      rating: p.rating,
      reviewCount: p.reviewCount,
      warrantyYears: p.warrantyYears,
      qualityNote: p.qualityNote
    };
  });
}
