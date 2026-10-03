import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { Product } from '../types';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  X,
  Menu,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface HeaderProps {
  onNavigate: (route: string, param?: string) => void;
  activeRoute: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, activeRoute }) => {
  const { itemCount, totalGHS, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAdmin, signInWithGoogle, signOut } = useAuth();
  const { products } = useProducts();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when modal opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Filter products for search
  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectSearchResult = (product: Product) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    onNavigate('product', product.slug);
  };

  const navLinks = [
    { label: 'All Products', route: 'products', param: 'all' },
    { label: 'Audio', route: 'products', param: 'audio' },
    { label: 'Power & GaN', route: 'products', param: 'power' },
    { label: 'Creator Studio', route: 'products', param: 'creator' },
    { label: 'Verify Authenticity', route: 'verify' },
    { label: 'Showroom', route: 'showroom' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="relative z-50 bg-[#07080b] border-b border-white/5 py-2 px-4 text-center text-xs text-white/70">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden sm:inline font-mono text-[11px] text-amber-400">
            GHANA FLAGSHIP · ACCRA AIRPORT CITY
          </span>
          <div className="mx-auto flex items-center gap-2 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Official 2-Year Direct Warranty on all devices · Same-day delivery in Greater Accra</span>
          </div>
          <button
            onClick={() => onNavigate('verify')}
            className="hidden md:inline-flex items-center gap-1 font-mono text-[11px] text-white/50 hover:text-white transition-colors"
          >
            <span>Digital Passport Check</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Navigation Bar (Strict 3-zone contract) */}
      <header className="sticky top-0 z-40 w-full bg-[#0b0c10]/95 backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white/70 hover:text-white rounded-lg focus-visible:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="group flex items-center gap-2 cursor-pointer focus-visible:outline-none"
            >
              <span className="font-display text-2xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors uppercase">
                NOVAPLUG
              </span>
            </button>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => onNavigate(item.route, item.param)}
                className={`relative py-1 text-sm font-medium transition-colors hover:text-white whitespace-nowrap ${
                  activeRoute === item.route || (activeRoute === 'products' && item.param && item.param !== 'all')
                    ? 'text-white'
                    : 'text-white/60'
                }`}
              >
                {item.label}
                {activeRoute === item.route && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1-2 primary actions (Search, Wishlist, Cart, Profile) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search catalogue"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all text-xs"
            >
              <Search className="w-4 h-4 text-white/70" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden md:inline-block font-mono text-[10px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                ⌘K
              </kbd>
            </button>

            {/* Wishlist Link */}
            <button
              onClick={() => onNavigate('wishlist')}
              aria-label="View Wishlist"
              className="relative p-2 text-white/70 hover:text-white transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-black font-mono">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* User Account / Auth */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2 text-white/70 hover:text-white transition-colors rounded-full"
                aria-label="Account options"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Account'}
                    className="w-6 h-6 rounded-full border border-white/20"
                  />
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-[#14161f] border border-white/10 p-2 shadow-2xl z-50 text-xs"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-3 py-2 border-b border-white/5 mb-1">
                        <p className="font-semibold text-white truncate">{user.displayName || 'Customer'}</p>
                        <p className="text-white/40 truncate font-mono text-[11px]">{user.email}</p>
                      </div>
                      <button
                        onClick={() => onNavigate('account')}
                        className="w-full text-left px-3 py-2 rounded-lg text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        My Account & Orders
                      </button>
                      <button
                        onClick={() => onNavigate('wishlist')}
                        className="w-full text-left px-3 py-2 rounded-lg text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        Saved Wishlist ({wishlist.length})
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => onNavigate('admin')}
                          className="w-full text-left px-3 py-2 rounded-lg text-amber-400 hover:bg-amber-400/10 font-medium transition-colors"
                        >
                          Enterprise Admin Portal
                        </button>
                      )}
                      <button
                        onClick={signOut}
                        className="w-full text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors mt-1"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="p-2 space-y-2">
                      <p className="text-white/60 text-[11px] leading-relaxed">
                        Sign in for swift checkout, order tracking, and warranty passport linkage.
                      </p>
                      <button
                        onClick={signInWithGoogle}
                        className="w-full py-2 px-3 rounded-lg bg-white text-black font-semibold hover:bg-amber-400 transition-colors"
                      >
                        Sign in with Google
                      </button>
                      <button
                        onClick={() => onNavigate('admin')}
                        className="w-full text-center py-1.5 text-white/40 hover:text-white text-[11px] transition-colors"
                      >
                        Admin Portal Access
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="View Shopping Cart"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-amber-400 text-black hover:bg-amber-300 font-semibold text-xs transition-all shadow-sm"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-black text-[9px] font-mono font-bold text-amber-400">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-mono">
                {totalGHS > 0 ? `GH₵ ${totalGHS.toLocaleString()}` : 'Cart'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-md flex flex-col">
          <div className="p-4 flex items-center justify-between border-b border-white/10 bg-[#0b0c10]">
            <span className="font-display text-xl font-bold tracking-tight text-white uppercase">
              NOVAPLUG
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-white/70 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0b0c10]">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate(item.route, item.param);
                }}
                className="w-full text-left py-3 text-lg font-semibold text-white/90 border-b border-white/5 hover:text-amber-400 transition-colors"
              >
                {item.label}
              </button>
            ))}

            <div className="pt-6 space-y-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('account');
                }}
                className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-left flex items-center justify-between"
              >
                <span>Orders & Account</span>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('admin');
                }}
                className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-amber-400 font-medium text-left flex items-center justify-between"
              >
                <span>Enterprise Admin Portal</span>
                <ExternalLink className="w-4 h-4 text-amber-400/60" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Omnipresent Live Search Modal */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center pt-16 md:pt-24 p-4"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-[#11131a] border border-white/15 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input Bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-[#0c0d12]">
              <Search className="w-5 h-5 text-amber-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products by model, technology, ANC, GaN, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-white/40 text-base focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-xs text-white/40 hover:text-white font-mono px-2 py-1 bg-white/5 rounded"
              >
                ESC
              </button>
            </div>

            {/* Results or Suggested */}
            <div className="max-h-[60vh] overflow-y-auto p-4">
              {searchQuery.trim() ? (
                filteredProducts.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-[11px] font-mono text-white/40 uppercase tracking-wider px-2">
                      Products Found ({filteredProducts.length})
                    </p>
                    {filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectSearchResult(p)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-cover bg-black"
                          />
                          <div>
                            <p className="text-sm font-semibold text-white">{p.name}</p>
                            <p className="text-xs text-white/50">{p.tagline}</p>
                          </div>
                        </div>
                        <span className="font-mono text-sm font-bold text-amber-400">
                          GH₵ {p.priceGHS.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-white/50 space-y-2">
                    <p className="text-sm">No products matched "{searchQuery}"</p>
                    <p className="text-xs text-white/30">
                      Try searching for "headphones", "power", "microphone", or "25000"
                    </p>
                  </div>
                )
              ) : (
                <div className="space-y-4 py-2">
                  <p className="text-[11px] font-mono text-white/40 uppercase tracking-wider px-2">
                    Suggested Searches
                  </p>
                  <div className="flex flex-wrap gap-2 px-2">
                    {[
                      'NovaPulse Pro ANC',
                      '140W GaN MagStack',
                      'Dual Studio Mic',
                      'Kevlar Armored Cable',
                      'Airport City Showroom',
                      'Genuine Passport Code',
                    ].map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 hover:text-white transition-colors font-medium border border-white/5"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
