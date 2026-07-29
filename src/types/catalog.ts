import { Product, BudgetTier } from '../types';

export type ProductStatus =
  | 'draft'
  | 'review'
  | 'active'
  | 'inactive'
  | 'demo'
  | 'archived';

export type DataValidationStatus =
  | 'demo'
  | 'draft'
  | 'validated';

export type InventoryStatus =
  | 'test'
  | 'live';

export type ProductLevel =
  | 'economic'
  | 'standard'
  | 'premium';

export interface LocalizedText {
  ro: string;
  ru: string;
}

export interface LocalizedArray {
  ro: string[];
  ru: string[];
}

export interface ProductLogistics {
  weightKg?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  volumeM3?: number;
  unitsPerPallet?: number;
  heavyProduct: boolean;
  bulkyProduct: boolean;
  lockerEligible: boolean;
  craneDeliveryRecommended: boolean;
}

export interface ProductPriceConfig {
  currency: 'MDL';
  vatRate: number; // e.g. 0.20
  regularPrice: number;
  promotionalPrice?: number;
  promotionStart?: string;
  promotionEnd?: string;
  promotionActive: boolean;
  packageDiscountEligible: boolean;
  pricePro?: number;
}

export interface ProductInventoryStore {
  storeId: string;
  storeName: string;
  physicalStock: number;
  reservedStock: number;
  availableOnline: number;
  minimumStock?: number;
  pickupEnabled: boolean;
  deliveryEnabled: boolean;
  preparationTimeMinutes?: number;
  status: InventoryStatus;
}

export interface ProductImageDetail {
  id: string;
  productId: string;
  type:
    | 'main'
    | 'front'
    | 'back'
    | 'label'
    | 'detail'
    | 'application'
    | 'result'
    | 'context';
  fileName: string;
  mimeType: string;
  width?: number;
  height?: number;
  sortOrder: number;
  alt: LocalizedText;
  storageKey?: string;
  url: string; // Blob URL or static URL
}

export interface ProductDocumentDetail {
  id: string;
  productId: string;
  type:
    | 'technical_sheet'
    | 'safety_sheet'
    | 'performance_declaration'
    | 'certificate'
    | 'instructions'
    | 'warranty'
    | 'other';
  title: LocalizedText;
  language: 'ro' | 'ru' | 'en' | 'de' | 'other';
  fileName: string;
  mimeType: string;
  storageKey?: string;
  version?: string;
  documentDate?: string;
  validated: boolean;
  blobUrl?: string;
  fileSize?: number; // bytes
}

export interface TechnicalAttributeValue {
  code: string;
  label: LocalizedText;
  value: string | number | boolean;
  unit?: string;
}

export interface TechnicalAttributeDefinition {
  id: string;
  categoryId: string;
  code: string;
  label: LocalizedText;
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect' | 'range';
  unit?: string;
  required?: boolean;
  filterable?: boolean;
  calculatorRelevant?: boolean;
  options?: LocalizedText[];
}

export interface CatalogProduct {
  id: string;
  slug: string;

  sku: string;
  barcode?: string;

  brandId: string;
  brandName: string;

  categoryId: string;
  categoryName: LocalizedText;
  subcategoryId?: string;
  subcategoryName?: LocalizedText;

  status: ProductStatus;
  dataValidationStatus: DataValidationStatus;
  inventoryStatus: InventoryStatus;

  level?: ProductLevel;

  name: LocalizedText;
  shortDescription: LocalizedText;
  fullDescription: LocalizedText;

  benefits: LocalizedArray;
  applications: LocalizedArray;
  limitations: LocalizedArray;
  warnings: LocalizedArray;

  salesUnit: string; // e.g. 'bag', 'piece', 'box', 'bucket', 'can', 'roll', 'sqm'
  salesUnitDisplay?: LocalizedText;
  packageQuantity?: number;
  packageWeightKg?: number;
  packageVolumeL?: number;

  consumptionPerSqM?: number;
  consumptionUnit?: string;

  logistics: ProductLogistics;
  price: ProductPriceConfig;

  inventory: ProductInventoryStore[];

