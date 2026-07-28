import { Product, AppSettings, Promotion, EffectivePriceResult, PromotionAuditLog } from '../types';

export const DEFAULT_NEW_PRODUCT_DAYS = 60;

export const INITIAL_MOCK_PROMOTIONS: Promotion[] = [
  {
    id: 'PROMO-CM17-TEST',
    name: 'Promoție Ceresit CM 17 - Reducere 5 MDL',
    description: 'Reducere specială de 5,00 MDL per sac la adezivul Ceresit CM 17 pentru toți clienții din Cahul și Cantemir.',
    type: 'amount_discount',
    discountAmount: 5.0,
    productIds: ['prod-1'],
    categoryIds: [],
    storeIds: ['cahul', 'cantemir', 'store_cahul', 'store_cantemir', 'CodeBau Cahul', 'CodeBau Cantemir', 'all'],
    customerRoles: ['retail', 'visitor', 'guest', 'visitor_guest', 'all'],
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    active: true,
    priority: 10,
    badgeText: 'PROMOȚIE',
    campaignImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    terms: 'Oferta este valabilă pentru achiziții în magazinele CodeBau Cahul și Cantemir. Limitată la 20 saci per client. Nu se cumulează cu alte pachete promoționale.',
    maxQuantityPerCustomer: 20,
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-01-01T08:00:00Z',
    createdBy: 'admin_test',
    updatedBy: 'admin_test',
    isTestData: true
  },
  {
    id: 'MEISTER-SCULE-TEST',
    name: 'Promoție Meister - 7% Scule & Echipamente',
    description: 'Reducere exclusivă de 7% la gama de scule, unelte și sisteme de nivelare pentru membrii Meister Pro și Master.',
    type: 'percentage_discount',
    discountPercentage: 7,
    productIds: [],
    categoryIds: ['Scule și unelte', 'Scule și Echipamente', 'Sisteme de Nivelare'],
    storeIds: ['all'],
    customerRoles: ['meister', 'meister_start', 'meister_pro', 'meister_master'],
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    active: true,
    priority: 8,
    badgeText: 'MEISTER −7%',
    campaignImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    terms: 'Valabilă exclusiv pentru meșteri acreditați din clubul CodeBau Meister cu statut Pro sau Master.',
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-01-01T08:00:00Z',
    createdBy: 'admin_test',
    updatedBy: 'admin_test',
    isTestData: true
  },
  {
    id: 'PROMO-VOPSELE-TEST',
    name: 'Ofertă Specială Lavabile & Amorse - 10%',
    description: '10% reducere la gama selectată de vopsele și amorse pentru interior.',
    type: 'percentage_discount',
    discountPercentage: 10,
    productIds: ['prod-paint-1', 'prod-3'],
    categoryIds: ['Vopsele și lavabile', 'Adezivi și grunduri'],
    storeIds: ['all'],
    customerRoles: ['retail', 'visitor', 'guest', 'meister', 'b2b', 'all'],
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    active: true,
    priority: 5,
    badgeText: '−10% VOPSELE',
    terms: 'Valabil în limita stocului disponibil în toate magazinele din regiunea Sud.',
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-01-01T08:00:00Z',
    createdBy: 'admin_test',
    updatedBy: 'admin_test',
    isTestData: true
  }
];

const STORAGE_KEY_PROMOTIONS = 'cb_promotions';
const STORAGE_KEY_AUDIT_LOGS = 'cb_promotion_audit_logs';

export class PromotionService {
  /**
   * Determine if a product is considered NEW
   */
  static isNewProduct(product: Product, currentDateStr?: string, durationDays: number = DEFAULT_NEW_PRODUCT_DAYS): boolean {
    if (product.isManuallyMarkedNew) {
      return true;
    }

    if (!product.launchDate) {
      return false;
    }

    const today = currentDateStr ? new Date(currentDateStr) : new Date();
    
    if (product.newUntil) {
      const untilDate = new Date(product.newUntil);
      untilDate.setHours(23, 59, 59, 999);
      return today <= untilDate;
    }

    const launch = new Date(product.launchDate);
    const calculatedUntil = new Date(launch.getTime() + durationDays * 24 * 60 * 60 * 1000);
    calculatedUntil.setHours(23, 59, 59, 999);

    return today >= launch && today <= calculatedUntil;
  }

  /**
   * Get and set new product duration days
   */
  static getNewProductDurationDays(): number {
    try {
      const stored = localStorage.getItem('cb_new_product_duration_days');
      if (stored) {
        const val = parseInt(stored, 10);
        if (!isNaN(val) && val > 0) return val;
      }
    } catch (e) {
      console.warn('Failed to read new product duration days:', e);
    }
    return DEFAULT_NEW_PRODUCT_DAYS;
  }

  static setNewProductDurationDays(days: number): void {
    try {
      localStorage.setItem('cb_new_product_duration_days', days.toString());
    } catch (e) {
      console.error('Failed to set new product duration days:', e);
    }
  }

