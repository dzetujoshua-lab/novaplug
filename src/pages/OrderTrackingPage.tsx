import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { Search, Package, CheckCircle2, Clock, Truck, ShieldCheck, MapPin } from 'lucide-react';

interface OrderTrackingPageProps {
  onNavigate: (route: string, param?: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setHasSearched(true);
    const orders: Order[] = JSON.parse(localStorage.getItem('novaplug_orders') || '[]');
    const q = query.trim().toUpperCase();

    const match = orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === q ||
        o.id.toUpperCase() === q ||
        o.customerPhone.includes(query.trim()) ||
        o.paymentReference.toUpperCase() === q
    );

    setSearchedOrder(match || null);
  };

  const steps: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'placed', label: 'Order Placed', desc: 'Received in system' },
    { status: 'paid', label: 'Payment Verified', desc: 'MoMo / Card settled' },
    { status: 'processing', label: 'Lab Verification', desc: 'QC & acoustic calibration' },
    { status: 'packed', label: 'Packed & Sealed', desc: 'Cryptographic passport attached' },
    { status: 'shipped', label: 'In Transit', desc: 'With Accra dispatch courier' },
    { status: 'delivered', label: 'Delivered', desc: 'Received by customer' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    const idx = steps.findIndex((s) => s.status === status);
    return idx >= 0 ? idx : 1;
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f3f4f6] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-mono">
            <Truck className="w-3.5 h-3.5" />
            <span>REAL-TIME DISPATCH LOOKUP</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Track Your Delivery
          </h1>
          <p className="text-xs sm:text-sm text-white/50 max-w-lg mx-auto">
            Enter your NovaPlug Order Number (e.g. NP-104928) or phone number to view live courier status.
          </p>
        </div>

        {/* Search input form */}
        <div className="bg-[#11131a] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-white/40 absolute left-4 top-4" />
              <input
                type="text"
                placeholder="Enter NP-XXXXXX or Ghanaian Phone Number"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-xl pl-11 pr-4 py-3.5 text-sm font-mono text-white placeholder-white/30 focus:outline-none focus:border-amber-400 uppercase tracking-wider"
                required
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-amber-400 text-black font-semibold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors shadow-lg cursor-pointer"
            >
              Track Order
            </button>
          </form>
        </div>

        {/* Results */}
        {hasSearched && (
          <div>
            {searchedOrder ? (
              <div className="bg-[#11131a] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-8 animate-in fade-in">
                {/* Header Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/5 gap-4">
                  <div>
                    <span className="font-mono text-xs text-amber-400 font-bold">
                      {searchedOrder.orderNumber}
                    </span>
                    <h2 className="text-xl font-bold text-white mt-0.5">
                      Fulfillment Status: {searchedOrder.status.toUpperCase()}
                    </h2>
                    <p className="text-xs text-white/40">
                      Destination: {searchedOrder.shippingAddress.streetAddress},{' '}
                      {searchedOrder.shippingAddress.city} ({searchedOrder.deliveryZone})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-white/50 block">Estimated Delivery</span>
                    <span className="text-base font-semibold text-white">
                      {searchedOrder.estimatedDelivery}
                    </span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white/70">
                    Live Progress
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    {steps.map((st, i) => {
                      const completed = i <= getStepIndex(searchedOrder.status);
                      const current = i === getStepIndex(searchedOrder.status);

                      return (
                        <div key={st.status} className="space-y-1.5 text-center md:text-left">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold mx-auto md:mx-0 ${
                              completed
                                ? 'bg-amber-400 text-black'
                                : 'bg-white/5 text-white/30 border border-white/10'
                            }`}
                          >
                            {completed ? '✓' : i + 1}
                          </div>
                          <p
                            className={`text-xs font-semibold ${
                              current ? 'text-amber-400' : completed ? 'text-white' : 'text-white/40'
                            }`}
                          >
                            {st.label}
                          </p>
                          <p className="text-[10px] text-white/40 leading-tight">{st.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3 pt-6 border-t border-white/5">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white/70">
                    Package Contents
                  </h4>
                  <div className="divide-y divide-white/5">
                    {searchedOrder.items.map((it, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={it.imageUrl}
                            alt={it.productName}
                            className="w-10 h-10 rounded-lg object-cover bg-black"
                          />
                          <div>
                            <p className="font-semibold text-white">{it.productName}</p>
                            <p className="text-[11px] text-white/40">
                              Qty: {it.quantity} · {it.variantName || 'Standard'}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono text-white/90">
                          GH₵ {it.totalGHS.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onNavigate('order-confirmation', searchedOrder.id)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    View Full Printable Receipt →
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-[#11131a] rounded-2xl border border-white/10 space-y-3">
                <Package className="w-10 h-10 text-white/30 mx-auto" />
                <h3 className="text-base font-semibold text-white">No Order Found</h3>
                <p className="text-xs text-white/50 max-w-sm mx-auto">
                  We couldn't locate an order matching "{query}". Please check your order confirmation email or contact our Airport City concierge.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
