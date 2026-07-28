import React, { useState, useEffect } from 'react';
import { Order, SimulatedNotification } from '../types';
import { OrderRepository } from '../services/orderRepository';
import { TestNotificationService } from '../services/TestNotificationService';
import { formatMoney } from '../utils/formatters';
import { 
  CheckCircle2, Store, Truck, QrCode, Calendar, Clock, MapPin, User, Building2, 
  ArrowRight, ShoppingBag, ShieldCheck, Mail, MessageSquare, Copy, Check, Info, FileText
} from 'lucide-react';

interface OrderConfirmationViewProps {
  orderNumber: string;
  onNavigateToCatalog: () => void;
  onNavigateToUserAccount: () => void;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({
  orderNumber,
  onNavigateToCatalog,
  onNavigateToUserAccount
}) => {
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [copiedNumber, setCopiedNumber] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<SimulatedNotification[]>([]);
  const [showNotificationPanel, setShowNotificationPanel] = useState<boolean>(true);

  useEffect(() => {
    const loadedOrder = OrderRepository.getOrderByNumber(orderNumber);
    setOrder(loadedOrder);

    if (loadedOrder) {
      const notifs = TestNotificationService.getNotificationsForOrder(loadedOrder.id);
      setNotifications(notifs);
    }
  }, [orderNumber]);

  const handleCopyOrderNumber = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber);
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2000);
    }
  };

  if (!order) {
    return (
      <div className="bg-[#F4F7F6] min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="bg-white border border-[#D9E2E1] rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#EFFAF6] text-[#087F5B] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-[#0D1B2A]">Comanda de test #{orderNumber}</h2>
          <p className="text-xs text-[#5C6670]">
            Comanda a fost procesată și înregistrată în baza de date locală de test.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={onNavigateToCatalog}
              className="w-full bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold py-3 rounded-xl text-xs transition-colors"
            >
              Continuă cumpărăturile
            </button>
            <button
              onClick={onNavigateToUserAccount}
              className="w-full bg-[#F8FAF9] text-[#0D1B2A] font-extrabold py-3 rounded-xl text-xs border border-[#D9E2E1]"
            >
              Deschide contul meu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F7F6] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">

        {/* HERO SUCCESS CARD */}
        <div className="bg-white border border-[#D9E2E1] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs text-center sm:text-left">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-16 h-16 rounded-3xl bg-[#DDF5EE] border border-[#00A878]/30 flex items-center justify-center text-[#087F5B] shrink-0">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="inline-block bg-[#FEF3C7] text-[#92400E] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-lg border border-[#F59E0B]/30 uppercase tracking-wider">
                TEST ORDER CREATED
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0D1B2A] tracking-tight">
                Comanda de test a fost înregistrată
              </h1>
              <p className="text-xs text-[#5C6670] font-medium">
                Vă mulțumim! Comanda dvs. de test a fost transmisă și rezervată în depozitul CodeBau.
              </p>
            </div>
          </div>

          {/* ORDER NUMBER & STATUS BADGE */}
          <div className="bg-[#F8FAF9] border border-[#D9E2E1] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] text-[#5C6670] uppercase font-extrabold tracking-wider block">Număr comandă de test</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base font-mono font-black text-[#0D1B2A]">{order.orderNumber}</span>
                <button
                  onClick={handleCopyOrderNumber}
                  className="p-1 rounded-lg bg-white border border-[#D9E2E1] text-[#087F5B] hover:bg-[#EFFAF6] cursor-pointer"
                  title="Copiază numărul"
                >
                  {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#5C6670] uppercase font-extrabold">Status comanda:</span>
              <span className="bg-[#DDF5EE] text-[#087F5B] font-extrabold px-3 py-1 rounded-xl text-xs border border-[#00A878]/30">
                {order.status === 'confirmed' ? 'Confirmată & Stoc Rezervat' : 'În așteptarea verificării'}
              </span>
            </div>
          </div>

          {/* MESSAGE FROM CODEBAU */}
          <div className="bg-[#EFFAF6] border border-[#00A878]/30 rounded-2xl p-4 text-xs text-[#087F5B] flex items-start gap-3">
            <Info className="w-5 h-5 shrink-0 mt-0.5 text-[#087F5B]" />
            <div>
              <p className="font-black">Ce urmează?</p>
              <p className="text-[11px] font-medium text-[#5C6670] mt-0.5">
                Un membru al echipei CodeBau va verifica stocul, termenul și condițiile logistice ale acestei comenzi de test.
              </p>
            </div>
          </div>

          {/* DETAILS SUMMARY GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#0D1B2A] border-t border-[#D9E2E1] pt-4">
            
            <div className="space-y-2">
              <p className="font-extrabold text-[#5C6670] uppercase text-[10px]">Client & Contact</p>
              <p className="font-black text-sm">{order.clientName}</p>
              <p className="text-[#5C6670] font-mono">{order.customerData.phone} • {order.customerData.email}</p>
              {order.customerType === 'company' && (
                <p className="text-[#087F5B] font-bold">Companie B2B (IDNO: {order.customerData.idno})</p>
              )}
            </div>

            <div className="space-y-2">
              <p className="font-extrabold text-[#5C6670] uppercase text-[10px]">Primire & Magazin</p>
              <p className="font-bold">{order.storeLocation || 'CodeBau Cahul'}</p>
              <p className="text-[#5C6670]">
                {order.fulfillmentMethod === 'store_pickup' && 'Ridicare din magazin'}
                {order.fulfillmentMethod === 'delivery' && `Livrare la adresă (${order.fulfillmentDetails.deliveryAddress?.locality})`}
                {order.fulfillmentMethod === 'locker_247' && 'Locker CodeBau 24/7'}
              </p>
              <p className="text-[#087F5B] font-extrabold">Data solicitată: {order.requestedDate} ({order.requestedTimeSlot})</p>
            </div>

          </div>

          {/* PRODUCTS LIST */}
          <div className="border border-[#D9E2E1] rounded-2xl overflow-hidden text-xs">
            <div className="bg-[#F8FAF9] p-3 border-b border-[#D9E2E1] font-extrabold text-[#0D1B2A] flex justify-between">
              <span>Produse în comandă ({order.items.length})</span>
              <span>Subtotal: {formatMoney(order.subtotal)}</span>
            </div>

            <div className="divide-y divide-[#D9E2E1]">
              {order.items.map(item => (
                <div key={item.product.id} className="p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-cover rounded-xl border border-[#D9E2E1]" />
                    <div>
                      <p className="font-extrabold text-[#0D1B2A] line-clamp-1">{item.product.name}</p>
                      <p className="text-[11px] text-[#5C6670] font-mono">{item.quantity} {item.product.unit} × {formatMoney(item.appliedPrice)}</p>
                    </div>
                  </div>
                  <span className="font-black text-[#0D1B2A]">{formatMoney(item.appliedPrice * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#F8FAF9] p-3 border-t border-[#D9E2E1] flex justify-between items-center font-black text-sm text-[#087F5B]">
              <span>TOTAL COMANDĂ:</span>
              <span>{formatMoney(order.total)}</span>
            </div>
          </div>

          {/* SIMULATED NOTIFICATIONS PANEL (REQ #27) */}
          {notifications.length > 0 && (
            <div className="bg-[#FEF3C7]/40 border border-[#F59E0B]/30 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#92400E] flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#D97706]" /> Notificări simulate de test
                </span>
                <span className="bg-[#F59E0B]/20 text-[#78350F] text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  TEST LOG
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {notifications.map(n => (
                  <div key={n.id} className="bg-white border border-[#F59E0B]/30 rounded-xl p-3 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-[#5C6670]">
                      <span className="font-extrabold uppercase text-[#92400E]">{n.channel} → {n.recipient}</span>
                      <span className="font-mono">{new Date(n.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs text-[#0D1B2A] font-mono leading-relaxed">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRIMARY ACTION BUTTONS */}
          <div className="pt-4 border-t border-[#D9E2E1] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={onNavigateToCatalog}
              className="w-full sm:w-auto bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold px-6 py-3.5 rounded-2xl transition-colors text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continuă cumpărăturile</span>
            </button>

            <button
              onClick={onNavigateToUserAccount}
              className="w-full sm:w-auto bg-[#F8FAF9] hover:bg-[#EFFAF6] text-[#0D1B2A] font-extrabold px-6 py-3.5 rounded-2xl transition-colors text-xs border border-[#D9E2E1] flex items-center justify-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4 text-[#087F5B]" />
              <span>Deschide contul meu & Istoric</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
