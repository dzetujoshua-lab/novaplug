import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { Order } from '../types';
import { User, Package, Heart, Shield, LogOut, ExternalLink, Calendar, MapPin, Phone } from 'lucide-react';

interface AccountPageProps {
  onNavigate: (route: string, param?: string) => void;
  onSelectOrder?: (order: Order) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate, onSelectOrder }) => {
  const { user, isAdmin, signInWithGoogle, signOut } = useAuth();
  const { wishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'support'>('orders');

  // Load orders for current user or guest
  const orders: Order[] = JSON.parse(localStorage.getItem('novaplug_orders') || '[]');
  const userOrders = user
    ? orders.filter((o) => o.userId === user.uid || o.customerEmail === user.email)
    : orders;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0b0c10] text-[#f3f4f6] py-16 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#11131a] border border-white/10 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-display font-bold text-white">Client Portal</h2>
            <p className="text-xs text-white/50 leading-relaxed">
              Sign in with your Google account to track orders, manage digital product warranties, and view your hardware registry.
            </p>
          </div>

          <button
            onClick={signInWithGoogle}
            className="w-full py-3.5 px-4 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-lg cursor-pointer"
          >
            Sign in with Google
          </button>

          <div className="pt-2 border-t border-white/5">
            <p className="text-[11px] text-white/40">
              Placed an order as a guest? You can still{' '}
              <button
                onClick={() => onNavigate('tracking')}
                className="text-amber-400 underline font-medium"
              >
                Track Your Delivery Here
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f3f4f6] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Profile Summary */}
        <div className="bg-[#11131a] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-16 h-16 rounded-full border-2 border-amber-400/30 object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-bold text-xl font-mono">
                {user.displayName?.charAt(0) || 'U'}
              </div>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{user.displayName || 'NovaPlug Member'}</h1>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-400 text-black font-bold">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-xs text-white/50 font-mono">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="px-4 py-2 rounded-xl bg-amber-400 text-black text-xs font-semibold hover:bg-amber-300 transition-colors"
              >
                Admin Portal
              </button>
            )}
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-white/10 pb-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'orders'
                ? 'bg-amber-400 text-black font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Orders & Tracking ({userOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'profile'
                ? 'bg-amber-400 text-black font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Registered Profile
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'support'
                ? 'bg-amber-400 text-black font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Warranty Concierge
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {userOrders.length > 0 ? (
              userOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#11131a] border border-white/10 rounded-2xl p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {order.orderNumber}
                      </span>
                      <p className="text-[11px] text-white/40">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs px-2.5 py-1 rounded bg-white/5 text-emerald-400 uppercase font-semibold">
                        Status: {order.status}
                      </span>
                      <span className="font-mono text-sm font-bold text-white">
                        GH₵ {order.totalGHS.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-white/5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-10 h-10 rounded-lg object-cover bg-black"
                          />
                          <div>
                            <p className="font-semibold text-white">{item.productName}</p>
                            <p className="text-[11px] text-white/40">
                              Qty: {item.quantity} · {item.variantName || 'Standard'}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono text-white/80">
                          GH₵ {item.totalGHS.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery summary */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-white/5 text-xs text-white/50 gap-2">
                    <span>
                      Destination: {order.shippingAddress.streetAddress}, {order.shippingAddress.city}
                    </span>
                    <button
                      onClick={() => onNavigate('order-confirmation', order.id)}
                      className="text-amber-400 hover:text-amber-300 font-medium"
                    >
                      View Receipt & Timeline →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center bg-[#11131a] rounded-2xl border border-white/10 space-y-3">
                <Package className="w-10 h-10 text-white/30 mx-auto" />
                <h3 className="text-base font-semibold text-white">No Orders on Record Yet</h3>
                <p className="text-xs text-white/50">
                  Ready to experience studio audio or ultra-fast GaN charging?
                </p>
                <button
                  onClick={() => onNavigate('products')}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 text-black text-xs font-semibold uppercase tracking-wider"
                >
                  Explore Catalogue
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-[#11131a] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 max-w-2xl">
            <h3 className="text-base font-semibold text-white">Account Information</h3>
            <div className="space-y-4 text-xs">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-white/50">Full Name</span>
                <span className="font-semibold text-white">{user.displayName || 'Client'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-white/50">Email Address</span>
                <span className="font-mono text-white">{user.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-white/50">Auth Provider</span>
                <span className="text-white">Google OAuth (256-bit Secure)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-white/50">Saved Wishlist Items</span>
                <span className="font-mono text-amber-400">{wishlist.length} saved</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="bg-[#11131a] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 max-w-2xl">
            <h3 className="text-base font-semibold text-white">2-Year Direct Warranty Support</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Every genuine NovaPlug hardware unit purchased from this website or our Airport City showroom includes a direct 24-month hardware replacement warranty.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Accra Showroom Concierge</span>
                  <span className="text-white/50">One Airport Square, Airport City, Accra</span>
                </div>
                <button
                  onClick={() => onNavigate('showroom')}
                  className="text-amber-400 font-semibold"
                >
                  Directions →
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Digital Authenticity Verification</span>
                  <span className="text-white/50">Check any hardware code instantly</span>
                </div>
                <button
                  onClick={() => onNavigate('verify')}
                  className="text-amber-400 font-semibold"
                >
                  Verify Now →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
