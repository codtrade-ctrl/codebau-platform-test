import { Product, ProjectSolution, Craftsman, Order, DigitalWarranty, DigitalInvoice, B2BCompanyProfile, CodeBauStore } from '../types';

export const MOCK_STORES: CodeBauStore[] = [
  {
    id: 'cahul',
    name: 'CodeBau Cahul',
    town: 'mun. Cahul',
    address: 'str. Sanatoriului 12',
    status: 'Stoc live',
    pickupAvailable: true,
    lockerAvailable: true,
    schedule: 'Luni-Sâmbătă: 08:00 - 18:00, Duminică: 08:00 - 15:00',
    estimatedDelivery: 'Livrare locală în 1-3 ore',
    stockKey: 'inStockCahul'
  },
  {
    id: 'cantemir',
    name: 'CodeBau Cantemir',
    town: 'orașul Cantemir',
    address: 'str. Ștefan cel Mare 5',
    status: 'Stoc live',
    pickupAvailable: true,
    lockerAvailable: true,
    schedule: 'Luni-Sâmbătă: 08:00 - 18:00, Duminică: Închis',
    estimatedDelivery: 'Livrare în raionul Cantemir (în 24h)',
    stockKey: 'inStockCantemir'
  },
  {
    id: 'vulcanesti',
    name: 'CodeBau Vulcănești',
    town: 'orașul Vulcănești',
    address: 'str. Gagarin 22',
    status: 'Stoc live',
    pickupAvailable: true,
    lockerAvailable: false,
    schedule: 'Luni-Vineri: 08:30 - 17:30, Sâmbătă: 08:30 - 14:00',
    estimatedDelivery: 'Livrare în raionul Vulcănești (în 24-48h)',
    stockKey: 'inStockVulcanesti'
  },
  {
    id: 'taraclia',
    name: 'CodeBau Taraclia',
    town: 'orașul Taraclia',
    address: 'str. Lenin 40',
    status: 'Stoc live',
    pickupAvailable: true,
    lockerAvailable: true,
    schedule: 'Luni-Sâmbătă: 08:00 - 17:30, Duminică: Închis',
    estimatedDelivery: 'Livrare în raionul Taraclia (în 24h) / Comandă Cahul',
    stockKey: 'inStockTaraclia'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  // Adeziv Ceresit CM 17 (Main Product)
  {
    id: 'prod-1',
    sku: 'CER-CM17-25',
    name: 'Adeziv Flexibil Ceresit CM 17 C2TE S1 pentru Gresie și Faianță',
    brand: 'Ceresit',
    category: 'Materiale de Construcții',
    subcategory: 'Adezivi și grunduri',
    priceRetail: 74.90,
    pricePro: 62.50,
    unit: 'sac 25kg',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1000&auto=format&fit=crop&q=80',
        alt: 'Sac adeziv gresie Ceresit CM 17 25kg - ambalaj frontal',
        type: 'packaging'
      },
      {
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1000&auto=format&fit=crop&q=80',
        alt: 'Sacul produsului în decor neutru de șantier',
        type: 'product'
      },
      {
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&auto=format&fit=crop&q=80',
        alt: 'Aplicare adeziv cu gletieră dințată pe suport',
        type: 'application'
      },
      {
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1000&auto=format&fit=crop&q=80',
        alt: 'Montarea plăcilor ceramice de mari dimensiuni',
        type: 'detail'
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80',
        alt: 'Suprafață finisată cu gresie și rosturi gata executate',
        type: 'result'
      }
    ],
    rating: 4.9,
    reviewCount: 128,
    inStockCahul: 280,
    inStockCantemir: 120,
    inStockVulcanesti: 18,
    inStockTaraclia: 90,
    qualityTier: 'premium',
    qualityNote: 'Flexibilitate superioară C2TE S1',
    consumptionPerSqM: 4.5,
    consumptionUnit: 'kg/m²',
    destination: 'both',
    description: 'Adeziv superior monocomponent, extrem de flexibil (clasa S1), ideal pentru gresie porțelanată, piatră naturală, plăci mari, la interior și exterior, inclusiv încălzire în pardoseală și piscine. Recomandat pentru suporturi critice și solicitări termice intense.',
    specs: {
      'Aderență': 'C2TE S1 (> 1 N/mm²)',
      'Consum specific': '4.5 - 5 kg/m²',
      'Timp deschis': '30 minute',
      'Temperatura aplicare': '+5°C până la +30°C',
      'Rezistență la îngheț': 'Da'
    },
    technicalDataStatus: 'mock',
    relatedProductIds: ['prod-cm11', 'prod-cm16', 'prod-cm117'],
    complementaryProductIds: ['prod-3', 'prod-2', 'prod-4', 'prod-spacers', 'prod-trowel'],
    bundleProductIds: [
      { id: 'prod-1', defaultQty: 4, label: 'Adeziv CM 17 (4 saci)' },
      { id: 'prod-3', defaultQty: 1, label: 'Grund CT 17 (1 bidon 10L)' },
      { id: 'prod-2', defaultQty: 1, label: 'Hidroizolație Mapelastic (1 set 16kg)' },
      { id: 'prod-4', defaultQty: 1, label: 'Chit Ultracolor (1 pachet 5kg)' }
    ],
    warrantyYears: 0,
    barcode: '5900086012345',
    slug: 'adeziv-flexibil-ceresit-cm17-25kg'
  },

  // Similar Adhesives for Alternative comparison
  {
    id: 'prod-cm11',
    sku: 'CER-CM11-25',
    name: 'Adeziv Standard Ceresit CM 11 Plus pentru Plăci Ceramice 25kg',
    brand: 'Ceresit',
    category: 'Materiale de Construcții',
    subcategory: 'Adezivi și grunduri',
    priceRetail: 48.50,
    pricePro: 39.90,
    unit: 'sac 25kg',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewCount: 95,
    inStockCahul: 400,
    inStockCantemir: 150,
    inStockVulcanesti: 40,
    inStockTaraclia: 110,
    qualityTier: 'economic',
    qualityNote: 'Mai accesibil • Pentru interior',
    consumptionPerSqM: 4.0,
    consumptionUnit: 'kg/m²',
    destination: 'interior',
    description: 'Adeziv de interior clasa C1T pentru placări ceramice pe suprafețe minerale stabile.',
    specs: {
      'Aderență': 'C1T (> 0.5 N/mm²)',
      'Consum specific': '4.0 kg/m²',
      'Destinație': 'Interior'
    },
    technicalDataStatus: 'mock',
    warrantyYears: 0,
    barcode: '5900086011111',
    slug: 'adeziv-standard-ceresit-cm11-25kg'
  },
  {
    id: 'prod-cm16',
    sku: 'CER-CM16-25',
    name: 'Adeziv Semi-Flexibil Ceresit CM 16 C2TE 25kg',
    brand: 'Ceresit',
    category: 'Materiale de Construcții',
    subcategory: 'Adezivi și grunduri',
    priceRetail: 62.00,
    pricePro: 51.50,
    unit: 'sac 25kg',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 110,
    inStockCahul: 310,
    inStockCantemir: 90,
    inStockVulcanesti: 15,
    inStockTaraclia: 70,
    qualityTier: 'standard',
    qualityNote: 'Nivel Standard C2TE',
    consumptionPerSqM: 4.2,
    consumptionUnit: 'kg/m²',
    destination: 'both',
    description: 'Adeziv înalt performant C2TE ideal pentru spații umede și plăci medii.',
    specs: {
      'Aderență': 'C2TE (> 1.0 N/mm²)',
      'Consum specific': '4.2 kg/m²'
    },
    technicalDataStatus: 'mock',
    warrantyYears: 0,
    barcode: '5900086016161',
    slug: 'adeziv-semi-flexibil-ceresit-cm16-25kg'
  },
  {
    id: 'prod-cm117',
    sku: 'CER-CM117-25',
    name: 'Adeziv Ultra Flexibil Ceresit CM 117 C2TE S2 25kg',
    brand: 'Ceresit',
    category: 'Materiale de Construcții',
    subcategory: 'Adezivi și grunduri',
    priceRetail: 92.00,
    pricePro: 78.00,
    unit: 'sac 25kg',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    rating: 4.95,
    reviewCount: 62,
    inStockCahul: 120,
    inStockCantemir: 30,
    inStockVulcanesti: 8,
    inStockTaraclia: 25,
    qualityTier: 'premium',
    qualityNote: 'Deformație S2 • Plăci XXL',
    consumptionPerSqM: 4.8,
    consumptionUnit: 'kg/m²',
    destination: 'both',
    description: 'Adeziv ultra-deformabil clasa S2 pentru fațade înalte, terase cu vibrații și plăci XXL.',
    specs: {
      'Aderență': 'C2TE S2 (> 1.2 N/mm²)',
      'Consum specific': '4.8 kg/m²'
    },
    technicalDataStatus: 'mock',
    warrantyYears: 0,
    barcode: '5900086011717',
    slug: 'adeziv-ultra-flexibil-ceresit-cm117-25kg',
    launchDate: '2026-07-10',
    newUntil: '2026-09-10',
    isManuallyMarkedNew: true
  },

  // Complementary Items (Auxiliary materials & tools)
  {
    id: 'prod-spacers',
    sku: 'CDB-SYS-100',
    name: 'Sistem Autonivelare Plăci Ceramice CodeBau 100 clipsuri + 100 pene',
    brand: 'CodeBau Pro',
    category: 'Scule și Echipamente',
    subcategory: 'Sisteme de Nivelare',
    priceRetail: 35.00,
    pricePro: 28.50,
    unit: 'pachet 100 buc',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 88,
    inStockCahul: 250,
    inStockCantemir: 80,
    inStockVulcanesti: 30,
    inStockTaraclia: 90,
    qualityTier: 'standard',
    qualityNote: 'Nivelare rapidă fără trepte',
    destination: 'both',
    description: 'Sistem profesional de nivelare pentru obținerea de rosturi uniforme și suprafețe perfect plane.',
    specs: {
      'Rost minim': '1.5 mm',
      'Grosime placă': '3-12 mm'
    },
    technicalDataStatus: 'mock',
    warrantyYears: 0,
    barcode: '5940001112233',
    slug: 'sistem-autonivelare-placi-100buc',
    launchDate: '2026-07-01',
    newUntil: '2026-09-01'
  },
  {
    id: 'prod-trowel',
    sku: 'CDB-TRW-10',
    name: 'Gletieră Dințată Inox 10x10 mm Mâner Bi-Material CodeBau Profi',
    brand: 'CodeBau Pro',
    category: 'Scule și Echipamente',
    subcategory: 'Scule Manuale',
    priceRetail: 28.00,
    pricePro: 22.00,
    unit: 'buc',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    rating: 4.85,
    reviewCount: 104,
    inStockCahul: 180,
    inStockCantemir: 60,
    inStockVulcanesti: 20,
    inStockTaraclia: 40,
    qualityTier: 'premium',
    qualityNote: 'Inox Suedez anticoroziv',
    destination: 'both',
    description: 'Gletieră profesională din oțel inoxidabil prevăzută cu dinți 10x10mm pentru întinderea adezivului.',
    specs: {
      'Dinte': '10x10 mm',
      'Material': 'Inox'
    },
    technicalDataStatus: 'mock',
    warrantyYears: 0,
    barcode: '5940001112244',
    slug: 'gletiera-dintata-inox-10mm'
  },

  // Hidroizolație
  {
    id: 'prod-2',
    sku: 'MAP-MAPELAST-16',
    name: 'Hidroizolație Bicomponentă Mapei Mapelastic 16kg',
    brand: 'Mapei',
    category: 'Materiale de Construcții',
    subcategory: 'Hidroizolații',
    priceRetail: 189.00,
    pricePro: 159.00,
    unit: 'set 16kg',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&auto=format&fit=crop&q=80',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=1000&auto=format&fit=crop&q=80',
        alt: 'Set hidroizolație Mapei Mapelastic 16kg',
        type: 'product'
      },
      {
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1000&auto=format&fit=crop&q=80',
        alt: 'Aplicare hidroizolație pe pardoseală baie',
        type: 'application'
      }
    ],
    rating: 4.8,
    reviewCount: 84,
    inStockCahul: 140,
    inStockCantemir: 45,
    inStockVulcanesti: 10,
    inStockTaraclia: 30,
    qualityTier: 'premium',
    consumptionPerSqM: 1.7,
    consumptionUnit: 'kg/m²/mm',
    destination: 'both',
    description: 'Mortar cimentos elastic bicomponent pentru protecția și hidroizolarea suprafețelor din beton, balcoane, terase, băi și piscine.',
    specs: {
      'Grosime minimă': '2 mm',
      'Elasticitate': 'Excelentă chiar și la -20°C',
      'Timp uscare': '4-5 ore între straturi'
    },
    technicalDataStatus: 'mock',
    warrantyYears: 0,
    barcode: '8012938102931',
    slug: 'hidroizolatie-bicomponenta-mapei-mapelastic-16kg'
  },

  // Grund CT 17
  {
    id: 'prod-3',
    sku: 'CER-CT17-10',
    name: 'Grund de Aderență Ceresit CT 17 Profi 10L',
    brand: 'Ceresit',
    category: 'Vopsele și Finisaje',
    subcategory: 'Adezivi și grunduri',
    priceRetail: 68.50,
    pricePro: 56.00,
    unit: 'bidon 10L',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=80',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1000&auto=format&fit=crop&q=80',
        alt: 'Bidon Grund Ceresit CT 17 10L',
        type: 'product'
      },
      {
        url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1000&auto=format&fit=crop&q=80',
        alt: 'Aplicare amorsă cu trafaletul pe tavan',
        type: 'application'
      }
    ],
    rating: 4.7,
    reviewCount: 92,
    inStockCahul: 320,
    inStockCantemir: 110,
    inStockVulcanesti: 25,
    inStockTaraclia: 80,
    qualityTier: 'standard',
    consumptionPerSqM: 0.15,
    consumptionUnit: 'L/m²',
    destination: 'both',
    description: 'Amorsă de profunzime fără solvent pentru pregătirea suprafețelor absorbante înainte de placarea cu gresie, gletuire sau zugrăvire.',
    specs: {
      'Timp de uscare': '2 ore',
      'Consum': '0.15 - 0.2 L/m²',
      'Culoare': 'Ușor galbenă (penetrabilitate vizibilă)'
    },
    technicalDataStatus: 'mock',
    warrantyYears: 0,
    barcode: '5900086991122',
    slug: 'grund-aderenta-ceresit-ct17-10l'
  },

  // Chit de rosturi
  {
    id: 'prod-4',
    sku: 'MAP-ULTRACOLOR-5',
    name: 'Chit de Rosturi Impermeabil Mapei Ultracolor Plus 5kg Alb',
    brand: 'Mapei',
    category: 'Vopsele și Finisaje',
    subcategory: 'Chituri de Rosturi',
    priceRetail: 54.00,
    pricePro: 44.50,
    unit: 'pachet 5kg',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80',
        alt: 'Pachet chit de rosturi Mapei Ultracolor Plus 5kg',
        type: 'product'
      }
    ],
    rating: 4.9,
    reviewCount: 150,
    inStockCahul: 210,
    inStockCantemir: 80,
    inStockVulcanesti: 12,
    inStockTaraclia: 60,
    qualityTier: 'premium',
    consumptionPerSqM: 0.35,
    consumptionUnit: 'kg/m²',
    destination: 'both',
    description: 'Chit de rosturi de înaltă performanță, modificat cu polimeri, priză și uscare rapidă, anti-mucegai (tehnologie DropEffect și BioBlock) pentru rosturi de la 2 la 20 mm.',
    specs: {
      'Lățime rost': '2 - 20 mm',
      'Proprietăți': 'Anti-mucegai, hidrofob',
      'Timp pietonal': '3 ore'
    },
    technicalDataStatus: 'mock',
    warrantyYears: 0,
    barcode: '8012938445566',
    slug: 'chit-rosturi-mapei-ultracolor-plus-5kg'
  },

  // Gresie
  {
    id: 'prod-5',
    sku: 'MAR-PORC-6060-GREY',
    name: 'Gresie Porțelanată Rectificată Marazzi Rock Grey 60x60 cm',
    brand: 'Marazzi',
    category: 'Gresie și Pardoseli',
    subcategory: 'Gresie Porțelanată',
    priceRetail: 89.90,
    pricePro: 76.00,
    unit: 'm²',
    image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&auto=format&fit=crop&q=80',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1000&auto=format&fit=crop&q=80',
        alt: 'Gresie porțelanată Marazzi Rock Grey 60x60 cm - Încăpere finisată',
        type: 'result'
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80',
        alt: 'Detaliu textură placă ceramică rectificată',
        type: 'detail'
      }
    ],
    rating: 4.8,
    reviewCount: 64,
    inStockCahul: 650,
    inStockCantemir: 220,
    inStockVulcanesti: 10,
    inStockTaraclia: 150,
    qualityTier: 'standard',
    destination: 'both',
    description: 'Gresie porțelanată italiană rectificată cu aspect contemporan de ciment/piatră gri, potrivită pentru baie, bucătărie, living și terase exterioare (R10 antiderapantă).',
    specs: {
      'Dimensiune': '60x60 cm',
      'Grosime': '9 mm',
      'Rectificată': 'Da',
      'Grad antiderapare': 'R10',
      'Ambalare': '1.44 m²/cutie'
    },
    technicalDataStatus: 'mock',
    complementaryProductIds: ['prod-1', 'prod-3', 'prod-4', 'prod-spacers'],
    warrantyYears: 0,
    barcode: '8002301992211',
    slug: 'gresie-portelanata-marazzi-rock-grey-60x60'
  },

  // Vopsea
  {
    id: 'prod-6',
    sku: 'SAV-ULTRA-15',
    name: 'Vopsea Lavabilă Superioară Savana Ultra Alb cu Teflon 15L',
    brand: 'Savana',
    category: 'Vopsele și Finisaje',
    subcategory: 'Vopsele Lavabile',
    priceRetail: 215.00,
    pricePro: 179.00,
    unit: 'găleată 15L',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=80',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1000&auto=format&fit=crop&q=80',
        alt: 'Găleată vopsea Savana Ultra Alb cu Teflon 15L',
        type: 'product'
      }
    ],
    rating: 4.9,
    reviewCount: 210,
    inStockCahul: 190,
    inStockCantemir: 70,
    inStockVulcanesti: 15,
    inStockTaraclia: 45,
    qualityTier: 'premium',
    consumptionPerSqM: 0.08,
    consumptionUnit: 'L/m²/strat',
    destination: 'interior',
    description: 'Vopsea lavabilă superioară cu aditiv Teflon, extrem de rezistentă la pătare și spălări repetate. Oprește aderența murdăriei și permite peretelui să respire.',
    specs: {
      'Putere de acoperire': '14-16 m²/L/strat',
      'Culoare': 'Alb Super Imaculat',
      'Rezistență la spălare': 'Clasa 1 (peste 10.000 cicluri)'
    },
    technicalDataStatus: 'mock',
    warrantyYears: 0,
    barcode: '5941234567890',
    slug: 'vopsea-lavabila-savana-ultra-teflon-15l'
  },

  // Scule Makita
  {
    id: 'prod-7',
    sku: 'MAK-DHR242Z-18V',
    name: 'Ciocan Rotoperfotor Profesional Makita DHR242Z 18V LXT SDS-Plus',
    brand: 'Makita',
    category: 'Scule și Echipamente',
    subcategory: 'Scule Electrice',
    priceRetail: 789.00,
    pricePro: 685.00,
    unit: 'buc',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1000&auto=format&fit=crop&q=80',
        alt: 'Ciocan rotoperfotor Makita DHR242Z 18V LXT',
        type: 'product'
      }
    ],
    rating: 4.95,
    reviewCount: 175,
    inStockCahul: 35,
    inStockCantemir: 12,
    inStockVulcanesti: 2,
    inStockTaraclia: 8,
    qualityTier: 'premium',
    destination: 'both',
    description: 'Ciocan rotoperfotor profesional fără perii (Brushless) cu 3 moduri de lucru: găurire, găurire cu percuție și dăltuire. Ergonomic, vibrații reduse AVT.',
    specs: {
      'Tensiune acumulator': '18V',
      'Energie de impact': '2.0 Joules',
      'Capacitate găurire beton': '24 mm',
      'Greutate': '3.3 kg'
    },
    technicalDataStatus: 'verified',
    warrantyYears: 3,
    barcode: '0088381658123',
    slug: 'ciocan-rotoperfotor-makita-dhr242z-18v'
  },

  // Polistiren
  {
    id: 'prod-8',
    sku: 'AUS-EPS80-100',
    name: 'Polistiren Expandat Austrotherm EPS 80 Grosime 10 cm',
    brand: 'Austrotherm',
    category: 'Materiale de Construcții',
    subcategory: 'Termoizolații',
    priceRetail: 72.00,
    pricePro: 59.90,
    unit: 'pachet (2.5 m²)',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80',
        alt: 'Plăci polistiren expandat Austrotherm EPS 80 10cm',
        type: 'product'
      }
    ],
    rating: 4.8,
    reviewCount: 98,
    inStockCahul: 500,
    inStockCantemir: 180,
    inStockVulcanesti: 40,
    inStockTaraclia: 120,
    qualityTier: 'standard',
    consumptionPerSqM: 1,
    consumptionUnit: 'm²/m²',
    destination: 'exterior',
    description: 'Plăci din polistiren expandat grafitat/standard de înaltă densitate EPS 80 pentru izolarea termică a fațadelor caselor și clădirilor.',
    specs: {
      'Conductivitate termică': '0.038 W/mK',
      'Grosime': '10 cm',
      'Suprafață pachet': '2.5 m² (5 plăci)'
    },
    technicalDataStatus: 'mock',
    warrantyYears: 0,
    barcode: '5948877112233',
    slug: 'polistiren-expandat-austrotherm-eps80-10cm'
  }
];

