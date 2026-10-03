import React from 'react';
import { Order, OrderStatus } from '../types';
import { CheckCircle2, Package, Truck, ShieldCheck, Printer, ArrowRight, Home } from 'lucide-react';

interface OrderConfirmationPageProps {
  order: Order | null;
  onNavigate: (route: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ order, onNavigate }) => {
  if (!order) {
    return (
      <div className="min-h-screen bg-[#0b0c10] text-[#f3f4f6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#11131a] border border-white/10 rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-xl font-display font-bold text-white">Order Not Found</h2>
          <p className="text-xs text-white/50">No recent order details available in current session.</p>
          <button
            onClick={() => onNavigate('home')}
            className="w-full py-3 rounded-xl bg-amber-400 text-black font-semibold text-xs uppercase"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  const steps: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'placed', label: 'Order Placed', desc: 'Received by system' },
    { status: 'paid', label: 'Payment Verified', desc: 'MoMo / Card settled' },
    { status: 'processing', label: 'Lab Verification', desc: 'Acoustic & QC check' },
    { status: 'packed', label: 'Packed with Passport', desc: 'Holographic seal applied' },
    { status: 'shipped', label: 'Dispatched to Courier', desc: 'En route from Accra hub' },
    { status: 'delivered', label: 'Delivered', desc: 'Handed to customer' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.status === order.status);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 1; // Default to 'paid' if paid

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f3f4f6] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Success Banner */}
        <div className="bg-[#11131a] border border-white/10 rounded-2xl p-8 sm:p-10 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">
              Payment & Reservation Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Thank You, {order.customerName}!
            </h1>
            <p className="text-xs sm:text-sm text-white/60 max-w-lg mx-auto leading-relaxed">
              Your order <strong className="text-white font-mono">{order.orderNumber}</strong> has been
              received. A confirmation receipt and live tracking link have been dispatched to{' '}
              <strong className="text-white">{order.customerEmail}</strong>.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs font-mono text-white/50">
            <span>Reference: {order.paymentReference}</span>
            <span>·</span>
            <span>Estimated Delivery: {order.estimatedDelivery}</span>
            <span>·</span>
            <span className="text-emerald-400 font-bold">2-Year Direct Warranty Active</span>
          </div>
        </div>

        {/* Live Fulfillment Timeline */}
        <div className="bg-[#11131a] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
            Fulfillment Journey
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative">
            {steps.map((step, idx) => {
              const isCompleted = idx <= activeIndex;
              const isCurrent = idx === activeIndex;

              return (
                <div key={step.status} className="space-y-2 text-center md:text-left">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all mx-auto md:mx-0 ${
                      isCompleted
                        ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                        : 'bg-white/5 text-white/30 border border-white/10'
                    }`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <div>
                    <p
                      className={`text-xs font-semibold ${
                        isCurrent ? 'text-amber-400' : isCompleted ? 'text-white' : 'text-white/40'
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-[10px] text-white/40 leading-tight">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details & Items Receipt */}
        <div className="bg-[#11131a] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div>
              <h3 className="text-sm font-semibold text-white">Itemized Hardware Receipt</h3>
              <p className="text-xs text-white/40">Ghana Tax & Warranty Certificate Attached</p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
          </div>

          <div className="divide-y divide-white/5">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-12 h-12 rounded-lg object-cover bg-black"
                  />
                  <div>
                    <p className="font-semibold text-white">{item.productName}</p>
                    <p className="text-[11px] text-white/40">
                      {item.variantName ? `Edition: ${item.variantName} · ` : ''}SKU: {item.sku}
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-white/40 block">Qty: {item.quantity}</span>
                  <span className="text-white font-semibold">GH₵ {item.totalGHS.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="space-y-2 pt-4 border-t border-white/10 text-xs">
            <div className="flex justify-between text-white/60">
              <span>Subtotal</span>
              <span className="font-mono text-white">GH₵ {order.subtotalGHS.toLocaleString()}</span>
            </div>
            {order.discountGHS > 0 && (
              <div className="flex justify-between text-amber-400">
                <span>Voucher Discount</span>
                <span className="font-mono">- GH₵ {order.discountGHS.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-white/60">
              <span>Delivery Fee ({order.deliveryZone})</span>
              <span className="font-mono text-white">
                {order.shippingFeeGHS === 0 ? 'FREE' : `GH₵ ${order.shippingFeeGHS}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
              <span>Total Paid</span>
              <span className="font-mono text-amber-400 text-lg">
                GH₵ {order.totalGHS.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/5 text-xs text-white/70">
            <div>
              <span className="font-semibold text-white block mb-1">Delivery Destination:</span>
              <p>{order.shippingAddress.streetAddress}</p>
              {order.shippingAddress.landmark && <p>Near: {order.shippingAddress.landmark}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.region}
              </p>
              {order.shippingAddress.ghanaPostGps && (
                <p className="font-mono text-[11px] text-amber-400">
                  GPS: {order.shippingAddress.ghanaPostGps}
                </p>
              )}
            </div>

            <div>
              <span className="font-semibold text-white block mb-1">Recipient & Payment:</span>
              <p>{order.customerName}</p>
              <p className="font-mono">{order.customerPhone}</p>
              <p className="capitalize">Method: {order.paymentMethod.replace('_', ' ')}</p>
              <p className="text-emerald-400 font-mono">Status: Paid & Verified</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>

          <button
            onClick={() => onNavigate('tracking')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-black font-semibold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/10 cursor-pointer"
          >
            <span>Track Order Delivery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
