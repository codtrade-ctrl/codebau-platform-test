import { DeliveryQuote, CartItem, ExtraDeliveryServices } from '../types';

export interface DeliveryQuoteParams {
  storeId: string;
  locality: string;
  isManualLocality?: boolean;
  fulfillmentMethod: 'store_pickup' | 'delivery' | 'locker_247';
  deliveryServiceType?: 'standard' | 'express_site' | 'scheduled' | 'on_site';
  extraServices?: ExtraDeliveryServices;
  items: CartItem[];
}

export class DeliveryQuoteService {
  public static calculateQuote(params: DeliveryQuoteParams): DeliveryQuote {
    const { storeId, locality, isManualLocality, fulfillmentMethod, deliveryServiceType, extraServices, items } = params;

    // 1. Store pickup or Locker 24/7 is always FREE
    if (fulfillmentMethod === 'store_pickup' || fulfillmentMethod === 'locker_247') {
      return {
        status: 'free',
        amountMDL: 0,
        formattedText: 'Gratuit',
        estimatedTime: fulfillmentMethod === 'locker_247' ? 'Disponibil în 2-4 ore la Locker 24/7' : 'Gata de ridicare în magazin în ~1-2 ore'
      };
    }

    // 2. Manual locality or unknown town in South RM
    if (isManualLocality || !locality || locality.trim() === '' || locality === 'Alta (alta localitate)') {
      return {
        status: 'to_be_confirmed',
        amountMDL: null,
        formattedText: 'De confirmat de consultant CodeBau',
        estimatedTime: 'Să fim siguri că ajungem pe strada ta (24-48h)',
        notes: 'Consultantul logisitic CodeBau te va contacta pentru a stabili traseul camionului cu macara.'
      };
    }

    // 3. Known localities in South RM
    const normalizedLocality = locality.toLowerCase().trim();
    const primaryTowns = ['cahul', 'mun. cahul', 'cantemir', 'orașul cantemir', 'vulcănești', 'vulcanesti', 'orașul vulcănești', 'taraclia', 'orașul taraclia'];
    const regionalTowns = ['roșu', 'rosu', 'crihana veche', 'larga nouă', 'burlacu', 'giurgiulești', 'giurgiulesti', 'slobozia mare', 'colibași', 'colibasi', 'pelinei', 'văleni', 'valeni', 'gotești', 'gotesti', 'baimaclia', 'visniovca', 'cișmichioi', 'cismichioi', 'etulia', 'borceag', 'cairaclia', 'cortic'];

    // Calculate approximate weight in kg and volume
    const totalWeightKg = items.reduce((acc, item) => {
      let unitWeight = 1; // default
      if (item.product.unit.includes('25kg')) unitWeight = 25;
      else if (item.product.unit.includes('50kg')) unitWeight = 50;
      else if (item.product.unit.includes('15L')) unitWeight = 20;
      else if (item.product.unit.includes('m2')) unitWeight = 12;
      return acc + (unitWeight * item.quantity);
    }, 0);

    let baseFee = 49.00; // Base local delivery fee in MDL

    if (primaryTowns.some(t => normalizedLocality.includes(t))) {
      baseFee = 49.00;
    } else if (regionalTowns.some(t => normalizedLocality.includes(t))) {
      baseFee = 89.00;
    } else {
      // Outer South RM
      baseFee = 120.00;
    }

    // Weight surcharge for heavy construction materials (>250kg requires crane truck)
    if (totalWeightKg > 500) {
      baseFee += 100.00;
    } else if (totalWeightKg > 250) {
      baseFee += 50.00;
    }

    // Express site delivery fee
    if (deliveryServiceType === 'express_site') {
      baseFee += 60.00;
    }

    // Extra services add-ons
    let extrasFee = 0;
    if (extraServices?.unloading) extrasFee += 40.00; // Descărcare cu mecanic/macara
    if (extraServices?.handling) extrasFee += 50.00; // Manipulare
    if (extraServices?.floorDelivery) extrasFee += 60.00; // Transport la etaj

    const totalDeliveryMDL = baseFee + extrasFee;

    let timeText = 'Livrare programată în 24 ore';
    if (deliveryServiceType === 'express_site') {
      timeText = 'Livrare rapidă pe șantier în 2-4 ore';
    } else if (deliveryServiceType === 'on_site') {
      timeText = 'Descărcare directă cu macara pe șantier';
    }

    return {
      status: 'calculated',
      amountMDL: totalDeliveryMDL,
      formattedText: `${totalDeliveryMDL.toFixed(2).replace('.', ',')} MDL`,
      estimatedTime: timeText
    };
  }
}
