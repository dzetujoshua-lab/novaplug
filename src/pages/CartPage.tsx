import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { SHIPPING_ZONES } from '../data/initialData';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag, ArrowLeft } from 'lucide-react';

interface CartPageProps {
  onNavigate: (route: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const {
    items,
    itemCount,
    subtotalGHS,
    discountGHS,
    shippingFeeGHS,
    totalGHS,
    updateQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    selectedZone,
    setSelectedZone,
    shippingMethod,
    setShippingMethod,
    freeShippingThreshold,
    freeShippingProgress,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ success: boolean; message: string } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMessage(res);
    if (res.success) setCouponCode('');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0b0c10] text-[#f3f4f6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#11131a] border border-white/10 rounded-2xl p-8 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-white/30">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-display font-bold text-white">Your Cart is Currently Empty</h2>
          <p className="text-xs text-white/50 leading-relaxed">
            You haven't selected any NovaPlug hardware yet. Explore our precision noise-cancelling audio, GaN power stations, and creator microphones.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="w-full py-3 rounded-xl bg-amber-400 text-black font-semibold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors"
          >
            Explore Catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f3f4f6] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Shopping Cart</h1>
            <p className="text-xs text-white/50 mt-1">
              Review items, calculate regional Ghana delivery, and proceed to secure checkout.
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Free shipping progress */}
        <div className="p-4 rounded-xl bg-[#11131a] border border-white/10 space-y-2 text-xs">
          <div className="flex justify-between">
            {subtotalGHS >= freeShippingThreshold ? (
              <span className="text-emerald-400 font-semibold">
                ✓ Free Standard Shipping Unlocked for Ghana!
              </span>
            ) : (
              <span className="text-white/70">
                Add <strong className="text-amber-400 font-mono">GH₵ {(freeShippingThreshold - subtotalGHS).toLocaleString()}</strong> more to unlock Free Standard Shipping.
              </span>
            )}
            <span className="font-mono text-white/40">{freeShippingProgress}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${freeShippingProgress}%` }} />
          </div>
        </div>

        {/* 2-Column Cart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List Column */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[#11131a] overflow-hidden divide-y divide-white/5">
              {items.map((item) => {
                const unitPrice = item.product.priceGHS + (item.selectedVariant?.priceDeltaGHS || 0);
                const lineTotal = unitPrice * item.quantity;

                return (
                  <div key={`${item.product.id}-${item.selectedVariant?.id || 'def'}`} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-20 h-20 rounded-xl object-cover bg-black shrink-0"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-white/40 uppercase">
                          {item.product.category} · {item.selectedVariant?.sku || item.product.sku}
                        </span>
                        <h3 className="text-sm font-semibold text-white leading-snug">
                          {item.product.name}
                        </h3>
                        {item.selectedVariant && (
                          <p className="text-xs text-white/50">
                            Edition: {item.selectedVariant.name}
                          </p>
                        )}
                        <p className="text-xs font-mono font-medium text-amber-400">
                          GH₵ {unitPrice.toLocaleString()} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-white/10 rounded-lg bg-white/5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.id)}
                          className="p-1.5 text-white/60 hover:text-white"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-mono text-xs font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.id)}
                          disabled={item.quantity >= item.product.stockQuantity}
                          className="p-1.5 text-white/60 hover:text-white disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right min-w-[90px]">
                        <span className="text-xs font-mono font-bold text-white tabular-nums">
                          GH₵ {lineTotal.toLocaleString()}
                        </span>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedVariant?.id)}
                        className="text-white/30 hover:text-rose-400 p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center px-2 text-xs">
              <button
                onClick={clearCart}
                className="text-rose-400 hover:text-rose-300 transition-colors"
              >
                Clear entire cart
              </button>
              <span className="text-white/40">Prices calculated in Ghana Cedis (GHS)</span>
            </div>
          </div>

          {/* Delivery & Order Summary Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Delivery Zone Selector */}
            <div className="rounded-2xl border border-white/10 bg-[#11131a] p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white">Delivery Zone in Ghana</h3>
              
              <div className="space-y-2">
                <select
                  value={selectedZone.id}
                  onChange={(e) => {
                    const found = SHIPPING_ZONES.find((z) => z.id === e.target.value);
                    if (found) setSelectedZone(found);
                  }}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {SHIPPING_ZONES.map((zone) => (
                    <option key={zone.id} value={zone.id} className="bg-[#11131a] text-white">
                      {zone.name}
                    </option>
                  ))}
                </select>

                <p className="text-[11px] text-white/50">
                  Estimated timeframe: <strong className="text-white">{selectedZone.estimatedDays}</strong>
                </p>
              </div>

              {selectedZone.id !== 'zone-pickup' && (
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <span className="text-xs text-white/60 font-medium block">Delivery Speed:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setShippingMethod('standard')}
                      className={`p-2 rounded-lg border text-left transition-colors ${
                        shippingMethod === 'standard'
                          ? 'border-amber-400 bg-amber-400/10 text-white'
                          : 'border-white/10 bg-white/5 text-white/60'
                      }`}
                    >
                      <span className="font-semibold block">Standard</span>
                      <span className="font-mono text-[10px] text-white/40">
                        {subtotalGHS >= freeShippingThreshold ? 'FREE' : `GH₵ ${selectedZone.standardFeeGHS}`}
                      </span>
                    </button>
                    <button
                      onClick={() => setShippingMethod('express')}
                      className={`p-2 rounded-lg border text-left transition-colors ${
                        shippingMethod === 'express'
                          ? 'border-amber-400 bg-amber-400/10 text-white'
                          : 'border-white/10 bg-white/5 text-white/60'
                      }`}
                    >
                      <span className="font-semibold block">Express</span>
                      <span className="font-mono text-[10px] text-white/40">
                        GH₵ {selectedZone.expressFeeGHS}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Voucher Box */}
            <div className="rounded-2xl border border-white/10 bg-[#11131a] p-6 space-y-3">
              <h3 className="text-sm font-semibold text-white">Promotional Voucher</h3>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-400" />
                    <span className="font-mono font-bold text-amber-300">
                      {appliedCoupon.code} (-GH₵ {discountGHS.toLocaleString()})
                    </span>
                  </div>
                  <button onClick={removeCoupon} className="text-white/40 hover:text-white text-[11px]">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (ACCRA10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono placeholder-white/30 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponMessage && (
                <p className={`text-[11px] ${couponMessage.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {couponMessage.message}
                </p>
              )}
            </div>

            {/* Order Totals Summary */}
            <div className="rounded-2xl border border-white/10 bg-[#11131a] p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white pb-3 border-b border-white/5">
                Order Summary
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-mono text-white">GH₵ {subtotalGHS.toLocaleString()}</span>
                </div>

                {discountGHS > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Discount</span>
                    <span className="font-mono">- GH₵ {discountGHS.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-white/60">
                  <span>Shipping ({selectedZone.name})</span>
                  <span className="font-mono text-white">
                    {shippingFeeGHS === 0 ? 'FREE' : `GH₵ ${shippingFeeGHS}`}
                  </span>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-baseline text-sm font-bold text-white">
                  <span>Total Amount</span>
                  <span className="text-xl font-mono text-amber-400">
                    GH₵ {totalGHS.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('checkout')}
                className="w-full py-4 rounded-xl bg-amber-400 text-black font-semibold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/15 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-white/40">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>MTN Mobile Money & Card Secured via Paystack</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