export const MOCK_PROJECT_SOLUTIONS: ProjectSolution[] = [
  {
    id: 'sol-1',
    title: 'Montare Gresie și Faianță (Baie / Bucătărie / Terasă)',
    slug: 'montare-gresie',
    description: 'Proiect complet de placare ceramică cu hidroizolație impermeabilă, adeziv flexibil S1, nivelare cu distanțiere autonivelante și chit rezistent la mucegai.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    category: 'Finisaje Interioare',
    estimatedDays: 4,
    defaultAreaSqM: 25,
    economicEstimate: 1450,
    standardEstimate: 2380,
    premiumEstimate: 3950,
    steps: [
      { title: 'Pregătire Suprafață & Amorsare', desc: 'Curățare, verificare planeitate, aplicare amorsă de profunzime Ceresit CT 17.' },
      { title: 'Hidroizolație Bicomponentă', desc: 'Aplicare 2 straturi impermeabile Mapei Mapelastic pe pereți și pardoseală baie.' },
      { title: 'Placare Ceramică & Nivelare', desc: 'Aplicare adeziv flexibil Ceresit CM 17 în pat plin și fixare plăci cu sisteme de nivelare.' },
      { title: 'Chituire Rosturi & Etanșare', desc: 'Chituire cu Mapei Ultracolor Plus și sigilare colțuri cu silicon sanitar.' }
    ],
    defaultProducts: {
      economic: ['prod-1', 'prod-3'],
      standard: ['prod-1', 'prod-3', 'prod-4', 'prod-5'],
      premium: ['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5']
    }
  },
  {
    id: 'sol-2',
    title: 'Termoizolație Exterior Fațadă (Sistem Polistiren 10 cm)',
    slug: 'termoizolatie-fatada',
    description: 'Anvelopare termică completă a casei cu polistiren EPS 80, plasă din fibră de sticlă, dibluri cu cui metalic și tencuială decorativă structurată.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    category: 'Izolații & Fațade',
    estimatedDays: 7,
    defaultAreaSqM: 120,
    economicEstimate: 4500,
    standardEstimate: 7200,
    premiumEstimate: 11400,
    steps: [
      { title: 'Montare polistiren', desc: 'Lipire plăci polistiren EPS 80 cu adeziv specific în cordon continuu.' },
      { title: 'Ancorare & Șpăcluire', desc: 'Fixare dibluri de siguranță, armare cu plasă fibră sticlă 145g.' },
      { title: 'Tencuială Decorativă', desc: 'Aplicare grund amorsă colorat și tencuială decorativă siliconică klinker.' }
    ],
    defaultProducts: {
      economic: ['prod-8'],
      standard: ['prod-1', 'prod-8'],
      premium: ['prod-1', 'prod-3', 'prod-8']
    }
  }
];

