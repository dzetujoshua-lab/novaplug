import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [justAdded, setJustAdded] = React.useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = addToCart(product, product.variants[0], 1);
    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1600);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      onClick={() => onSelectProduct?.(product)}
      className="group relative flex flex-col bg-[#11131a] rounded-xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/20 hover:-translate-y-1 cursor-pointer"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0c0d12]">
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-md transition-colors hover:bg-black/80 hover:text-white"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              inWishlist ? 'fill-red-500 text-red-500' : 'text-white/80'
            }`}
          />
        </button>

        {/* Stock or Sale indicator (clean text tag, not a candy pill) */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          {product.originalPriceGHS && (
            <span className="text-[11px] font-mono font-medium text-amber-400 bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm">
              Save GH₵ {(product.originalPriceGHS - product.priceGHS).toLocaleString()}
            </span>
          )}
          {!product.inStock && (
            <span className="text-[11px] font-mono font-medium text-rose-400 bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm">
              Back-order Only
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-4 md:p-5">
        {/* Unboxed Metadata with Typographic Separators */}
        <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-wider mb-2 font-mono">
          <span>{product.category}</span>
          <span aria-hidden="true">·</span>
          <span>{product.sku}</span>
          <span aria-hidden="true">·</span>
          <span>★ {product.rating}</span>
        </div>

        {/* Product Title */}
        <h3 className="text-base font-semibold text-white/95 line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
          {product.name}
        </h3>

        {/* Short Tagline */}
        <p className="mt-1.5 text-xs text-white/50 line-clamp-2 leading-relaxed">
          {product.tagline}
        </p>

        {/* Price and Action Bar */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-xs text-white/40">Ghana Cedis</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-white tracking-tight tabular-nums">
                GH₵ {product.priceGHS.toLocaleString()}
              </span>
              {product.originalPriceGHS && (
                <span className="text-xs font-mono text-white/40 line-through tabular-nums">
                  GH₵ {product.originalPriceGHS.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              justAdded
                ? 'bg-emerald-500 text-black font-semibold'
                : 'bg-white/10 text-white hover:bg-amber-400 hover:text-black'
            } disabled:opacity-40 disabled:pointer-events-none`}
            title="Quick add to cart"
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
