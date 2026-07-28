import React, { useEffect, useRef, useState } from 'react';
import { CartItem, DeliveryMethod, UserRole, Order } from '../types';
import { X, Trash2, ShoppingCart, Truck, QrCode, ArrowRight, Bookmark, AlertCircle, ShoppingBag } from 'lucide-react';
import { formatMoney } from '../utils/formatters';
import { logTestEvent } from '../services/cartRepository';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onSaveForLater?: (productId: string) => void;
  onClearCart: () => void;
  currentRole: UserRole;
  selectedStore: string;
  onOrderPlaced: (order: Order) => void;
  onNavigateToCartPage: () => void;
  onNavigateToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onSaveForLater,
  onClearCart,
  currentRole,
  selectedStore,
  onOrderPlaced,
  onNavigateToCartPage,
  onNavigateToCheckout
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('express_site');

  // Lock body scroll and focus management
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      logTestEvent('cart_opened', { itemsCount: cartItems.length, selectedStore });

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
        if (triggerElementRef.current && typeof triggerElementRef.current.focus === 'function') {
          triggerElementRef.current.focus();
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.appliedPrice * item.quantity), 0);
  const deliveryFee = deliveryMethod === 'express_site' ? 49.00 : 0;
  const total = Math.max(0, subtotal + deliveryFee);

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#0D1B2A]/60 backdrop-blur-sm flex justify-end transition-opacity duration-200"
      onClick={(e) => {
        if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
          onClose();
        }
      }}
    >
      <div 
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Coșul tău de cumpărături CodeBau"
        className="bg-white border-l border-[#D9E2E1] text-[#0D1B2A] w-full sm:w-[450px] lg:w-[480px] h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1A3448] flex items-center justify-between bg-[#0D1B2A] text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DDF5EE] border border-[#00A878]/30 flex items-center justify-center text-[#087F5B]">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                Coșul tău
                <span className="bg-[#DDF5EE] text-[#087F5B] text-xs px-2 py-0.5 rounded-full font-mono font-bold">
                  {cartItems.reduce((acc, i) => acc + i.quantity, 0)} unități
                </span>
              </h3>
              <p className="text-[11px] text-slate-300 font-medium">Produsele nu sunt rezervate până la confirmarea comenzii.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            aria-label="Închide coșul"
            className="p-2 text-slate-300 hover:text-white rounded-xl bg-[#13283A] hover:bg-[#1A3448] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-20 h-20 bg-[#F8FAF9] rounded-full border border-[#D9E2E1] flex items-center justify-center mx-auto text-[#5C6670] shadow-xs">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-base text-[#0D1B2A]">Coșul tău de cumpărături este gol</h4>
                <p className="text-xs text-[#5C6670] max-w-xs mx-auto font-medium">
                  Descoperă produsele CodeBau din magazinul {selectedStore} sau folosește calculatorul de materiale pentru proiectul tău!
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-xs inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Explorează produsele</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Store context indicator */}
              <div className="bg-[#EFFAF6] border border-[#00A878]/30 rounded-xl p-2.5 text-xs text-[#0D1B2A] flex items-center justify-between">
                <span className="text-[#5C6670] font-medium">Magazin selectat:</span>
                <span className="font-extrabold text-[#087F5B] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#087F5B]"></span>
                  {selectedStore}
                </span>
              </div>

              {/* Items List */}
              {cartItems.map((item) => {
                const itemProd = item.product;
                const lineTotal = item.appliedPrice * item.quantity;

                return (
                  <div 
                    key={itemProd.id} 
                    className="bg-[#F8FAF9] p-3.5 rounded-2xl border border-[#D9E2E1] flex flex-col gap-2.5 text-xs transition-all hover:border-[#087F5B]/50 shadow-xs"
                  >
                    <div className="flex items-start gap-3">
                      <img 
                        src={itemProd.image} 
                        alt={itemProd.name} 
                        className="w-16 h-16 object-cover rounded-xl border border-[#D9E2E1] bg-white shrink-0" 
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="text-[#087F5B] font-extrabold uppercase tracking-wide">{itemProd.brand}</span>
                          <span className="text-[#5C6670]">• SKU: {itemProd.sku}</span>
                        </div>
                        <h4 className="font-extrabold text-[#0D1B2A] text-xs leading-snug line-clamp-2 mt-0.5">{itemProd.name}</h4>
                        <div className="text-[#5C6670] text-[11px] mt-1 font-medium flex items-center justify-between">
                          <span>{formatMoney(item.appliedPrice)} / {itemProd.unit}</span>
                          {currentRole === 'meister' && (
                            <span className="text-[#087F5B] text-[10px] font-extrabold bg-[#DDF5EE] px-1.5 py-0.5 rounded border border-[#00A878]/30">
                              Preț Meister
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity + Controls Footer row */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#D9E2E1] gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white border border-[#D9E2E1] rounded-xl p-0.5">
                          <button 
                            onClick={() => onUpdateQuantity(itemProd.id, Math.max(1, item.quantity - 1))}
                            aria-label="Scade cantitatea"
                            className="w-7 h-7 text-[#0D1B2A] font-bold hover:bg-[#EFFAF6] rounded-lg flex items-center justify-center text-sm transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <input 
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              if (!isNaN(val) && val > 0) {
                                onUpdateQuantity(itemProd.id, val);
                              }
                            }}
                            className="w-10 text-center font-bold text-xs bg-transparent text-[#0D1B2A] focus:outline-none"
                          />
                          <button 
                            onClick={() => onUpdateQuantity(itemProd.id, item.quantity + 1)}
                            aria-label="Crește cantitatea"
                            className="w-7 h-7 text-[#0D1B2A] font-bold hover:bg-[#EFFAF6] rounded-lg flex items-center justify-center text-sm transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-[11px] text-[#5C6670] font-medium">{itemProd.unit}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {onSaveForLater && (
                          <button
                            onClick={() => onSaveForLater(itemProd.id)}
                            title="Salvează pentru mai târziu"
                            className="text-[#5C6670] hover:text-[#087F5B] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Salvează</span>
                          </button>
                        )}

                        <button 
                          onClick={() => onRemoveItem(itemProd.id)}
                          title="Șterge produsul"
                          aria-label={`Șterge ${itemProd.name}`}
                          className="text-[#5C6670] hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="text-right min-w-[70px]">
                          <span className="font-extrabold text-[#0D1B2A] text-xs block">{formatMoney(lineTotal)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout Actions */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#D9E2E1] space-y-3 shrink-0">
            
            {/* Delivery option shortcut */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setDeliveryMethod('express_site')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                  deliveryMethod === 'express_site' 
                    ? 'bg-[#EFFAF6] text-[#087F5B] border-[#087F5B]' 
                    : 'bg-[#F8FAF9] text-[#0D1B2A] border-[#D9E2E1]'
                }`}
              >
                <Truck className="w-4 h-4 text-[#087F5B] shrink-0" />
                <div className="min-w-0">
                  <p className="font-extrabold text-[11px] truncate">Livrare la șantier</p>
                  <p className="text-[10px] text-[#5C6670]">49 MDL</p>
                </div>
              </button>

              <button
                onClick={() => setDeliveryMethod('locker_247')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                  deliveryMethod === 'locker_247' 
                    ? 'bg-[#EFFAF6] text-[#087F5B] border-[#087F5B]' 
                    : 'bg-[#F8FAF9] text-[#0D1B2A] border-[#D9E2E1]'
                }`}
              >
                <QrCode className="w-4 h-4 text-[#087F5B] shrink-0" />
                <div className="min-w-0">
                  <p className="font-extrabold text-[11px] truncate">Locker 24/7</p>
                  <p className="text-[10px] text-[#087F5B] font-extrabold">Gratuit</p>
                </div>
              </button>
            </div>

            {/* Totals */}
            <div className="space-y-1.5 text-xs pt-1">
              <div className="flex justify-between text-[#5C6670] font-medium">
                <span>Subtotal produse:</span>
                <span className="text-[#0D1B2A] font-extrabold">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#5C6670] font-medium">
                <span>Livrare estimată:</span>
                <span className="text-[#0D1B2A] font-extrabold">{deliveryFee > 0 ? formatMoney(deliveryFee) : 'Gratuit'}</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#087F5B] pt-2 border-t border-[#D9E2E1]">
                <span>Total estimat:</span>
                <span>{formatMoney(total)}</span>
              </div>
              <p className="text-[10px] text-[#5C6670] text-right font-medium">Inclusiv TVA 20%</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  onClose();
                  onNavigateToCartPage();
                }}
                className="w-full bg-[#F8FAF9] hover:bg-[#EFFAF6] text-[#0D1B2A] font-extrabold py-3 rounded-xl border border-[#D9E2E1] shadow-xs flex items-center justify-center gap-1.5 text-xs transition-colors cursor-pointer"
              >
                <span>Vezi coșul complet</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigateToCheckout();
                }}
                className="w-full bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold py-3 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 text-xs cursor-pointer"
              >
                <span>Continuă comanda</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
