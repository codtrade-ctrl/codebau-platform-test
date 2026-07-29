import { Product, UserRole, CartItem } from '../types';
import { PromotionService } from './PromotionService';

export interface ProductPrice {
  regularPrice: number;
  promotionalPrice?: number;
  promotionStart?: string;
  promotionEnd?: string;
  promotionActive: boolean;
  promotionId?: string;
  promotionName?: string;
  unitPrice: number; // Effective active price to be charged
  savingsPerUnit: number;
  vatRate: number; // e.g., 0.20 for 20% VAT in Moldova
  currency: 'MDL';
}

export class PriceEngine {
  /**
   * Calculates single source of truth price for any product based on role, store, and promotions.
   */
  public static getProductPrice(
    product: Product,
    userRole: UserRole = 'visitor',
    selectedStore: string = 'CodeBau Cahul',
    quantity: number = 1
  ): ProductPrice {
    const isPro = userRole === 'meister' || userRole === 'b2b';
    const baseRegularPrice = isPro ? product.pricePro : product.priceRetail;

    const promoResult = PromotionService.calculateEffectivePrice({
      product,
      basePrice: baseRegularPrice,
      userRole,
      selectedStore,
      quantity
    });

    const isPromoActive = promoResult.isPromoActive && typeof promoResult.promotionalPrice === 'number' && promoResult.promotionalPrice < baseRegularPrice;
    const unitPrice = isPromoActive ? promoResult.promotionalPrice : baseRegularPrice;
    const savingsPerUnit = isPromoActive ? (baseRegularPrice - promoResult.promotionalPrice) : 0;

    return {
      regularPrice: baseRegularPrice,
      promotionalPrice: isPromoActive ? promoResult.promotionalPrice : undefined,
      promotionStart: undefined,
      promotionEnd: promoResult.validUntil,
      promotionActive: isPromoActive,
      promotionId: promoResult.promotionId,
      promotionName: promoResult.promotionName,
      unitPrice,
      savingsPerUnit,
      vatRate: 0.20,
      currency: 'MDL'
    };
  }

  /**
   * Line subtotal before discounts
   */
  public static getLineSubtotal(regularUnitPrice: number, quantity: number): number {
    return Math.max(0, regularUnitPrice * quantity);
  }

  /**
   * Line total discount amount
   */
  public static getLineDiscount(regularUnitPrice: number, unitPrice: number, quantity: number): number {
    return Math.max(0, (regularUnitPrice - unitPrice) * quantity);
  }

  /**
   * Line total after discount
   */
  public static getLineTotal(unitPrice: number, quantity: number): number {
    return Math.max(0, unitPrice * quantity);
  }

  /**
   * Cart items subtotal sum
   */
  public static getCartSubtotal(items: { unitPrice?: number; appliedPrice?: number; quantity: number }[]): number {
    return items.reduce((acc, item) => {
      const price = item.unitPrice ?? item.appliedPrice ?? 0;
      return acc + (price * item.quantity);
    }, 0);
  }

  /**
   * Total promotional savings across cart items
   */
  public static getCartSavings(items: { regularUnitPrice?: number; basePrice?: number; unitPrice?: number; appliedPrice?: number; quantity: number }[]): number {
    return items.reduce((acc, item) => {
      const reg = item.regularUnitPrice ?? item.basePrice ?? item.unitPrice ?? item.appliedPrice ?? 0;
      const effective = item.unitPrice ?? item.appliedPrice ?? reg;
      return acc + Math.max(0, (reg - effective) * item.quantity);
    }, 0);
  }
}
