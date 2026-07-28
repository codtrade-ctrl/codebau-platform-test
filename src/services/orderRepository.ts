import { Order, InventoryMovement, CartItem, Product } from '../types';
import { MOCK_ORDERS, MOCK_PRODUCTS } from '../data/mockData';
import { TestNotificationService } from './TestNotificationService';
import { logTestEvent } from './cartRepository';

const ORDERS_STORAGE_KEY = 'codebau_orders_v1';
const INVENTORY_MOVEMENTS_KEY = 'codebau_inventory_movements_v1';
const DRAFT_CHECKOUT_KEY = 'codebau_checkout_draft_v1';

export class OrderRepository {
  public static getOrders(): Order[] {
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read orders from localStorage:', e);
    }
    return MOCK_ORDERS;
  }

  public static getOrderByNumber(orderNumber: string): Order | undefined {
    const orders = OrderRepository.getOrders();
    return orders.find(o => o.orderNumber === orderNumber || o.id === orderNumber);
  }

  public static generateOrderNumber(): string {
    const orders = OrderRepository.getOrders();
    const count = orders.length + 1;
    const padded = String(count).padStart(6, '0');
    return `TEST-CB-2026-${padded}`;
  }

  public static saveOrder(order: Order): void {
    const orders = OrderRepository.getOrders();
    const idx = orders.findIndex(o => o.id === order.id || o.orderNumber === order.orderNumber);
    if (idx >= 0) {
      orders[idx] = order;
    } else {
      orders.unshift(order);
    }
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save order to localStorage:', e);
    }
  }

  public static reserveStockForOrder(order: Order, productsList: Product[]): { success: boolean; movements: InventoryMovement[]; failedItems: string[] } {
    const movements: InventoryMovement[] = [];
    const failedItems: string[] = [];

    // Map store key
    let stockKey: 'inStockCahul' | 'inStockCantemir' | 'inStockVulcanesti' | 'inStockTaraclia' = 'inStockCahul';
    if (order.storeId.includes('cantemir')) stockKey = 'inStockCantemir';
    else if (order.storeId.includes('vulcanesti')) stockKey = 'inStockVulcanesti';
    else if (order.storeId.includes('taraclia')) stockKey = 'inStockTaraclia';

    let allAvailable = true;

    // Check availability for all items
    order.items.forEach(item => {
      const prod = productsList.find(p => p.id === item.product.id);
      const available = prod ? (prod[stockKey] ?? 0) : 0;
      if (available < item.quantity) {
        allAvailable = false;
        failedItems.push(`${item.product.name} (solicitat: ${item.quantity}, disponibil: ${available})`);
      }
    });

    if (!allAvailable) {
      return { success: false, movements: [], failedItems };
    }

    // Atomic reservation & movement generation
    order.items.forEach(item => {
      const movement: InventoryMovement = {
        id: `mov_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        productId: item.product.id,
        storeId: order.storeId,
        quantity: item.quantity,
        type: 'reservation',
        referenceType: 'order',
        referenceId: order.id,
        createdBy: order.createdBy || 'checkout_system',
        createdAt: new Date().toISOString(),
        environment: order.environment || 'test'
      };
      movements.push(movement);
    });

    // Save inventory movements
    try {
      const rawMovs = localStorage.getItem(INVENTORY_MOVEMENTS_KEY);
      const existingMovs: InventoryMovement[] = rawMovs ? JSON.parse(rawMovs) : [];
      localStorage.setItem(INVENTORY_MOVEMENTS_KEY, JSON.stringify([...movements, ...existingMovs]));
    } catch (e) {
      console.warn('Failed to save inventory movements:', e);
    }

    logTestEvent('stock_reserved', { orderNumber: order.orderNumber, storeId: order.storeId, itemsCount: order.items.length });

    return { success: true, movements, failedItems: [] };
  }

  public static placeTestOrder(orderInput: Order, productsList: Product[]): Order {
    // 1. Initial State
    const finalOrder: Order = {
      ...orderInput,
      status: 'submitted',
      paymentStatus: 'not_required_test',
      stockReservationStatus: 'pending',
      updatedAt: new Date().toISOString()
    };

    // 2. Reserve stock
    const reservationResult = OrderRepository.reserveStockForOrder(finalOrder, productsList);

    if (reservationResult.success) {
      finalOrder.status = 'confirmed';
      finalOrder.stockReservationStatus = 'reserved';
      if (!finalOrder.auditLogs) finalOrder.auditLogs = [];
      finalOrder.auditLogs.push({
        timestamp: new Date().toISOString(),
        action: 'order_submitted_and_stock_reserved',
        performedBy: finalOrder.createdBy || 'System',
        notes: `Stoc rezervat cu succes în magazinul ${finalOrder.storeLocation || finalOrder.storeId}`
      });
    } else {
      finalOrder.status = 'requires_review';
      finalOrder.stockReservationStatus = 'failed';
      if (!finalOrder.auditLogs) finalOrder.auditLogs = [];
      finalOrder.auditLogs.push({
        timestamp: new Date().toISOString(),
        action: 'stock_reservation_failed',
        performedBy: 'System',
        notes: `Rezervarea stocului a eșuat pentru: ${reservationResult.failedItems.join('; ')}`
      });
    }

    // 3. Save Order
    OrderRepository.saveOrder(finalOrder);

    // 4. Send Simulated Notifications
    TestNotificationService.logNotification({
      orderId: finalOrder.id,
      orderNumber: finalOrder.orderNumber,
      channel: 'sms',
      recipient: finalOrder.customerData.phone,
      template: 'ORDER_RECEIVED_SMS',
      content: `CodeBau: Comanda ta de test ${finalOrder.orderNumber} a fost înregistrată! Magazin: ${finalOrder.storeLocation || 'Cahul'}. Un consultant verifică disponibilitatea.`
    });

    TestNotificationService.logNotification({
      orderId: finalOrder.id,
      orderNumber: finalOrder.orderNumber,
      channel: 'email',
      recipient: finalOrder.customerData.email,
      template: 'ORDER_RECEIVED_EMAIL',
      content: `Bună ziua, ${finalOrder.customerData.firstName}! Comanda de test ${finalOrder.orderNumber} cu totalul de ${finalOrder.total.toFixed(2)} MDL a fost înregistrată în mediul de test CodeBau Sudul RM.`
    });

    logTestEvent('order_placed', {
      orderNumber: finalOrder.orderNumber,
      total: finalOrder.total,
      status: finalOrder.status,
      stockReservationStatus: finalOrder.stockReservationStatus
    });

    return finalOrder;
  }

  // Draft Checkout State Persistence
  public static saveCheckoutDraft(draft: any): void {
    try {
      localStorage.setItem(DRAFT_CHECKOUT_KEY, JSON.stringify({
        ...draft,
        updatedAt: new Date().toISOString()
      }));
    } catch (e) {
      console.warn('Failed to save checkout draft:', e);
    }
  }

  public static getCheckoutDraft(): any | null {
    try {
      const raw = localStorage.getItem(DRAFT_CHECKOUT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  public static clearCheckoutDraft(): void {
    localStorage.removeItem(DRAFT_CHECKOUT_KEY);
  }
}