export const MOCK_CRAFTSMEN: Craftsman[] = [
  {
    id: 'craft-1',
    name: 'Mihai Stanciu',
    companyName: 'Stanciu Construct Profi SRL',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
    specialties: ['Gresie & Faianță', 'Hidroizolații Băi', 'Placări Piatră Naturală'],
    location: 'mun. Cahul & Raionul Cahul',
    experienceYears: 14,
    meisterLevel: 'Master',
    isVerified: true,
    rating: 4.95,
    reviewsCount: 76,
    completedJobs: 142,
    portfolioImages: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=400&auto=format&fit=crop&q=80'
    ],
    hourlyRate: 85,
    phone: '+373 XX XXX XXX',
    email: 'contact@codebau.com',
    bio: 'Meșter autorizat cu peste 14 ani de experiență în placări ceramice de înaltă precizie în sudul Republicii Moldova, băi moderne walk-in și hidroizolații profesionale Mapei/Ceresit.',
    collaborationModels: ['verified', 'codebau_managed'],
    availableFrom: '2026-08-01'
  },
  {
    id: 'craft-2',
    name: 'Echipa Dobrescu Design',
    companyName: 'Dobrescu Finisaje Premium',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    specialties: ['Zugrăveli Airless', 'Gletuire Mecanizată', 'Design Interioare'],
    location: 'Cantemir & Vulcănești',
    experienceYears: 11,
    meisterLevel: 'Premium Partner',
    isVerified: true,
    rating: 4.98,
    reviewsCount: 112,
    completedJobs: 210,
    portfolioImages: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&auto=format&fit=crop&q=80'
    ],
    hourlyRate: 110,
    phone: '+373 XX XXX XXX',
    email: 'contact@codebau.com',
    bio: 'Echipă specializată în finisaje de lux, zugrăveli mecanizate pompare airless fără praf și sisteme complete de izolații fonic-termice în sudul Republicii Moldova.',
    collaborationModels: ['simple', 'verified', 'codebau_managed'],
    availableFrom: '2026-07-29'
  },
  {
    id: 'craft-3',
    name: 'Ionel Vasile',
    companyName: 'Vasile Electric & Sanitar',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    specialties: ['Instalații Electrice', 'Încălzire în Pardoseală', 'Centrale Termice'],
    location: 'Taraclia & Vulcănești',
    experienceYears: 9,
    meisterLevel: 'Pro',
    isVerified: true,
    rating: 4.88,
    reviewsCount: 43,
    completedJobs: 88,
    portfolioImages: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&auto=format&fit=crop&q=80'
    ],
    hourlyRate: 75,
    phone: '+373 XX XXX XXX',
    email: 'contact@codebau.com',
    bio: 'Inginer electrician și instalator sanitare autorizat. Execut tablouri electrice inteligente, automatizări casă smart și încălzire în pardoseală.',
    collaborationModels: ['verified'],
    availableFrom: '2026-08-05'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'CB-2026-9821',
    date: '2026-07-26 14:30',
    clientName: 'Adrian Popescu',
    customerType: 'retail',
    customerData: {
      firstName: 'Adrian',
      lastName: 'Popescu',
      phone: '+373 69 123 456',
      email: 'adrian.popescu@gmail.com'
    },
    storeId: 'store_cahul',
    storeLocation: 'CodeBau Cahul',
    fulfillmentMethod: 'delivery',
    fulfillmentDetails: {
      deliveryAddress: {
        locality: 'mun. Cahul',
        street: 'str. Ștefan cel Mare',
        number: '14',
        recipientName: 'Adrian Popescu',
        recipientPhone: '+373 69 123 456'
      }
    },
    requestedDate: '2026-07-26',
    requestedTimeSlot: '12:00 - 16:00',
    items: [
      { product: MOCK_PRODUCTS[0], quantity: 6, appliedPrice: 74.90 },
      { product: MOCK_PRODUCTS[3], quantity: 2, appliedPrice: 54.00 }
    ],
    subtotal: 557.40,
    bundleDiscount: 0,
    promotionalDiscount: 0,
    deliveryCost: 0,
    deliveryCostStatus: 'free',
    servicesCost: 0,
    total: 557.40,
    currency: 'MDL',
    paymentMethod: 'pay_on_delivery',
    paymentStatus: 'paid',
    status: 'out_for_delivery',
    stockReservationStatus: 'reserved',
    isTestOrder: true,
    environment: 'test',
    createdAt: '2026-07-26T14:30:00Z',
    updatedAt: '2026-07-26T15:45:00Z',
    createdBy: 'system',
    termsConfirmed: true,
    deliveryMethod: 'express_site',
    trackingSteps: [
      { status: 'received', label: 'Comandă primită', date: '2026-07-26 14:30', completed: true },
      { status: 'confirmed', label: 'Comandă confirmată stoc real', date: '2026-07-26 14:32', completed: true },
      { status: 'preparing', label: 'În pregătire la magazinul central CodeBau Cahul', date: '2026-07-26 15:00', completed: true },
      { status: 'out_for_delivery', label: 'În curierat rapid pe șantier (Camion CodeBau)', date: '2026-07-26 15:45', completed: true },
      { status: 'delivered', label: 'Livrată & Predat meșter', completed: false }
    ]
  },
  {
    id: 'ord-102',
    orderNumber: 'CB-2026-9750',
    date: '2026-07-24 09:15',
    clientName: 'Adrian Popescu',
    customerType: 'retail',
    customerData: {
      firstName: 'Adrian',
      lastName: 'Popescu',
      phone: '+373 69 123 456',
      email: 'adrian.popescu@gmail.com'
    },
    storeId: 'store_cahul',
    storeLocation: 'Locker CodeBau Cahul 24/7 (Casetă #14)',
    fulfillmentMethod: 'locker_247',
    fulfillmentDetails: {
      lockerId: 'LOCKER-CAHUL',
      lockerLocation: 'CodeBau Cahul - Locker 24/7'
    },
    requestedDate: '2026-07-24',
    requestedTimeSlot: '08:00 - 12:00',
    items: [
      { product: MOCK_PRODUCTS[5], quantity: 2, appliedPrice: 215.00 }
    ],
    subtotal: 430.00,
    bundleDiscount: 0,
    promotionalDiscount: 0,
    deliveryCost: 0,
    deliveryCostStatus: 'free',
    servicesCost: 0,
    total: 430.00,
    currency: 'MDL',
    paymentMethod: 'pay_on_pickup',
    paymentStatus: 'paid',
    status: 'ready_for_pickup',
    stockReservationStatus: 'reserved',
    isTestOrder: true,
    environment: 'test',
    createdAt: '2026-07-24T09:15:00Z',
    updatedAt: '2026-07-24T11:20:00Z',
    createdBy: 'system',
    termsConfirmed: true,
    deliveryMethod: 'locker_247',
    lockerCode: 'CB-7739',
    trackingSteps: [
      { status: 'received', label: 'Comandă primită', date: '2026-07-24 09:15', completed: true },
      { status: 'confirmed', label: 'Incasare securizată', date: '2026-07-24 09:16', completed: true },
      { status: 'ready_for_pickup', label: 'Încărcat în Locker 24/7 Cahul (Cod valid 48h)', date: '2026-07-24 11:20', completed: true }
    ]
  }
];

