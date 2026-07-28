import { Cart, CartItem, TestEvent } from '../types';

const LOCAL_STORAGE_CART_KEY = 'codebau_cart_v2';
const LOCAL_STORAGE_TEST_EVENTS_KEY = 'codebau_test_events_v1';

export function getCartSessionId(): string {
  let sessionId = localStorage.getItem('codebau_cart_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('codebau_cart_session_id', sessionId);
  }
  return sessionId;
}

export function logTestEvent(type: TestEvent['type'], payload: Record<string, any> = {}) {
  try {
    const event: TestEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      type,
      payload
    };
    const existingStr = localStorage.getItem(LOCAL_STORAGE_TEST_EVENTS_KEY);
    const existingEvents: TestEvent[] = existingStr ? JSON.parse(existingStr) : [];
    existingEvents.unshift(event);
    // Keep max 100 events
    localStorage.setItem(LOCAL_STORAGE_TEST_EVENTS_KEY, JSON.stringify(existingEvents.slice(0, 100)));
  } catch (e) {
    console.warn('Failed to log test event:', e);
  }
}

export function getTestEvents(): TestEvent[] {
  try {
    const existingStr = localStorage.getItem(LOCAL_STORAGE_TEST_EVENTS_KEY);
    return existingStr ? JSON.parse(existingStr) : [];
  } catch {
    return [];
  }
}

export function clearTestEvents() {
  localStorage.removeItem(LOCAL_STORAGE_TEST_EVENTS_KEY);
}

export interface CartRepository {
  getCart(sessionId: string, storeId: string): Promise<Cart>;
  saveCart(cart: Cart): Promise<void>;
  mergeCarts(localCart: Cart, remoteCart: Cart, strategy: 'combine' | 'account' | 'local'): Promise<Cart>;
}

export class LocalCartRepository implements CartRepository {
  async getCart(sessionId: string, storeId: string): Promise<Cart> {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (raw) {
        const parsed: Cart = JSON.parse(raw);
        return {
          ...parsed,
          selectedStoreId: parsed.selectedStoreId || storeId,
          items: parsed.items || [],
          savedItems: parsed.savedItems || []
        };
      }
    } catch (e) {
      console.error('Error loading cart from localStorage:', e);
    }

    const defaultCart: Cart = {
      id: `cart_${sessionId}`,
      sessionId,
      selectedStoreId: storeId,
      items: [],
      savedItems: [],
      currency: 'MDL',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      environment: 'development',
      isTestData: true,
      receivingMethod: 'store_pickup'
    };

    return defaultCart;
  }

  async saveCart(cart: Cart): Promise<void> {
    try {
      const updatedCart: Cart = {
        ...cart,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(updatedCart));
    } catch (e) {
      console.error('Error saving cart to localStorage:', e);
    }
  }

  async mergeCarts(localCart: Cart, remoteCart: Cart, strategy: 'combine' | 'account' | 'local'): Promise<Cart> {
    if (strategy === 'account') return remoteCart;
    if (strategy === 'local') return localCart;

    // Combine strategy: merge items by productId and store
    const mergedMap = new Map<string, CartItem>();

    // Put remote items first
    remoteCart.items.forEach(item => {
      const key = `${item.product.id}_${item.selectedStoreId || remoteCart.selectedStoreId}`;
      mergedMap.set(key, { ...item });
    });

    // Merge local items
    localCart.items.forEach(item => {
      const key = `${item.product.id}_${item.selectedStoreId || localCart.selectedStoreId}`;
      const existing = mergedMap.get(key);
      if (existing) {
        mergedMap.set(key, {
          ...existing,
          quantity: existing.quantity + item.quantity
        });
      } else {
        mergedMap.set(key, { ...item });
      }
    });

    const combinedCart: Cart = {
      ...remoteCart,
      items: Array.from(mergedMap.values()),
      savedItems: [...(remoteCart.savedItems || []), ...(localCart.savedItems || [])],
      updatedAt: new Date().toISOString()
    };

    await this.saveCart(combinedCart);
    logTestEvent('cart_merged', { strategy, totalItems: combinedCart.items.length });

    return combinedCart;
  }
}

export const defaultCartRepository = new LocalCartRepository();
