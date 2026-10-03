import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

interface CartDrawerProps {
  onNavigate: (route: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    items,
    itemCount,
    subtotalGHS,
    discountGHS,
    totalGHS,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold,
    freeShippingProgress,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponFeedback(res);
    if (res.success) {
      setCouponCode('');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    onNavigate('checkout');
  };

  const handleViewCartClick = () => {
    setIsCartOpen(false);
    onNavigate('cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-[#0e1017] border-l border-white/10 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#0b0c10]">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">Your Cart</h2>
              <span className="font-mono text-xs text-white/50 bg-white/5 px-2 py-0.5 rounded">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-white/50 hover:text-white rounded-lg transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-6 py-3 bg-[#13151f] border-b border-white/5 text-xs">
            <div className="flex items-center justify-between mb-1.5 text-[11px]">
              {subtotalGHS >= freeShippingThreshold ? (
                <span className="text-emerald-400 font-medium">
                  ✓ Qualified for Free Standard Delivery in Ghana
                </span>
              ) : (
                <span className="text-white/70">
                  Add <strong className="text-amber-400 font-mono">GH₵ {(freeShippingThreshold - subtotalGHS).toLocaleString()}</strong> more for Free Delivery
                </span>
              )}
              <span className="font-mono text-white/40">{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/30">
                  <Tag className="w-7 h-7" />
                </div>
                <h3 className="text-base font-semibold text-white">Your cart is empty</h3>
                <p className="text-xs text-white/50 max-w-xs leading-relaxed">
                  Explore our curated audio, resilient power stations, and creator tools.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate('products');
                  }}
                  className="mt-2 px-5 py-2.5 rounded-lg bg-amber-400 text-black text-xs font-semibold hover:bg-amber-300 transition-colors"
                >
                  Explore Catalogue
                </button>
              </div>
            ) : (
              items.map((item) => {
                const unitPrice = item.product.priceGHS + (item.selectedVariant?.priceDeltaGHS || 0);
                const itemTotal = unitPrice * item.quantity;

                return (
                  <div
                    key={`${item.product.id}-${item.selectedVariant?.id || 'def'}`}
                    className="flex gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 relative group"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-18 h-18 rounded-lg object-cover bg-black shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-semibold text-white leading-tight line-clamp-1">
                          {item.product.name}
                        </h4>
                        {item.selectedVariant && (
                          <p className="text-[11px] text-white/40 mt-0.5">
                            Edition: {item.selectedVariant.name}
                          </p>
                        )}
                        <p className="text-xs font-mono font-medium text-amber-400 mt-1">
                          GH₵ {unitPrice.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-white/10 rounded-lg bg-white/5">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.id)
                            }
                            className="p-1 text-white/60 hover:text-white"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center font-mono text-xs font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.id)
                            }
                            disabled={item.quantity >= item.product.stockQuantity}
                            className="p-1 text-white/60 hover:text-white disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Line Total & Remove */}
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-white/80 font-semibold">
                            GH₵ {itemTotal.toLocaleString()}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedVariant?.id)}
                            className="text-white/30 hover:text-rose-400 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer with Totals and Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#0b0c10] space-y-4">
              {/* Promo code form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-mono font-medium text-amber-300">
                      {appliedCoupon.code} applied (-GH₵ {discountGHS.toLocaleString()})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-white/40 hover:text-white text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. ACCRA10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400 font-mono uppercase"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponFeedback && (
                <p
                  className={`text-[11px] ${
                    couponFeedback.success ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {couponFeedback.message}
                </p>
              )}

              {/* Price summary */}
              <div className="space-y-1.5 text-xs pt-1 border-t border-white/5">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">GH₵ {subtotalGHS.toLocaleString()}</span>
                </div>
                {discountGHS > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Voucher Discount</span>
                    <span className="font-mono">- GH₵ {discountGHS.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/60">
                  <span>Estimated Delivery</span>
                  <span className="text-white/40">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-white pt-2 border-t border-white/10">
                  <span>Estimated Total</span>
                  <span className="font-mono text-amber-400 text-base">
                    GH₵ {totalGHS.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-400 text-black font-semibold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/10 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleViewCartClick}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 text-white/80 hover:text-white hover:bg-white/10 font-medium text-xs text-center transition-colors"
                >
                  View Full Cart & Shipping Calculator
                </button>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-white/40">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypted Paystack & MTN MoMo Verified Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
