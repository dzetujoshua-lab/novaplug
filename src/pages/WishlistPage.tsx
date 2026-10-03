import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

interface WishlistPageProps {
  onNavigate: (route: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigate, onSelectProduct }) => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-[#0b0c10] text-[#f3f4f6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#11131a] border border-white/10 rounded-2xl p-8 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-white/30">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-display font-bold text-white">Your Wishlist is Empty</h2>
          <p className="text-xs text-white/50 leading-relaxed">
            Tap the heart icon on any product to bookmark it for future purchase or showroom comparison.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="w-full py-3 rounded-xl bg-amber-400 text-black font-semibold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors"
          >
            Discover Products
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
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Saved Hardware</h1>
            <p className="text-xs text-white/50 mt-1">
              You have {wishlist.length} {wishlist.length === 1 ? 'device' : 'devices'} bookmarked.
            </p>
          </div>
          <button
            onClick={clearWishlist}
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
          >
            Clear Wishlist
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} onSelectProduct={onSelectProduct} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
