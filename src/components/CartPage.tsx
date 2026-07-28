import React, { useState } from 'react';
import { Product, CartItem, DeliveryMethod, UserRole, CodeBauStore, Order } from '../types';
import { MOCK_STORES, MOCK_PRODUCTS } from '../data/mockData';
import { formatMoney, validateCartStock, appSettings } from '../utils/formatters';
import { 
  ShoppingCart, Trash2, ArrowRight, ShieldCheck, Truck, QrCode, Store, 
  ChevronRight, AlertTriangle, Check, RotateCcw, Bookmark, Plus, Tag, 
  HelpCircle, Info, Building2, Package, Sparkles
} from 'lucide-react';
import { logTestEvent } from '../services/cartRepository';

interface CartPageProps {
  cartItems: CartItem[];
  savedItems: CartItem[];
  selectedStore: string;
  onStoreChange: (storeName: string) => void;
  currentRole: UserRole;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onSaveForLater: (productId: string) => void;
  onMoveToCartFromSaved: (productId: string) => void;
  onRemoveSavedItem: (productId: string) => void;
  onClearCart: () => void;
  onAddToCart: (product: Product, qty: number) => void;
  onNavigateToProduct: (slug: string) => void;
  onNavigateToCatalog: () => void;
  onNavigateToCheckout?: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cartItems,
  savedItems,
  selectedStore,
  onStoreChange,
  currentRole,
  onUpdateQuantity,
  onRemoveItem,
  onSaveForLater,
  onMoveToCartFromSaved,
  onRemoveSavedItem,
  onClearCart,
  onAddToCart,
  onNavigateToProduct,
  onNavigateToCatalog,
  onNavigateToCheckout,
  onOrderPlaced
}) => {
  const [receivingMethod, setReceivingMethod] = useState<'store_pickup' | 'delivery' | 'locker_247'>('store_pickup');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number; discountMDL: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  
  // Undo removed item toast
  const [lastRemovedItem, setLastRemovedItem] = useState<{ item: CartItem; index: number } | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);

  // Clear cart modal
  const [showClearModal, setShowClearModal] = useState(false);

  // Store selection modal
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [storeValidationWarning, setStoreValidationWarning] = useState<string | null>(null);

  // Checkout modal
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Find store details
  const storeInfo = MOCK_STORES.find(s => s.name === selectedStore) || MOCK_STORES[0];

  // Stock validation
  const stockValidation = validateCartStock(cartItems, selectedStore);

  // Check locker eligibility
  const hasIneligibleLockerItem = cartItems.some(i => i.product.lockerEligible === false);

  // Subtotal & Totals
  const subtotal = cartItems.reduce((acc, item) => acc + (item.appliedPrice * item.quantity), 0);
  const promoDiscountMDL = appliedPromo ? appliedPromo.discountMDL : 0;

  // Delivery fee calculation
  const deliveryFee = receivingMethod === 'delivery' ? 49.00 : 0;
  const total = Math.max(0, subtotal - promoDiscountMDL + deliveryFee);
  const vatAmount = total * appSettings.vatRate / (1 + appSettings.vatRate);

  // Complementary product recommendations
  const cartProductIds = new Set(cartItems.map(i => i.product.id));
  const complementaryProducts = MOCK_PRODUCTS.filter(p => !cartProductIds.has(p.id)).slice(0, 3);

  // Handle Item Remove with Undo
  const handleRemoveWithUndo = (item: CartItem) => {
    const idx = cartItems.findIndex(i => i.product.id === item.product.id);
    setLastRemovedItem({ item, index: idx });
    setShowUndoToast(true);
    onRemoveItem(item.product.id);
    logTestEvent('cart_item_removed', { productId: item.product.id, productName: item.product.name });

    setTimeout(() => {
      setShowUndoToast(false);
    }, 7000);
  };

  const handleUndoRemove = () => {
    if (lastRemovedItem) {
      onAddToCart(lastRemovedItem.item.product, lastRemovedItem.item.quantity);
      setShowUndoToast(false);
      setLastRemovedItem(null);
    }
  };

  // Handle Promo Code
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'TEST5') {
      const discountMDL = Math.min(100, subtotal * 0.05);
      setAppliedPromo({ code, discountPercent: 5, discountMDL });
      logTestEvent('promo_code_applied', { code, discountMDL });
    } else if (code === 'MEISTERTEST') {
      if (currentRole !== 'meister' && currentRole !== 'b2b') {
        setPromoError('Codul MEISTERTEST este rezervat meșterilor autorizați CodeBau.');
        return;
      }
      const discountMDL = subtotal * 0.10;
      setAppliedPromo({ code, discountPercent: 10, discountMDL });
      logTestEvent('promo_code_applied', { code, discountMDL });
    } else if (code === 'MEISTER10') {
      const discountMDL = subtotal * 0.10;
      setAppliedPromo({ code, discountPercent: 10, discountMDL });
      logTestEvent('promo_code_applied', { code, discountMDL });
    } else {
      setPromoError('Cod promoțional invalid sau expirat.');
    }
  };

  const handleSelectNewStore = (newStoreName: string) => {
    const newValidation = validateCartStock(cartItems, newStoreName);
    if (!newValidation.isValid) {
      setStoreValidationWarning(`La magazinul ${newStoreName}, stocul variază pentru anumite produse din coș.`);
    } else {
      setStoreValidationWarning(null);
    }
    onStoreChange(newStoreName);
    logTestEvent('cart_store_changed', { newStore: newStoreName, isValidStock: newValidation.isValid });
  };

  const handleProceedToCheckout = () => {
    setCheckoutError(null);

    // 1. Check cart not empty
    if (!cartItems || cartItems.length === 0) {
      setCheckoutError('Coșul este gol. Adăugați produse pentru a continua.');
      return;
    }

    // 2. Check store selected
    if (!selectedStore) {
      setCheckoutError('Vă rugăm să selectați magazinul CodeBau.');
      return;
    }

    // 3. Check receiving method & locker eligibility
    if (receivingMethod === 'locker_247' && hasIneligibleLockerItem) {
      setCheckoutError('Coșul conține produse neeligibile pentru Locker 24/7. Selectați Ridicare din magazin sau Livrare.');
      return;
    }

    // 4. Log event & navigate to /finalizare-comanda
    logTestEvent('checkout_started', { itemsCount: cartItems.length, total });

    if (onNavigateToCheckout) {
      onNavigateToCheckout();
    } else {
      setShowCheckoutModal(true);
    }
  };

  const handleFinalizeOrder = () => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `CB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      clientName: currentRole === 'b2b' ? 'Constructia Viitorului SRL' : 'Adrian Popescu',
      customerType: currentRole === 'b2b' ? 'company' : 'retail',
      customerData: {
        firstName: currentRole === 'b2b' ? 'Constructia' : 'Adrian',
        lastName: currentRole === 'b2b' ? 'Viitorului SRL' : 'Popescu',
        phone: '+373 69 123 456',
        email: 'client@codebau.md'
      },
      storeId: selectedStore === 'CodeBau Cahul' ? 'store_cahul' : 'store_cantemir',
      storeLocation: selectedStore,
      fulfillmentMethod: receivingMethod === 'delivery' ? 'delivery' : receivingMethod === 'locker_247' ? 'locker_247' : 'store_pickup',
      fulfillmentDetails: {},
      requestedDate: new Date().toISOString().split('T')[0],
      requestedTimeSlot: '12:00 - 16:00',
      items: [...cartItems],
      subtotal: total,
      bundleDiscount: 0,
      promotionalDiscount: 0,
      deliveryCost: 0,
      deliveryCostStatus: 'free',
      servicesCost: 0,
      total,
      currency: 'MDL',
      paymentMethod: currentRole === 'b2b' ? 'bank_transfer_b2b' : 'pay_on_delivery',
      paymentStatus: currentRole === 'b2b' ? 'credit_line' : 'paid',
      status: 'confirmed',
      stockReservationStatus: 'reserved',
      isTestOrder: true,
      environment: 'test',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentRole === 'b2b' ? 'b2b_user' : 'retail_user',
      termsConfirmed: true,
      deliveryMethod: receivingMethod === 'delivery' ? 'express_site' : receivingMethod === 'locker_247' ? 'locker_247' : 'click_collect',
      lockerCode: receivingMethod === 'locker_247' ? `CB-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      trackingSteps: [
        { status: 'received', label: 'Comandă înregistrată', date: 'Acum', completed: true },
        { status: 'confirmed', label: 'Stoc rezervat în magazin', date: 'Acum', completed: true },
        { status: 'preparing', label: 'În pregătire la depozitul CodeBau', completed: true },
        { status: 'ready_for_pickup', label: 'Gata de ridicare / livrare', completed: false }
      ]
    };

    onOrderPlaced(newOrder);
    setShowCheckoutModal(false);
  };

  return (
    <div className="bg-[#F4F7F6] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
        
        {/* Undo Toast Notification */}
        {showUndoToast && lastRemovedItem && (
          <div className="fixed bottom-20 sm:bottom-6 right-4 z-50 bg-[#0D1B2A] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 max-w-md border border-[#1A3448] animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-2 text-xs">
              <Trash2 className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <p className="font-extrabold text-white line-clamp-1">{lastRemovedItem.item.product.name}</p>
                <p className="text-[11px] text-slate-300">Produs eliminat din coș.</p>
              </div>
            </div>
            <button
              onClick={handleUndoRemove}
              className="bg-[#087F5B] text-white hover:bg-[#066B4D] font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Anulează</span>
            </button>
          </div>
        )}

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-[#5C6670] font-medium">
          <button onClick={onNavigateToCatalog} className="hover:text-[#0D1B2A] transition-colors cursor-pointer">Acasă</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#087F5B] font-extrabold">Coșul tău</span>
        </nav>

        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#D9E2E1] pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0D1B2A] flex items-center gap-3">
              <ShoppingCart className="w-7 h-7 text-[#087F5B]" />
              <span>Coșul tău de cumpărături</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#5C6670] mt-1 font-medium">
              Verifică produsele, cantitățile și magazinul CodeBau înainte de a continua comanda.
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={() => setShowClearModal(true)}
              className="text-xs text-[#5C6670] hover:text-rose-600 flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer font-bold"
            >
              <Trash2 className="w-4 h-4" />
              <span>Golește coșul</span>
            </button>
          )}
        </div>

        {/* Main Cart Grid or Empty State */}
        {cartItems.length === 0 ? (
          <div className="bg-white border border-[#D9E2E1] rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xs">
            <div className="w-20 h-20 bg-[#F8FAF9] rounded-2xl border border-[#D9E2E1] flex items-center justify-center mx-auto text-[#5C6670] shadow-xs">
              <ShoppingCart className="w-10 h-10 text-[#5C6670]" />
            </div>
            
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-black text-[#0D1B2A]">Coșul tău este gol</h3>
              <p className="text-xs sm:text-sm text-[#5C6670] font-medium leading-relaxed">
                Descoperă produsele din catalogul CodeBau sau calculează necesarul exact de materiale pentru proiectul tău de renovare.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onNavigateToCatalog}
                className="w-full sm:w-auto bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Vezi produsele din catalog</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-8 space-y-6 min-w-0">
              
              {/* Store & Stock Selector Block */}
              <div className="bg-white border border-[#D9E2E1] rounded-3xl p-5 space-y-3 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#DDF5EE] border border-[#00A878]/30 flex items-center justify-center text-[#087F5B] shrink-0">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#5C6670] uppercase font-extrabold tracking-wider">Magazinul comenzii tale</p>
                      <h3 className="font-extrabold text-[#0D1B2A] text-sm">{storeInfo.name} ({storeInfo.town})</h3>
                      <p className="text-xs text-[#5C6670] font-medium">{storeInfo.address} • {storeInfo.schedule}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowStoreModal(true)}
                    className="bg-[#F8FAF9] hover:bg-[#EFFAF6] text-[#0D1B2A] border border-[#D9E2E1] text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors self-start sm:self-auto cursor-pointer shrink-0"
                  >
                    Schimbă magazinul
                  </button>
                </div>

                {!stockValidation.isValid && (
                  <div className="bg-[#FEF3C7] border border-[#F59E0B]/30 rounded-2xl p-3.5 text-xs text-[#B45309] space-y-2">
                    <div className="flex items-start gap-2 font-extrabold">
                      <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                      <span>Atenție la disponibilitatea stocului în {selectedStore}:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-[11px] font-medium pl-1">
                      {stockValidation.itemResults.filter(r => r.status !== 'available').map(res => (
                        <li key={res.productId}>
                          <strong className="text-[#0D1B2A]">{res.productName}</strong>: 
                          {res.status === 'insufficient' && ` Solicitat: ${res.requestedQty}, Disponibil: ${res.availableQty} unități.`}
                          {res.status === 'unavailable' && ` Indisponibil local.`}
                          {res.otherStoreWithStock && ` Transferează din ${res.otherStoreWithStock} (${res.otherStoreQty} unități).`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Cart Items Table / Cards */}
              <div className="bg-white border border-[#D9E2E1] rounded-3xl overflow-hidden shadow-xs">
                
                <div className="p-4 border-b border-[#D9E2E1] flex items-center justify-between bg-[#F8FAF9]">
                  <h3 className="font-black text-[#0D1B2A] text-sm flex items-center gap-2">
                    <span>Produse adăugate ({cartItems.length})</span>
                  </h3>
                  <span className="text-xs text-[#5C6670] font-mono font-bold">
                    {cartItems.reduce((acc, i) => acc + i.quantity, 0)} unități totale
                  </span>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#0D1B2A]">
                    <thead className="bg-[#F8FAF9] text-[#5C6670] text-[11px] uppercase tracking-wider border-b border-[#D9E2E1] font-extrabold">
                      <tr>
                        <th className="p-4">Produs</th>
                        <th className="p-4">Preț unitar</th>
                        <th className="p-4">Cantitate</th>
                        <th className="p-4 text-right">Total</th>
                        <th className="p-4 text-center">Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D9E2E1]">
                      {cartItems.map((item) => {
                        const prod = item.product;
                        const lineTotal = item.appliedPrice * item.quantity;
                        const stockVal = stockValidation.itemResults.find(r => r.productId === prod.id);

                        return (
                          <tr key={prod.id} className="hover:bg-[#EFFAF6]/50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3 max-w-sm">
                                <img 
                                  src={prod.image} 
                                  alt={prod.name} 
                                  className="w-16 h-16 object-cover rounded-xl border border-[#D9E2E1] bg-white shrink-0 cursor-pointer"
                                  onClick={() => onNavigateToProduct(prod.slug || prod.id)} 
                                />
                                <div className="min-w-0">
                                  <span className="text-[10px] text-[#087F5B] font-extrabold uppercase">{prod.brand}</span>
                                  <h4 
                                    onClick={() => onNavigateToProduct(prod.slug || prod.id)}
                                    className="font-extrabold text-[#0D1B2A] text-xs hover:text-[#087F5B] cursor-pointer line-clamp-2"
                                  >
                                    {prod.name}
                                  </h4>
                                  <p className="text-[10px] text-[#5C6670] font-mono mt-0.5">SKU: {prod.sku}</p>
                                  
                                  {stockVal && stockVal.status !== 'available' && (
                                    <span className="inline-block bg-[#FEF3C7] text-[#B45309] text-[10px] px-2 py-0.5 rounded font-bold mt-1 border border-[#F59E0B]/30">
                                      {stockVal.status === 'insufficient' ? `Stoc limitat: ${stockVal.availableQty}` : 'Verifică stocul'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="p-4 whitespace-nowrap">
                              <span className="font-extrabold text-[#0D1B2A]">{formatMoney(item.appliedPrice)}</span>
                              <span className="block text-[10px] text-[#5C6670] font-medium">per {prod.unit}</span>
                            </td>

                            <td className="p-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center bg-white border border-[#D9E2E1] rounded-xl p-0.5">
                                  <button
                                    onClick={() => onUpdateQuantity(prod.id, Math.max(1, item.quantity - 1))}
                                    className="w-7 h-7 text-[#0D1B2A] font-bold hover:bg-[#EFFAF6] rounded-lg flex items-center justify-center cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <input 
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value, 10);
                                      if (!isNaN(val) && val > 0) onUpdateQuantity(prod.id, val);
                                    }}
                                    className="w-12 text-center font-bold text-xs bg-transparent text-[#0D1B2A] focus:outline-none"
                                  />
                                  <button
                                    onClick={() => onUpdateQuantity(prod.id, item.quantity + 1)}
                                    className="w-7 h-7 text-[#0D1B2A] font-bold hover:bg-[#EFFAF6] rounded-lg flex items-center justify-center cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                                <span className="text-[11px] text-[#5C6670] font-medium">{prod.unit}</span>
                              </div>
                            </td>

                            <td className="p-4 text-right whitespace-nowrap font-black text-[#0D1B2A] text-sm">
                              {formatMoney(lineTotal)}
                            </td>

                            <td className="p-4 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => onSaveForLater(prod.id)}
                                  title="Salvează pentru mai târziu"
                                  className="p-1.5 text-[#5C6670] hover:text-[#087F5B] rounded-lg hover:bg-[#EFFAF6] transition-colors cursor-pointer"
                                >
                                  <Bookmark className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRemoveWithUndo(item)}
                                  title="Elimină din coș"
                                  className="p-1.5 text-[#5C6670] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Stacked Card View */}
                <div className="md:hidden divide-y divide-[#D9E2E1]">
                  {cartItems.map((item) => {
                    const prod = item.product;
                    const lineTotal = item.appliedPrice * item.quantity;

                    return (
                      <div key={prod.id} className="p-4 space-y-3 bg-white">
                        <div className="flex gap-3">
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            className="w-16 h-16 object-cover rounded-xl border border-[#D9E2E1] bg-[#F8FAF9] shrink-0"
                            onClick={() => onNavigateToProduct(prod.slug || prod.id)}
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] text-[#087F5B] font-extrabold uppercase">{prod.brand}</span>
                            <h4 
                              onClick={() => onNavigateToProduct(prod.slug || prod.id)}
                              className="font-extrabold text-[#0D1B2A] text-xs line-clamp-2"
                            >
                              {prod.name}
                            </h4>
                            <p className="text-[11px] text-[#5C6670] mt-0.5 font-medium">{formatMoney(item.appliedPrice)} / {prod.unit}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#D9E2E1] text-xs">
                          <div className="flex items-center bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl p-0.5">
                            <button
                              onClick={() => onUpdateQuantity(prod.id, Math.max(1, item.quantity - 1))}
                              className="w-7 h-7 text-[#0D1B2A] font-bold"
                            >
                              -
                            </button>
                            <input 
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val) && val > 0) onUpdateQuantity(prod.id, val);
                              }}
                              className="w-10 text-center font-bold text-xs bg-transparent text-[#0D1B2A] focus:outline-none"
                            />
                            <button
                              onClick={() => onUpdateQuantity(prod.id, item.quantity + 1)}
                              className="w-7 h-7 text-[#0D1B2A] font-bold"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="font-black text-[#0D1B2A] text-sm block">{formatMoney(lineTotal)}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                onClick={() => onSaveForLater(prod.id)}
                                className="text-[11px] text-[#5C6670] hover:text-[#087F5B] font-semibold"
                              >
                                Salvează
                              </button>
                              <span className="text-[#D9E2E1]">•</span>
                              <button
                                onClick={() => handleRemoveWithUndo(item)}
                                className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold"
                              >
                                Elimină
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Receiving Method Section */}
              <div className="bg-white border border-[#D9E2E1] rounded-3xl p-5 space-y-4 shadow-xs">
                <div>
                  <h3 className="font-black text-[#0D1B2A] text-sm">Cum dorești să primești comanda?</h3>
                  <p className="text-xs text-[#5C6670] font-medium">Alege modalitatea de livrare sau ridicare din magazinul CodeBau.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setReceivingMethod('store_pickup')}
                    className={`p-4 rounded-2xl border text-left transition-all space-y-2 cursor-pointer ${
                      receivingMethod === 'store_pickup' 
                        ? 'bg-[#EFFAF6] border-[#087F5B] text-[#087F5B] shadow-xs' 
                        : 'bg-[#F8FAF9] border-[#D9E2E1] text-[#0D1B2A] hover:border-[#087F5B]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Store className="w-5 h-5 text-[#087F5B]" />
                      <span className="text-[10px] bg-[#DDF5EE] text-[#087F5B] font-extrabold px-2 py-0.5 rounded border border-[#00A878]/30">
                        GRATUIT
                      </span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-[#0D1B2A]">Ridicare din magazin</h4>
                      <p className="text-[11px] text-[#5C6670] mt-0.5 font-medium">{selectedStore}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setReceivingMethod('delivery')}
                    className={`p-4 rounded-2xl border text-left transition-all space-y-2 cursor-pointer ${
                      receivingMethod === 'delivery' 
                        ? 'bg-[#EFFAF6] border-[#087F5B] text-[#087F5B] shadow-xs' 
                        : 'bg-[#F8FAF9] border-[#D9E2E1] text-[#0D1B2A] hover:border-[#087F5B]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Truck className="w-5 h-5 text-[#087F5B]" />
                      <span className="text-[10px] font-extrabold text-[#0D1B2A]">
                        49,00 MDL
                      </span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-[#0D1B2A]">Livrare la șantier</h4>
                      <p className="text-[11px] text-[#5C6670] mt-0.5 font-medium">Camion cu macara în sudul Moldovei</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setReceivingMethod('locker_247')}
                    className={`p-4 rounded-2xl border text-left transition-all space-y-2 cursor-pointer ${
                      receivingMethod === 'locker_247' 
                        ? 'bg-[#EFFAF6] border-[#087F5B] text-[#087F5B] shadow-xs' 
                        : 'bg-[#F8FAF9] border-[#D9E2E1] text-[#0D1B2A] hover:border-[#087F5B]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <QrCode className="w-5 h-5 text-[#087F5B]" />
                      <span className="text-[10px] bg-[#DDF5EE] text-[#087F5B] font-extrabold px-2 py-0.5 rounded border border-[#00A878]/30">
                        GRATUIT
                      </span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-[#0D1B2A]">Locker CodeBau 24/7</h4>
                      <p className="text-[11px] text-[#5C6670] mt-0.5 font-medium">Ridicare fără coadă oricând</p>
                    </div>
                  </button>
                </div>

                {receivingMethod === 'locker_247' && hasIneligibleLockerItem && (
                  <div className="bg-[#FEF3C7] border border-[#F59E0B]/30 rounded-2xl p-3.5 text-xs text-[#B45309] flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-extrabold">Anumite produse din coș depășesc dimensiunile locker-ului.</p>
                      <p className="text-[11px] text-[#5C6670] mt-0.5 font-medium">
                        Vă recomandăm ridicarea din magazin sau livrarea direct pe șantier.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Saved for Later Section */}
              {savedItems.length > 0 && (
                <div className="bg-white border border-[#D9E2E1] rounded-3xl p-5 space-y-3 shadow-xs">
                  <h3 className="font-black text-[#0D1B2A] text-sm flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-[#087F5B]" />
                    <span>Salvate pentru mai târziu ({savedItems.length})</span>
                  </h3>

                  <div className="divide-y divide-[#D9E2E1]">
                    {savedItems.map((item) => (
                      <div key={item.product.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-xl border border-[#D9E2E1]" />
                          <div>
                            <p className="font-extrabold text-[#0D1B2A] line-clamp-1">{item.product.name}</p>
                            <p className="text-[#5C6670] text-[11px] font-medium">{formatMoney(item.appliedPrice)} / {item.product.unit}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onMoveToCartFromSaved(item.product.id)}
                            className="bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                          >
                            Mută în coș
                          </button>
                          <button
                            onClick={() => onRemoveSavedItem(item.product.id)}
                            className="text-[#5C6670] hover:text-rose-600 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Complementary Products Section */}
              {complementaryProducts.length > 0 && (
                <div className="bg-white border border-[#D9E2E1] rounded-3xl p-5 space-y-4 shadow-xs">
                  <div>
                    <h3 className="font-black text-[#0D1B2A] text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#087F5B]" />
                      <span>Ai putea avea nevoie și de:</span>
                    </h3>
                    <p className="text-xs text-[#5C6670] font-medium">Scule, amorsă și accesorii recomandate pentru produsele din coș.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {complementaryProducts.map(prod => (
                      <div key={prod.id} className="bg-[#F8FAF9] border border-[#D9E2E1] rounded-2xl p-3 flex flex-col justify-between text-xs space-y-2">
                        <div className="flex items-center gap-2.5">
                          <img src={prod.image} alt={prod.name} className="w-12 h-12 object-cover rounded-xl border border-[#D9E2E1] shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] text-[#087F5B] font-extrabold uppercase">{prod.brand}</p>
                            <h4 className="font-extrabold text-[#0D1B2A] line-clamp-2 leading-tight">{prod.name}</h4>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#D9E2E1]">
                          <span className="font-black text-[#087F5B]">{formatMoney(prod.priceRetail)}</span>
                          <button
                            onClick={() => onAddToCart(prod, 1)}
                            className="bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-white" />
                            <span>Adaugă</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
              
              <div className="bg-white border border-[#D9E2E1] rounded-3xl p-5 space-y-4 shadow-xs">
                <h3 className="font-black text-[#0D1B2A] text-base border-b border-[#D9E2E1] pb-3">Sumar Comandă CodeBau</h3>

                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <label className="block text-xs font-extrabold text-[#0D1B2A]">Ai un cod promoțional?</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="ex: TEST5 sau MEISTER10"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-[#F8FAF9] text-[#0D1B2A] placeholder-[#5C6670] text-xs rounded-xl p-2.5 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B] font-mono uppercase"
                    />
                    <button
                      type="submit"
                      className="bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
                    >
                      Aplică
                    </button>
                  </div>
                  {promoError && <p className="text-[11px] text-rose-600 font-medium">{promoError}</p>}
                  {appliedPromo && (
                    <div className="bg-[#DDF5EE] border border-[#00A878]/30 rounded-xl p-2 text-[11px] text-[#087F5B] flex items-center justify-between font-extrabold">
                      <span>Cod {appliedPromo.code} aplicat (-{appliedPromo.discountPercent}%)</span>
                      <span>-{formatMoney(appliedPromo.discountMDL)}</span>
                    </div>
                  )}
                </form>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs border-t border-[#D9E2E1] pt-3">
                  <div className="flex justify-between text-[#5C6670] font-medium">
                    <span>Subtotal produse:</span>
                    <span className="text-[#0D1B2A] font-extrabold">{formatMoney(subtotal)}</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between text-[#087F5B] font-extrabold">
                      <span>Reducere promoțională:</span>
                      <span>-{formatMoney(promoDiscountMDL)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#5C6670] font-medium">
                    <span>Livrare:</span>
                    <span className="text-[#0D1B2A] font-extrabold">
                      {deliveryFee > 0 ? formatMoney(deliveryFee) : 'Gratuit'}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#5C6670] text-[11px] font-medium">
                    <span>Din care TVA (20%):</span>
                    <span>{formatMoney(vatAmount)}</span>
                  </div>

                  <div className="flex justify-between text-base sm:text-lg font-black text-[#087F5B] pt-3 border-t border-[#D9E2E1]">
                    <span>TOTAL DE PLATĂ:</span>
                    <span>{formatMoney(total)}</span>
                  </div>
                </div>

                {checkoutError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                {/* Primary Action Button */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold py-4 rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <span>Continuă comanda</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <div className="space-y-2 text-[11px] text-[#5C6670] pt-2 border-t border-[#D9E2E1] font-medium">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#087F5B] shrink-0" />
                    <span>Garanție CodeBau & Factură Fiscală</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#087F5B] shrink-0" />
                    <span>Livrare rapidă în tot sudul Moldovei</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Clear Cart Confirmation Modal */}
        {showClearModal && (
          <div className="fixed inset-0 z-50 bg-[#0D1B2A]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-[#D9E2E1] rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95">
              <h3 className="font-extrabold text-[#0D1B2A] text-base">Golește coșul</h3>
              <p className="text-xs text-[#5C6670] font-medium">Sigur dorești să elimini toate produsele din coșul de cumpărături?</p>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setShowClearModal(false)}
                  className="flex-1 bg-[#F8FAF9] text-[#0D1B2A] border border-[#D9E2E1] font-extrabold py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  Anulează
                </button>
                <button
                  onClick={() => {
                    onClearCart();
                    setShowClearModal(false);
                  }}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  Da, golește
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Store Switcher Modal */}
        {showStoreModal && (
          <div className="fixed inset-0 z-50 bg-[#0D1B2A]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-[#D9E2E1] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[#D9E2E1] pb-3">
                <h3 className="font-extrabold text-[#0D1B2A] text-base">Alege magazinul CodeBau</h3>
                <button onClick={() => setShowStoreModal(false)} className="text-[#5C6670] hover:text-[#0D1B2A] cursor-pointer">
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </button>
              </div>

              <p className="text-xs text-[#5C6670] font-medium">
                Selectează magazinul cel mai apropiat pentru verificarea stocurilor și ridicarea comenzii.
              </p>

              <div className="space-y-2">
                {MOCK_STORES.map(store => (
                  <button
                    key={store.id}
                    onClick={() => {
                      handleSelectNewStore(store.name);
                      setShowStoreModal(false);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                      selectedStore === store.name 
                        ? 'bg-[#EFFAF6] border-[#087F5B] text-[#087F5B] font-extrabold' 
                        : 'bg-[#F8FAF9] border-[#D9E2E1] text-[#0D1B2A] hover:border-[#087F5B]/50'
                    }`}
                  >
                    <div>
                      <p className="font-extrabold text-[#0D1B2A]">{store.name}</p>
                      <p className="text-[11px] text-[#5C6670] font-medium">{store.address}</p>
                    </div>
                    {selectedStore === store.name && <Check className="w-4 h-4 text-[#087F5B]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Checkout Modal / Order Placement */}
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 bg-[#0D1B2A]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-[#D9E2E1] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in zoom-in-95">
              
              <div className="border-b border-[#D9E2E1] pb-4">
                <span className="text-[10px] bg-[#DDF5EE] text-[#087F5B] font-extrabold px-2.5 py-1 rounded-full border border-[#00A878]/30 uppercase">
                  Finalizare Comandă
                </span>
                <h3 className="text-xl font-black text-[#0D1B2A] mt-2">Confirmă comanda CodeBau</h3>
                <p className="text-xs text-[#5C6670] font-medium">Comanda ta va fi transmisă magazinului din {selectedStore}.</p>
              </div>

              <div className="bg-[#F8FAF9] border border-[#D9E2E1] rounded-2xl p-4 space-y-2 text-xs font-medium">
                <div className="flex justify-between">
                  <span className="text-[#5C6670]">Magazin ridicare / expediere:</span>
                  <span className="text-[#0D1B2A] font-extrabold">{selectedStore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6670]">Metodă primire:</span>
                  <span className="text-[#0D1B2A] font-extrabold">
                    {receivingMethod === 'store_pickup' ? 'Ridicare magazin' : receivingMethod === 'delivery' ? 'Livrare la șantier' : 'Locker CodeBau 24/7'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6670]">Număr de produse:</span>
                  <span className="text-[#0D1B2A] font-extrabold">{cartItems.length} tipuri ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} unități)</span>
                </div>
                <div className="flex justify-between text-[#087F5B] text-sm font-black pt-2 border-t border-[#D9E2E1]">
                  <span>TOTAL DE PLATĂ:</span>
                  <span>{formatMoney(total)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="flex-1 bg-[#F8FAF9] text-[#0D1B2A] border border-[#D9E2E1] font-extrabold py-3.5 rounded-xl text-xs cursor-pointer"
                >
                  Înapoi
                </button>
                <button
                  onClick={handleFinalizeOrder}
                  className="flex-1 bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold py-3.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Trimite comanda
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
