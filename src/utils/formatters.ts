import { Product, CartItem, CartStockValidationResult, ItemStockValidation, AppSettings } from '../types';
import { MOCK_STORES } from '../data/mockData';

export const appSettings: AppSettings = {
  vatRate: 0.20, // 20% TVA Moldova
  environment: 'development'
};

/**
 * Formats currency amount in Moldovan Leu (MDL) using comma as decimal separator.
 * Example: 74.9 -> "74,90 MDL" or "74,90"
 */
export function formatPriceMDL(amount: number, includeCurrency = true): string {
  const formatted = (amount || 0).toLocaleString('ro-MD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).replace(/\./g, ',');

  return includeCurrency ? `${formatted} MDL` : formatted;
}

/**
 * Common formatMoney function required by specification:
 * formatMoney(amount, 'MDL', 'ro-MD')
 */
export function formatMoney(amount: number, currency = 'MDL', locale = 'ro-MD'): string {
  const formatted = (amount || 0).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).replace(/\./g, ',');

  return `${formatted} ${currency}`;
}

/**
 * Helper to check stock of items for a specific store.
 */
export function validateCartStock(items: CartItem[], storeName: string): CartStockValidationResult {
  const store = MOCK_STORES.find(s => s.name === storeName) || MOCK_STORES[0];
  const stockKey = store.stockKey;

  let hasInsufficient = false;
  let hasUnavailable = false;

  const itemResults: ItemStockValidation[] = items.map(item => {
    const prod = item.product;
    const availableQty = prod ? (prod[stockKey] ?? 0) : 0;
    const requestedQty = item.quantity;

    if (availableQty <= 0) {
      hasUnavailable = true;
      // Check if other store has it
      const otherStore = MOCK_STORES.find(s => {
        const k = s.stockKey;
        return (prod[k] ?? 0) >= requestedQty;
      });

      return {
        productId: prod.id,
        productName: prod.name,
        requestedQty,
        availableQty: 0,
        status: otherStore ? 'transferAvailable' : 'unavailable',
        otherStoreWithStock: otherStore?.name,
        otherStoreQty: otherStore ? (prod[otherStore.stockKey] ?? 0) : 0
      };
    } else if (availableQty < requestedQty) {
      hasInsufficient = true;
      return {
        productId: prod.id,
        productName: prod.name,
        requestedQty,
        availableQty,
        status: 'insufficient'
      };
    } else {
      return {
        productId: prod.id,
        productName: prod.name,
        requestedQty,
        availableQty,
        status: 'available'
      };
    }
  });

  return {
    isValid: !hasInsufficient && !hasUnavailable,
    hasInsufficient,
    hasUnavailable,
    itemResults
  };
}

/**
 * Generates a URL-friendly slug from text.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric except spaces & hyphens
    .trim()
    .replace(/\s+/g, '-') // spaces to hyphens
    .replace(/-+/g, '-'); // collapse multiple hyphens
}

/**
 * Find product by slug or id.
 */
export function getProductBySlug(slug: string, products: Product[]): Product | undefined {
  if (!slug) return undefined;
  
  const targetSlug = slug.toLowerCase();
  
  // 1. Direct slug or ID match
  const match = products.find(
    p => (p.slug && p.slug.toLowerCase() === targetSlug) || p.id.toLowerCase() === targetSlug
  );
  if (match) return match;

  // 2. Slugified product name match
  return products.find(p => slugify(p.name) === targetSlug);
}

/**
 * Get canonical slug for a product.
 */
export function getProductSlug(product: Product): string {
  if (product.slug) return product.slug;
  if (product.id === 'prod-1') return 'adeziv-flexibil-ceresit-cm17-25kg';
  return slugify(product.name);
}
