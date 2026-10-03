import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PaymentMethod, ShippingAddress, Order } from '../types';
import { SHIPPING_ZONES } from '../data/initialData';
import { ShieldCheck, Lock, CreditCard, Smartphone, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (route: string, param?: string) => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate, onOrderSuccess }) => {
  const {
    items,
    itemCount,
    subtotalGHS,
    discountGHS,
    shippingFeeGHS,
    totalGHS,
    selectedZone,
    setSelectedZone,
    shippingMethod,
    setShippingMethod,
    createOrder,
  } = useCart();

  const { user } = useAuth();

  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phoneNumber: '',
    streetAddress: '',
    landmark: '',
    city: 'Accra',
    region: 'Greater Accra',
    ghanaPostGps: '',
  });

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('momo_mtn');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Payment mock prompt status (simulating realistic MoMo or Paystack authorization)
  const [paymentStep, setPaymentStep] = useState<'form' | 'authorizing'>('form');

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0b0c10] text-[#f3f4f6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#11131a] border border-white/10 rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-xl font-display font-bold text-white">Your Cart is Empty</h2>
          <p className="text-xs text-white/50">Add products before proceeding to checkout.</p>
          <button
            onClick={() => onNavigate('products')}
            className="w-full py-3 rounded-xl bg-amber-400 text-black font-semibold text-xs uppercase"
          >
            Go to Catalogue
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phoneNumber.trim()) {
      setErrorMessage('Please provide your full name, email, and mobile number.');
      return;
    }

    if (!formData.streetAddress.trim()) {
      setErrorMessage('Please enter your delivery street address or pickup location.');
      return;
    }

    setIsSubmitting(true);
    setPaymentStep('authorizing');

    // Simulate real gateway prompt latency (e.g. USSD MoMo push or Paystack 3DS prompt)
    setTimeout(async () => {
      try {
        const result = await createOrder(formData, selectedPayment, customerNotes);
        if (result.success && result.order) {
          onOrderSuccess(result.order);
          onNavigate('order-confirmation', result.order.id);
        } else {
          setErrorMessage(result.error || 'Failed to place order. Please try again.');
          setPaymentStep('form');
          setIsSubmitting(false);
        }
      } catch (err) {
        setErrorMessage('An unexpected error occurred during payment verification.');
        setPaymentStep('form');
        setIsSubmitting(false);
      }
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f3f4f6] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('cart')}
              className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white transition-colors"
              aria-label="Return to cart"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                Secure Checkout
              </h1>
              <p className="text-xs text-white/50">
                Official NovaPlug Direct Dispatch · End-to-end Encrypted
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Secured</span>
          </div>
        </div>

        {paymentStep === 'authorizing' ? (
          /* Payment Processing Simulation Overlay */
          <div className="max-w-md mx-auto bg-[#11131a] border border-white/10 rounded-2xl p-10 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto text-amber-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">
                {selectedPayment.startsWith('momo_') ? 'Mobile Money USSD Prompt Sent' : 'Authorizing Card Transaction'}
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                {selectedPayment.startsWith('momo_')
                  ? `Please approve the authorization prompt on ${formData.phoneNumber || 'your handset'} to finalize GH₵ ${totalGHS.toLocaleString()}.`
                  : 'Verifying with 3D Secure Paystack Gateway...'}
              </p>
            </div>

            <div className="font-mono text-[11px] text-white/40 pt-2 border-t border-white/5">
              <span>Recalculating price & reserving hardware units...</span>
            </div>
          </div>
        ) : (
          /* Main Checkout Form */
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Form Column */}
            <div className="lg:col-span-7 space-y-8">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* 1. Customer Contact Info */}
              <div className="bg-[#11131a] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                    01. Contact Information
                  </h3>
                  <span className="text-[11px] text-white/40 font-mono">Guest checkout enabled</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-white/60">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Kwame Mensah"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-white/60">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="kwame@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs text-white/60">
                      Ghanaian Mobile Phone Number (For MoMo & Courier) *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. 024 412 3456 or +233 55 987 6543"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="bg-[#11131a] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                    02. Ghana Delivery Address
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs text-white/60">Street / Area Address *</label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      placeholder="e.g. Plot 14, Kofi Annan Avenue, Airport Residential"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-white/60">Prominent Landmark</label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      placeholder="e.g. Opposite Nyaho Clinic"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-white/60">GhanaPost GPS (Optional)</label>
                    <input
                      type="text"
                      name="ghanaPostGps"
                      value={formData.ghanaPostGps}
                      onChange={handleInputChange}
                      placeholder="e.g. GA-183-4921"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-white/60">City / Town *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-white/60">Region *</label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Greater Accra" className="bg-[#11131a]">Greater Accra</option>
                      <option value="Ashanti" className="bg-[#11131a]">Ashanti (Kumasi)</option>
                      <option value="Western" className="bg-[#11131a]">Western (Takoradi)</option>
                      <option value="Central" className="bg-[#11131a]">Central (Cape Coast)</option>
                      <option value="Eastern" className="bg-[#11131a]">Eastern (Koforidua)</option>
                      <option value="Northern" className="bg-[#11131a]">Northern (Tamale)</option>
                      <option value="Volta" className="bg-[#11131a]">Volta (Ho)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Ghana-First Payment Method */}
              <div className="bg-[#11131a] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                    03. Payment Method (GHS)
                  </h3>
                  <span className="text-[11px] text-emerald-400 font-mono">Zero Processing Surcharges</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* MTN Mobile Money */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedPayment === 'momo_mtn'
                        ? 'border-amber-400 bg-amber-400/10 text-white'
                        : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={selectedPayment === 'momo_mtn'}
                      onChange={() => setSelectedPayment('momo_mtn')}
                      className="mt-1 accent-amber-400"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-semibold text-xs text-white">
                        <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                        <span>MTN Mobile Money</span>
                      </div>
                      <p className="text-[11px] text-white/50">Instant push prompt to your phone</p>
                    </div>
                  </label>

                  {/* Telecel Cash */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedPayment === 'momo_telecel'
                        ? 'border-amber-400 bg-amber-400/10 text-white'
                        : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={selectedPayment === 'momo_telecel'}
                      onChange={() => setSelectedPayment('momo_telecel')}
                      className="mt-1 accent-amber-400"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-semibold text-xs text-white">
                        <Smartphone className="w-3.5 h-3.5 text-red-400" />
                        <span>Telecel Cash (Vodafone)</span>
                      </div>
                      <p className="text-[11px] text-white/50">Prompt or voucher authorization</p>
                    </div>
                  </label>

                  {/* AT Money */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedPayment === 'momo_at'
                        ? 'border-amber-400 bg-amber-400/10 text-white'
                        : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={selectedPayment === 'momo_at'}
                      onChange={() => setSelectedPayment('momo_at')}
                      className="mt-1 accent-amber-400"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-semibold text-xs text-white">
                        <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                        <span>AT Money (AirtelTigo)</span>
                      </div>
                      <p className="text-[11px] text-white/50">Direct mobile wallet deduction</p>
                    </div>
                  </label>

                  {/* Paystack Card (Visa & Mastercard) */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedPayment === 'card_paystack'
                        ? 'border-amber-400 bg-amber-400/10 text-white'
                        : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={selectedPayment === 'card_paystack'}
                      onChange={() => setSelectedPayment('card_paystack')}
                      className="mt-1 accent-amber-400"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-semibold text-xs text-white">
                        <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                        <span>Debit / Credit Card</span>
                      </div>
                      <p className="text-[11px] text-white/50">Visa & Mastercard 3D Secure</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Special Delivery Instructions */}
              <div className="bg-[#11131a] border border-white/10 rounded-2xl p-6 space-y-2">
                <label className="text-xs text-white/60 font-medium">Special Delivery Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Call my security post upon arrival; delivery before 3 PM preferred..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#11131a] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 sticky top-24">
                <h3 className="text-sm font-semibold text-white border-b border-white/5 pb-3">
                  Order Review ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </h3>

                {/* Items preview list */}
                <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
                  {items.map((item) => {
                    const unitPrice = item.product.priceGHS + (item.selectedVariant?.priceDeltaGHS || 0);
                    return (
                      <div
                        key={`${item.product.id}-${item.selectedVariant?.id || 'def'}`}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-black"
                          />
                          <div>
                            <p className="font-semibold text-white line-clamp-1 max-w-[170px]">
                              {item.product.name}
                            </p>
                            <p className="text-[11px] text-white/40">
                              Qty: {item.quantity} · {item.selectedVariant?.name || 'Default'}
                            </p>
                          </div>
                        </div>

                        <span className="font-mono text-white/90 tabular-nums">
                          GH₵ {(unitPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Totals Breakdown */}
                <div className="space-y-2 pt-4 border-t border-white/5 text-xs">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">GH₵ {subtotalGHS.toLocaleString()}</span>
                  </div>

                  {discountGHS > 0 && (
                    <div className="flex justify-between text-amber-400">
                      <span>Voucher Savings</span>
                      <span className="font-mono">- GH₵ {discountGHS.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-white/60">
                    <span>Shipping Fee</span>
                    <span className="font-mono text-white">
                      {shippingFeeGHS === 0 ? 'FREE' : `GH₵ ${shippingFeeGHS}`}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex justify-between items-baseline text-sm font-bold text-white">
                    <span>Final Amount to Pay</span>
                    <span className="text-2xl font-mono text-amber-400">
                      GH₵ {totalGHS.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Confirm & Pay Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-amber-400 text-black font-semibold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Pay GH₵ {totalGHS.toLocaleString()}</span>
                </button>

                <div className="space-y-2 pt-2 border-t border-white/5 text-[11px] text-white/50">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Server-side price verification prevents client tamper</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real-time inventory deduction & digital passport assignment</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