export const MOCK_WARRANTIES: DigitalWarranty[] = [
  {
    id: 'war-1',
    invoiceNumber: 'FAC-CB-2026-9821',
    productName: 'Adeziv Flexibil Ceresit CM 17 C2TE S1 (6 saci)',
    purchaseDate: '2026-07-26',
    expiryDate: '2036-07-26',
    serialNumber: 'SN-CER-CM17-882193',
    status: 'valid'
  },
  {
    id: 'war-2',
    invoiceNumber: 'FAC-CB-2026-5510',
    productName: 'Ciocan Rotoperfotor Profesional Makita DHR242Z 18V',
    purchaseDate: '2025-11-10',
    expiryDate: '2028-11-10',
    serialNumber: 'MAK-18V-9940129',
    status: 'valid'
  }
];

export const MOCK_INVOICES: DigitalInvoice[] = [
  {
    id: 'inv-1',
    number: 'FAC-CB-2026-9821',
    date: '2026-07-26',
    totalAmount: 557.40,
    downloadUrl: '#',
    status: 'paid',
    clientType: 'Persoană Fizică'
  },
  {
    id: 'inv-2',
    number: 'FAC-CB-2026-9750',
    date: '2026-07-24',
    totalAmount: 430.00,
    downloadUrl: '#',
    status: 'paid',
    clientType: 'Persoană Fizică'
  }
];

export const MOCK_B2B_PROFILE: B2BCompanyProfile = {
  companyName: 'Constructia Viitorului SRL',
  cui: '1018600012345',
  regCom: 'MD-2026-CAHUL',
  creditLimit: 150000, // MDL
  creditUsed: 34200,
  discountRate: 14, // 14% reducerea B2B contract
  assignedAccountManager: 'George Ionescu (Senior B2B Manager Sud - contact@codebau.com)',
  costCenters: ['Șantier Centru Cahul', 'Proiect Spital Cantemir', 'Șantier Vinărie Vulcănești']
};