  /**
   * Get all active promotions
   */
  static getActivePromotions(storeId?: string): Promotion[] {
    const today = new Date().toISOString().split('T')[0];
    return this.getPromotions().filter(p => {
      if (!p.active) return false;
      if (p.startDate > today || p.endDate < today) return false;
      if (storeId && storeId !== 'all' && p.storeIds && p.storeIds.length > 0 && !p.storeIds.includes('all')) {
        const match = p.storeIds.some(s => s.toLowerCase().includes(storeId.toLowerCase()) || storeId.toLowerCase().includes(s.toLowerCase()));
        if (!match) return false;
      }
      return true;
    });
  }

  static createPromotion(promo: Promotion, userId: string = 'admin_user'): Promotion {
    return this.upsertPromotion(promo, userId);
  }

  static updatePromotion(promo: Promotion, userId: string = 'admin_user'): Promotion {
    return this.upsertPromotion(promo, userId);
  }
  static getPromotions(): Promotion[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROMOTIONS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored promotions:', e);
    }
    // Initialize default if empty
    this.savePromotions(INITIAL_MOCK_PROMOTIONS);
    return INITIAL_MOCK_PROMOTIONS;
  }

  /**
   * Save promotions list
   */
  static savePromotions(promotions: Promotion[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_PROMOTIONS, JSON.stringify(promotions));
    } catch (e) {
      console.error('Failed to save promotions:', e);
    }
  }

  /**
   * Helper to reset to initial mock data
   */
  static resetToMockPromotions(): Promotion[] {
    this.savePromotions(INITIAL_MOCK_PROMOTIONS);
    return INITIAL_MOCK_PROMOTIONS;
  }

  /**
   * Add or Update a Promotion
   */
  static upsertPromotion(promo: Promotion, userId: string = 'admin_user'): Promotion {
    const list = this.getPromotions();
    const index = list.findIndex(p => p.id === promo.id);
    const now = new Date().toISOString();

    let isNew = false;
    let oldPromo: Promotion | undefined = undefined;

    if (index >= 0) {
      oldPromo = { ...list[index] };
      list[index] = { ...promo, updatedAt: now, updatedBy: userId };
    } else {
      isNew = true;
      list.push({ ...promo, createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId });
    }

    this.savePromotions(list);

    // Audit log
    this.addAuditLog({
      userId,
      action: isNew ? 'create' : 'update',
      promotionId: promo.id,
      promotionName: promo.name,
      before: oldPromo,
      after: promo
    });

    return promo;
  }

  /**
   * Toggle promotion active state
   */
  static togglePromotionStatus(promoId: string, active: boolean, userId: string = 'admin_user'): void {
    const list = this.getPromotions();
    const promo = list.find(p => p.id === promoId);
    if (promo) {
      const before = { ...promo };
      promo.active = active;
      promo.updatedAt = new Date().toISOString();
      promo.updatedBy = userId;
      this.savePromotions(list);

      this.addAuditLog({
        userId,
        action: active ? 'activate' : 'deactivate',
        promotionId: promoId,
        promotionName: promo.name,
        before,
        after: promo
      });
    }
  }

  /**
   * Delete promotion
   */
  static deletePromotion(promoId: string, userId: string = 'admin_user'): void {
    const list = this.getPromotions();
    const promo = list.find(p => p.id === promoId);
    const filtered = list.filter(p => p.id !== promoId);
    this.savePromotions(filtered);

    if (promo) {
      this.addAuditLog({
        userId,
        action: 'delete',
        promotionId: promoId,
        promotionName: promo.name,
        before: promo
      });
    }
  }

  /**
   * Duplicate promotion
   */
  static duplicatePromotion(promoId: string, userId: string = 'admin_user'): Promotion | null {
    const list = this.getPromotions();
    const source = list.find(p => p.id === promoId);
    if (!source) return null;

    const newId = `PROMO-COPY-${Math.floor(1000 + Math.random() * 9000)}`;
    const duplicate: Promotion = {
      ...source,
      id: newId,
      name: `${source.name} (Copie)`,
      active: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId,
      updatedBy: userId
    };

    return this.upsertPromotion(duplicate, userId);
  }

  /**
   * Calculate effective price for a product
   */
  static calculateEffectivePrice(params: {
    product: Product;
    basePrice: number;
    userRole?: string;
    selectedStore?: string;
    quantity?: number;
    currentDate?: string;
  }): EffectivePriceResult {
    const {
      product,
      basePrice,
      userRole = 'retail',
      selectedStore = 'all',
      quantity = 1,
      currentDate = new Date().toISOString().split('T')[0]
    } = params;

    const defaultResult: EffectivePriceResult = {
      basePrice,
      promotionalPrice: basePrice,
      discountAmount: 0,
      discountPercentage: 0,
      isPromoActive: false
    };

    if (basePrice <= 0) {
      return defaultResult;
    }

    const promotions = this.getPromotions();
    const today = new Date(currentDate);

    // Filter active and valid date
    const validPromos = promotions.filter(p => {
      if (!p.active) return false;

      const start = new Date(p.startDate);
      const end = new Date(p.endDate);
      end.setHours(23, 59, 59, 999);

      if (today < start || today > end) return false;

      // Store matching
      if (p.storeIds && p.storeIds.length > 0 && !p.storeIds.includes('all')) {
        const storeMatch = p.storeIds.some(sId => {
          const sNormalized = sId.toLowerCase();
          const selNormalized = selectedStore.toLowerCase();
          return selNormalized.includes(sNormalized) || sNormalized.includes(selNormalized);
        });
        if (!storeMatch) return false;
      }

      // Role matching
      if (p.customerRoles && p.customerRoles.length > 0 && !p.customerRoles.includes('all')) {
        const roles = p.customerRoles.map(r => r.toLowerCase());
        const uRole = userRole.toLowerCase();

        let matchesRole = roles.includes(uRole);

        if (!matchesRole) {
          if (uRole === 'admin') matchesRole = true;
          else if ((uRole === 'visitor' || uRole === 'guest') && (roles.includes('retail') || roles.includes('guest') || roles.includes('visitor'))) matchesRole = true;
          else if (uRole === 'meister' && (roles.includes('meister_start') || roles.includes('meister_pro') || roles.includes('meister_master') || roles.includes('meister'))) matchesRole = true;
        }

        if (!matchesRole) return false;
      }

      // Product or Category matching
      const matchesProduct = p.productIds && p.productIds.length > 0 && p.productIds.includes(product.id);
      const matchesCategory = p.categoryIds && p.categoryIds.length > 0 && (
        p.categoryIds.some(c => c.toLowerCase() === product.category.toLowerCase() || c.toLowerCase() === product.subcategory?.toLowerCase())
      );

      // If both productIds and categoryIds are specified or empty
      const hasProductFilter = p.productIds && p.productIds.length > 0;
      const hasCategoryFilter = p.categoryIds && p.categoryIds.length > 0;

      if (!hasProductFilter && !hasCategoryFilter) {
        // Universal promo
        return true;
      }

      return matchesProduct || matchesCategory;
    });

    if (validPromos.length === 0) {
      return defaultResult;
    }

    // Sort by priority desc
    validPromos.sort((a, b) => b.priority - a.priority);

    const bestPromo = validPromos[0];

    let calcPrice = basePrice;

    if (bestPromo.type === 'percentage_discount' && bestPromo.discountPercentage) {
      calcPrice = basePrice * (1 - bestPromo.discountPercentage / 100);
    } else if (bestPromo.type === 'amount_discount' && bestPromo.discountAmount) {
      calcPrice = basePrice - bestPromo.discountAmount;
    } else if (bestPromo.type === 'fixed_price') {
      calcPrice = bestPromo.fixedPrice ?? bestPromo.discountAmount ?? basePrice;
    } else if (bestPromo.discountPercentage) {
      calcPrice = basePrice * (1 - bestPromo.discountPercentage / 100);
    } else if (bestPromo.discountAmount) {
      calcPrice = basePrice - bestPromo.discountAmount;
    }

    calcPrice = Math.max(0, Math.min(basePrice, calcPrice));
    calcPrice = Math.round(calcPrice * 100) / 100;

    if (calcPrice < basePrice) {
      const discountAmount = Math.round((basePrice - calcPrice) * 100) / 100;
      const discountPercentage = Math.round((discountAmount / basePrice) * 100);

      return {
        basePrice,
        promotionalPrice: calcPrice,
        discountAmount,
        discountPercentage,
        promotionId: bestPromo.id,
        promotionName: bestPromo.name,
        validUntil: bestPromo.endDate,
        badgeText: bestPromo.badgeText || 'PROMOȚIE',
        terms: bestPromo.terms,
        maxQuantityPerCustomer: bestPromo.maxQuantityPerCustomer,
        isPromoActive: true
      };
    }

    return defaultResult;
  }

  /**
   * Check if a promo exists for role but current user isn't eligible
   */
  static hasOtherRolePromo(product: Product, userRole: string): Promotion | null {
    const list = this.getPromotions();
    const today = new Date().toISOString().split('T')[0];

    const target = list.find(p => {
      if (!p.active) return false;
      if (p.startDate > today || p.endDate < today) return false;
      const match = (p.productIds?.includes(product.id)) || (p.categoryIds?.includes(product.category));
      if (!match) return false;

      if (p.customerRoles && p.customerRoles.length > 0 && !p.customerRoles.includes('all')) {
        return !p.customerRoles.includes(userRole.toLowerCase());
      }
      return false;
    });

    return target || null;
  }

  /**
   * Audit Log Management
   */
  static addAuditLog(entry: Omit<PromotionAuditLog, 'id' | 'timestamp' | 'environment'>): void {
    try {
      const logs = this.getAuditLogs();
      const newLog: PromotionAuditLog = {
        ...entry,
        id: `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        environment: 'test'
      };
      logs.unshift(newLog);
      // Keep max 100 logs
      localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
    } catch (e) {
      console.error('Failed to write audit log:', e);
    }
  }

  static getAuditLogs(): PromotionAuditLog[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUDIT_LOGS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to read audit logs:', e);
    }
    return [];
  }
}