  images: ProductImageDetail[];
  documents: ProductDocumentDetail[];

  technicalAttributes: TechnicalAttributeValue[];

  searchTerms: LocalizedArray;

  complementaryProductIds: string[];
  similarProductIds: string[];

  alternativeProductIds: {
    economic?: string;
    standard?: string;
    premium?: string;
  };

  incompatibleProductIds?: string[];

  projectIds: string[];
  calculatorIds: string[];
  packageIds: string[];

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;

  // Rating & Warranty for public compatibility
  rating?: number;
  reviewCount?: number;
  warrantyYears?: number;
  qualityNote?: string;
}

/**
 * Maps a CatalogProduct to the standard Product interface for public views.
 */
export function catalogProductToPublicProduct(catProd: CatalogProduct, lang: 'ro' | 'ru' = 'ro'): Product {
  const name = catProd.name[lang] || catProd.name.ro || '';
  const description = catProd.shortDescription[lang] || catProd.shortDescription.ro || catProd.fullDescription.ro || '';
  const mainImage = catProd.images.find(img => img.type === 'main')?.url || catProd.images[0]?.url || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80';

  const cahulStock = catProd.inventory.find(i => i.storeId === 'cahul')?.physicalStock ?? 0;
  const cantemirStock = catProd.inventory.find(i => i.storeId === 'cantemir')?.physicalStock ?? 0;
  const vulcanestiStock = catProd.inventory.find(i => i.storeId === 'vulcanesti')?.physicalStock ?? 0;
  const taracliaStock = catProd.inventory.find(i => i.storeId === 'taraclia')?.physicalStock ?? 0;

  const specsRecord: Record<string, string> = {};
  catProd.technicalAttributes.forEach(attr => {
    const label = attr.label[lang] || attr.label.ro;
    const val = String(attr.value) + (attr.unit ? ` ${attr.unit}` : '');
    specsRecord[label] = val;
  });

  const qualityTierMap: Record<ProductLevel, BudgetTier> = {
    economic: 'economic',
    standard: 'standard',
    premium: 'premium'
  };

  return {
    id: catProd.id,
    sku: catProd.sku,
    name,
    brand: catProd.brandName,
    category: catProd.categoryName[lang] || catProd.categoryName.ro,
    subcategory: catProd.subcategoryName ? (catProd.subcategoryName[lang] || catProd.subcategoryName.ro) : '',
    priceRetail: catProd.price.promotionalPrice && catProd.price.promotionActive ? catProd.price.promotionalPrice : catProd.price.regularPrice,
    pricePro: catProd.price.pricePro || Math.round((catProd.price.regularPrice * 0.92) * 100) / 100,
    unit: catProd.salesUnitDisplay ? (catProd.salesUnitDisplay[lang] || catProd.salesUnitDisplay.ro) : (catProd.packageWeightKg ? `sac ${catProd.packageWeightKg}kg` : catProd.salesUnit),
    image: mainImage,
    images: catProd.images.map(img => ({
      url: img.url,
      alt: img.alt[lang] || img.alt.ro,
      type: img.type === 'main' ? 'product' : (img.type as any)
    })),
    rating: catProd.rating || 4.8,
    reviewCount: catProd.reviewCount || 12,
    inStockCahul: cahulStock,
    inStockCantemir: cantemirStock,
    inStockVulcanesti: vulcanestiStock,
    inStockTaraclia: taracliaStock,
    qualityTier: catProd.level ? qualityTierMap[catProd.level] : 'standard',
    consumptionPerSqM: catProd.consumptionPerSqM || 4.5,
    consumptionUnit: catProd.consumptionUnit || 'kg/m²',
    destination: 'both',
    description,
    specs: specsRecord,
    complementaryProductIds: catProd.complementaryProductIds,
    relatedProductIds: catProd.similarProductIds,
    warrantyYears: catProd.warrantyYears || 5,
    barcode: catProd.barcode || '',
    slug: catProd.slug,
    technicalDataStatus: catProd.dataValidationStatus === 'validated' ? 'official' : 'verified',
    qualityNote: catProd.qualityNote,
    lockerEligible: catProd.logistics.lockerEligible
  };
}
