import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS, MOCK_CRAFTSMEN } from '../data/mockData';
import { Product, Order, Craftsman } from '../types';
import { OrderRepository } from '../services/orderRepository';
import { ShieldCheck, Package, Store, Users, Wrench, AlertCircle, CheckCircle2, Search, Edit3, Plus, TrendingUp, DollarSign, Info, RefreshCw, Tag, Sparkles } from 'lucide-react';
import { formatMoney } from '../utils/formatters';
import { AdminPromotionsView } from './AdminPromotionsView';
import { AdminNewsView } from './AdminNewsView';
import { AdminArticlesView } from './AdminArticlesView';
import { BookOpen } from 'lucide-react';

export const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'craftsmen' | 'promotions' | 'news' | 'articles'>('inventory');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    setOrders(OrderRepository.getOrders());
  }, []);

  const refreshOrders = () => {
    setOrders(OrderRepository.getOrders());
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const target = orders.find(o => o.id === orderId);
    if (target) {
      const updated: Order = {
        ...target,
        status: newStatus,
        stockReservationStatus: newStatus === 'cancelled' ? 'released' : target.stockReservationStatus,
        updatedAt: new Date().toISOString()
      };
      if (!updated.auditLogs) updated.auditLogs = [];
      updated.auditLogs.push({
        timestamp: new Date().toISOString(),
        action: `status_changed_to_${newStatus}`,
        performedBy: 'Admin CodeBau',
        notes: `Status modificat din panoul de administrare.`
      });
      OrderRepository.saveOrder(updated);
      refreshOrders();
      if (selectedOrder?.id === orderId) setSelectedOrder(updated);
    }
  };

  const handleUpdateStock = (productId: string, store: 'cahul' | 'cantemir' | 'vulcanesti' | 'taraclia', newQty: number) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        if (store === 'cahul') return { ...p, inStockCahul: newQty };
        if (store === 'cantemir') return { ...p, inStockCantemir: newQty };
        if (store === 'vulcanesti') return { ...p, inStockVulcanesti: newQty };
        if (store === 'taraclia') return { ...p, inStockTaraclia: newQty };
      }
      return p;
    }));
  };

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Executive Banner */}
      <div className="bg-[#0D1B2A] border border-[#1A3448] p-8 rounded-3xl text-white relative overflow-hidden shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#DDF5EE] text-[#087F5B] text-xs font-extrabold px-3 py-1 rounded-full border border-[#00A878]/30">
              <ShieldCheck className="w-4 h-4 text-[#087F5B]" />
              <span>Panou de Administrare Executivă CodeBau</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              Gestiune Stocuri, Comenzi & Rețea Meșteri — Sudul RM
            </h1>
            <p className="text-slate-300 text-xs max-w-2xl leading-relaxed font-medium">
              Sincronizare automată în timp real între ERP, POS Casa de Marcat, Magazinele Cahul, Cantemir, Vulcănești, Taraclia, Locker 24/7 și Magazinul Online.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-right">
            <div className="bg-[#13283A] p-3.5 rounded-2xl border border-[#1A3448]">
              <p className="text-[10px] text-slate-300 uppercase font-extrabold tracking-wider">Vânzări Totale Azi</p>
              <p className="text-xl font-black text-[#00A878]">{formatMoney(totalRevenue)}</p>
            </div>
            <div className="bg-[#13283A] p-3.5 rounded-2xl border border-[#1A3448]">
              <p className="text-[10px] text-slate-300 uppercase font-extrabold tracking-wider">Comenzi Active</p>
              <p className="text-xl font-black text-white">{orders.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-[#D9E2E1] text-xs font-extrabold uppercase tracking-wider overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'inventory' ? 'border-[#00A878] text-[#00A878]' : 'border-transparent text-[#5C6670] hover:text-[#0D1B2A]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Gestiune Stocuri pe Magazine ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'orders' ? 'border-[#00A878] text-[#00A878]' : 'border-transparent text-[#5C6670] hover:text-[#0D1B2A]'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Gestiune Comenzi Live ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('craftsmen')}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'craftsmen' ? 'border-[#00A878] text-[#00A878]' : 'border-transparent text-[#5C6670] hover:text-[#0D1B2A]'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Aprobare Meșteri Meister Club</span>
        </button>

        <button
          onClick={() => setActiveTab('promotions')}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'promotions' ? 'border-[#F4B400] text-amber-700 bg-amber-50/50' : 'border-transparent text-[#5C6670] hover:text-[#0D1B2A]'
          }`}
        >
          <Tag className="w-4 h-4 text-amber-500 fill-current" />
          <span>Campanii Promoții</span>
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'news' ? 'border-[#087F5B] text-[#087F5B] bg-[#EFFAF6]/50' : 'border-transparent text-[#5C6670] hover:text-[#0D1B2A]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#087F5B]" />
          <span>Regulă Noutăți</span>
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'articles' ? 'border-[#00A878] text-[#00A878] bg-[#EFFAF6]' : 'border-transparent text-[#5C6670] hover:text-[#0D1B2A]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#00A878]" />
          <span>Centrul CodeBau (Ghiduri & Articole)</span>
        </button>

        <button
          onClick={() => {
            window.history.pushState({}, '', '/admin/catalog-pilot');
            window.dispatchEvent(new Event('popstate'));
          }}
          className="py-3 px-5 border-b-2 border-transparent text-[#00A878] hover:bg-[#EFFAF6] font-black transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ml-auto"
        >
          <Sparkles className="w-4 h-4 text-[#00A878]" />
          <span>Catalog Pilot PIM (/admin/catalog-pilot) →</span>
        </button>
      </div>

      {activeTab === 'articles' && (
        <AdminArticlesView />
      )}

      {/* Inventory Management Table */}
      {activeTab === 'inventory' && (
        <div className="bg-white border border-[#D9E2E1] rounded-3xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-[#D9E2E1] flex items-center justify-between text-xs font-extrabold text-[#0D1B2A] bg-[#F8FAF9]">
            <span>Catalog Produse & Sincronizare Stocuri Magazin (Cahul, Cantemir, Vulcănești, Taraclia)</span>
            <span className="text-[#087F5B] font-mono">Status ERP: Sincronizat 100%</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#0D1B2A]">
              <thead className="bg-[#F8FAF9] text-[#5C6670] uppercase font-extrabold border-b border-[#D9E2E1]">
                <tr>
                  <th className="p-4">Produs / Brand</th>
                  <th className="p-4">SKU / Barcode</th>
                  <th className="p-4">Preț Retail</th>
                  <th className="p-4">Preț Pro</th>
                  <th className="p-4">Stoc Cahul</th>
                  <th className="p-4">Stoc Cantemir</th>
                  <th className="p-4">Stoc Vulcănești</th>
                  <th className="p-4">Stoc Taraclia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E2E1]">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-[#EFFAF6]/50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-xl border border-[#D9E2E1]" />
                      <div>
                        <p className="font-extrabold text-[#0D1B2A]">{p.name}</p>
                        <p className="text-[10px] text-[#087F5B] font-extrabold">{p.brand}</p>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-[#5C6670] font-bold">{p.sku}</td>
                    <td className="p-4 font-extrabold text-[#0D1B2A]">{formatMoney(p.priceRetail)}</td>
                    <td className="p-4 font-extrabold text-[#087F5B]">{formatMoney(p.pricePro)}</td>
                    
                    <td className="p-4">
                      <input
                        type="number"
                        value={p.inStockCahul ?? 0}
                        onChange={(e) => handleUpdateStock(p.id, 'cahul', Number(e.target.value))}
                        className="w-16 bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl p-1.5 text-center font-mono font-bold text-[#087F5B] focus:outline-none focus:border-[#087F5B]"
                      />
                    </td>

                    <td className="p-4">
                      <input
                        type="number"
                        value={p.inStockCantemir ?? 0}
                        onChange={(e) => handleUpdateStock(p.id, 'cantemir', Number(e.target.value))}
                        className="w-16 bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl p-1.5 text-center font-mono font-bold text-[#087F5B] focus:outline-none focus:border-[#087F5B]"
                      />
                    </td>

                    <td className="p-4">
                      <input
                        type="number"
                        value={p.inStockVulcanesti ?? 0}
                        onChange={(e) => handleUpdateStock(p.id, 'vulcanesti', Number(e.target.value))}
                        className="w-16 bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl p-1.5 text-center font-mono font-bold text-[#087F5B] focus:outline-none focus:border-[#087F5B]"
                      />
                    </td>

                    <td className="p-4">
                      <input
                        type="number"
                        value={p.inStockTaraclia ?? 0}
                        onChange={(e) => handleUpdateStock(p.id, 'taraclia', Number(e.target.value))}
                        className="w-16 bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl p-1.5 text-center font-mono font-bold text-[#087F5B] focus:outline-none focus:border-[#087F5B]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Management */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-[#D9E2E1] rounded-3xl overflow-hidden shadow-xs space-y-4">
          <div className="p-5 border-b border-[#D9E2E1] flex items-center justify-between text-xs font-extrabold text-[#0D1B2A] bg-[#F8FAF9]">
            <span>Gestiune Comenzi Live & Rezervări Stoc (Sudul RM)</span>
            <button
              onClick={refreshOrders}
              className="flex items-center gap-1.5 text-[#087F5B] hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reîmprospătează
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#0D1B2A]">
              <thead className="bg-[#F8FAF9] text-[#5C6670] uppercase font-extrabold border-b border-[#D9E2E1]">
                <tr>
                  <th className="p-4">Comandă / Data</th>
                  <th className="p-4">Client / Tip</th>
                  <th className="p-4">Magazin / Metodă</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status Comandă</th>
                  <th className="p-4">Stoc Rezervat</th>
                  <th className="p-4">Mediu</th>
                  <th className="p-4 text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E2E1]">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-[#5C6670]">
                      Nu există comenzi de test înregistrate încă.
                    </td>
                  </tr>
                ) : (
                  orders.map(o => (
                    <tr key={o.id} className="hover:bg-[#EFFAF6]/50 transition-colors">
                      <td className="p-4">
                        <p className="font-mono font-black text-[#087F5B] text-xs">{o.orderNumber}</p>
                        <p className="text-[10px] text-[#5C6670]">{o.date}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-extrabold">{o.clientName}</p>
                        <p className="text-[10px] text-[#5C6670] font-mono">{o.customerData?.phone || 'fără tel'}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold">{o.storeLocation || 'Cahul'}</p>
                        <p className="text-[10px] text-[#087F5B] font-extrabold">
                          {o.fulfillmentMethod === 'store_pickup' && 'Ridicare'}
                          {o.fulfillmentMethod === 'delivery' && 'Livrare'}
                          {o.fulfillmentMethod === 'locker_247' && 'Locker 24/7'}
                        </p>
                      </td>
                      <td className="p-4 font-black text-[#0D1B2A]">
                        {formatMoney(o.total)}
                      </td>
                      <td className="p-4">
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as Order['status'])}
                          className="bg-[#F8FAF9] border border-[#D9E2E1] text-[11px] font-extrabold rounded-lg p-1 text-[#0D1B2A] focus:outline-none"
                        >
                          <option value="submitted">Înregistrată</option>
                          <option value="confirmed">Confirmată</option>
                          <option value="preparing">În pregătire</option>
                          <option value="ready_for_pickup">Gata ridicare</option>
                          <option value="completed">Finalizată</option>
                          <option value="cancelled">Anulată</option>
                          <option value="requires_review">Necesită verificare</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          o.stockReservationStatus === 'reserved' ? 'bg-[#DDF5EE] text-[#087F5B]' :
                          o.stockReservationStatus === 'released' ? 'bg-gray-100 text-gray-600' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {o.stockReservationStatus || 'fără stoc'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="bg-[#FEF3C7] text-[#92400E] font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-[#F59E0B]/30">
                          TEST
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="bg-[#087F5B] text-white text-[11px] font-extrabold px-3 py-1.5 rounded-lg hover:bg-[#066B4D] transition-colors cursor-pointer"
                        >
                          Detalii
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Craftsmen Management */}
      {activeTab === 'craftsmen' && (
        <div className="space-y-4">
          {MOCK_CRAFTSMEN.map(c => (
            <div key={c.id} className="bg-white border border-[#D9E2E1] p-5 rounded-3xl text-[#0D1B2A] flex items-center justify-between text-xs shadow-xs">
              <div className="flex items-center gap-3">
                <img src={c.avatar} alt={c.name} className="w-12 h-12 object-cover rounded-2xl border border-[#D9E2E1]" />
                <div>
                  <h4 className="font-extrabold text-sm text-[#0D1B2A]">{c.name}</h4>
                  <p className="text-[#5C6670] font-medium">{c.specialties.join(', ')} • {c.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-[#DDF5EE] text-[#087F5B] font-extrabold px-3 py-1 rounded-full border border-[#00A878]/30">
                  Verificat CodeBau
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-[#0D1B2A]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#D9E2E1] rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#D9E2E1] pb-3">
              <div>
                <span className="bg-[#FEF3C7] text-[#92400E] font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-[#F59E0B]/30 mr-2">
                  TEST ORDER
                </span>
                <span className="font-mono font-black text-[#087F5B] text-base">{selectedOrder.orderNumber}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#5C6670] hover:text-[#0D1B2A] font-bold text-sm cursor-pointer"
              >
                ✕ Închide
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#F8FAF9] p-3 rounded-2xl space-y-1">
                <p className="font-extrabold text-[#5C6670] uppercase text-[10px]">Date Client</p>
                <p className="font-extrabold text-[#0D1B2A]">{selectedOrder.clientName}</p>
                <p className="text-[#5C6670] font-mono">{selectedOrder.customerData?.phone}</p>
                <p className="text-[#5C6670]">{selectedOrder.customerData?.email}</p>
              </div>

              <div className="bg-[#F8FAF9] p-3 rounded-2xl space-y-1">
                <p className="font-extrabold text-[#5C6670] uppercase text-[10px]">Logistică & Magazin</p>
                <p className="font-extrabold text-[#0D1B2A]">{selectedOrder.storeLocation || 'Cahul'}</p>
                <p className="text-[#5C6670]">Metodă: {selectedOrder.fulfillmentMethod}</p>
                <p className="text-[#087F5B] font-bold">Dată: {selectedOrder.requestedDate}</p>
              </div>
            </div>

            <div className="border border-[#D9E2E1] rounded-2xl overflow-hidden text-xs">
              <div className="bg-[#F8FAF9] p-2.5 font-extrabold text-[#0D1B2A] border-b border-[#D9E2E1]">
                Produse ({selectedOrder.items.length})
              </div>
              <div className="divide-y divide-[#D9E2E1]">
                {selectedOrder.items.map(i => (
                  <div key={i.product.id} className="p-2.5 flex justify-between items-center">
                    <span>{i.product.name} × {i.quantity} {i.product.unit}</span>
                    <span className="font-black">{formatMoney(i.appliedPrice * i.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="text-xs">
                <span className="font-bold text-[#5C6670]">Total: </span>
                <span className="font-black text-sm text-[#087F5B]">{formatMoney(selectedOrder.total)}</span>
              </div>

              <button
                onClick={() => {
                  handleUpdateOrderStatus(selectedOrder.id, 'cancelled');
                }}
                className="bg-rose-50 border border-rose-200 text-rose-700 font-extrabold text-xs px-4 py-2 rounded-xl hover:bg-rose-100 cursor-pointer"
              >
                Anulează comanda & Eliberează stoc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promotions Tab */}
      {activeTab === 'promotions' && <AdminPromotionsView />}

      {/* News Tab */}
      {activeTab === 'news' && <AdminNewsView />}

    </div>
  );
};
