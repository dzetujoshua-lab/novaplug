import React, { useState } from 'react';
import { Product, ProductVariant, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductsContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';
import {
  ShieldCheck,
  Heart,
  Plus,
  Minus,
  Check,
  Truck,
  Award,
  Star,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  Maximize2,
  X,
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  onNavigate: (route: string, param?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onNavigate,
  onSelectProduct,
}) => {
  const { addToCart, setIsCartOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { getProductReviews, addReview, products } = useProducts();
  const { user } = useAuth();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState(user?.displayName || '');

  const inWishlist = isInWishlist(product.id);
  const reviews = getProductReviews(product.id);

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.imageUrl];
  const activeImage = images[activeImageIndex] || product.imageUrl;

  const currentPriceGHS = product.priceGHS + (selectedVariant?.priceDeltaGHS || 0);

  const handleAddToCart = () => {
    const success = addToCart(product, selectedVariant, quantity);
    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    onNavigate('checkout');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    await addReview({
      productId: product.id,
      authorName: reviewerName.trim() || 'Verified Customer',
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      isVerifiedPurchase: true,
      userId: user?.uid,
    });

    setIsReviewModalOpen(false);
    setReviewTitle('');
    setReviewComment('');
  };

  // Related products from same category or featured
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isFeatured))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f3f4f6] pb-24">
      {/* Breadcrumbs */}
      <div className="border-b border-white/5 bg-[#090a0f] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-white/50 font-mono flex items-center gap-2">
          <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate('products', product.category)}
            className="hover:text-white transition-colors uppercase"
          >
            {product.category}
          </button>
          <span>/</span>
          <span className="text-white truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main PDP Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Gallery Column (Sticky left on desktop) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#11131a] border border-white/10 group">
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center cursor-zoom-in"
                onClick={() => setIsZoomOpen(true)}
              />

              <button
                onClick={() => setIsZoomOpen(true)}
                className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-black/60 text-white/80 hover:text-white backdrop-blur-md transition-colors"
                aria-label="Expand image"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail switcher */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden bg-[#11131a] border transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-amber-400 ring-2 ring-amber-400/20'
                        : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Contiguous Purchase Module Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2 border-b border-white/10 pb-6">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-white/50">
                <span>{product.category}</span>
                <span>·</span>
                <span>SKU: {selectedVariant?.sku || product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                {product.tagline}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <div className="flex text-amber-400">
                  {'★'.repeat(Math.round(product.rating))}
                </div>
                <span className="font-mono font-bold text-white">{product.rating}</span>
                <span className="text-white/40">({product.reviewCount} verified reviews)</span>
              </div>
            </div>

            {/* Price Block */}
            <div className="space-y-1">
              <span className="text-xs text-white/40 font-mono uppercase">Price in Ghana Cedis</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold font-mono text-white tracking-tight tabular-nums">
                  GH₵ {currentPriceGHS.toLocaleString()}
                </span>
                {product.originalPriceGHS && (
                  <span className="text-sm font-mono text-white/40 line-through tabular-nums">
                    GH₵ {product.originalPriceGHS.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-400 font-medium">
                Inclusive of all Ghanaian taxes & direct 2-year warranty
              </p>
            </div>

            {/* Variant Selector */}
            {product.variants.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60 font-medium">Select Edition / Color:</span>
                  <span className="font-semibold text-white">{selectedVariant?.name}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                        selectedVariant?.id === v.id
                          ? 'border-amber-400 bg-amber-400/10 text-white shadow-sm'
                          : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <span>{v.name}</span>
                      {v.priceDeltaGHS > 0 && (
                        <span className="font-mono text-amber-400">+GH₵ {v.priceDeltaGHS}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Availability */}
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  product.stockQuantity > 5 ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-white/80 font-medium">
                {product.stockQuantity > 5
                  ? `In Stock (${product.stockQuantity} units available at Accra hub)`
                  : `Only ${product.stockQuantity} units left in stock`}
              </span>
            </div>

            {/* Quantity Stepper & Add to Cart */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-white/15 rounded-xl bg-white/5 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-white/60 hover:text-white"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-mono text-sm font-semibold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                    className="p-2 text-white/60 hover:text-white"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-3.5 px-6 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    justAdded
                      ? 'bg-emerald-500 text-black'
                      : 'bg-amber-400 text-black hover:bg-amber-300 shadow-lg shadow-amber-400/15'
                  } disabled:opacity-40`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <span>Add to Cart</span>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-colors ${
                    inWishlist ? 'text-red-500 border-red-500/30' : 'text-white/70'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500' : ''}`} />
                </button>
              </div>

              {/* Buy Now instant action */}
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs uppercase tracking-wider border border-white/15 transition-all"
              >
                Instant Buy with Mobile Money or Card
              </button>
            </div>

            {/* Trust Reassurances */}
            <div className="p-4 rounded-xl bg-[#11131a] border border-white/5 space-y-2.5 text-xs text-white/60">
              <div className="flex items-center gap-2.5 text-white/80">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Same-day delivery in Greater Accra · 24h showroom pickup</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/80">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>2-Year Direct Replacement Warranty with local Accra lab</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/80">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cryptographic authenticity serial verification on box</span>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Product Breakdown Sections (Apple-inspired storytelling) */}
        <div className="mt-24 space-y-20">
          {/* 1. Deep Product Introduction */}
          <div className="bg-[#11131a] border border-white/10 rounded-2xl p-8 md:p-12 space-y-6">
            <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">
              Design Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Why We Engineered {product.name}
            </h2>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-4xl">
              {product.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
              {product.highlightFeatures.map((feat, i) => (
                <div key={i} className="space-y-2">
                  <h4 className="text-sm font-semibold text-white">{feat.title}</h4>
                  <p className="text-xs text-white/50 leading-relaxed">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Technical Specifications */}
          <div className="space-y-6">
            <div>
              <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">
                Precision Metrics
              </span>
              <h3 className="text-2xl font-display font-bold text-white mt-1">
                Technical Specifications
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#11131a] overflow-hidden divide-y divide-white/5">
              {Object.entries(product.specs).map(([specKey, specVal]) => (
                <div
                  key={specKey}
                  className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 text-xs hover:bg-white/[0.01]"
                >
                  <span className="font-medium text-white/50">{specKey}</span>
                  <span className="sm:col-span-2 font-mono text-white/90 font-medium">
                    {specVal}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. What's in the Box */}
          <div className="space-y-6">
            <div>
              <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">
                Unboxing Experience
              </span>
              <h3 className="text-2xl font-display font-bold text-white mt-1">
                What's Included in the Packaging
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {product.inTheBox.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-4 rounded-xl bg-[#11131a] border border-white/5 text-xs text-white/80"
                >
                  <Package className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Verified Customer Reviews & Review Modal */}
          <div className="space-y-6 border-t border-white/10 pt-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">
                  Real Feedback
                </span>
                <h3 className="text-2xl font-display font-bold text-white mt-1">
                  Customer Reviews ({reviews.length})
                </h3>
              </div>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors"
              >
                Write a Verified Review
              </button>
            </div>

            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-6 rounded-2xl bg-[#11131a] border border-white/5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-400 text-xs">
                        {'★'.repeat(rev.rating)}
                      </div>
                      <span className="font-mono text-[11px] text-white/40">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-white">{rev.title}</h4>
                    <p className="text-xs text-white/60 leading-relaxed">{rev.comment}</p>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-white/40 border-t border-white/5">
                      <span className="text-white/80 font-medium">{rev.authorName}</span>
                      <span className="text-emerald-400 font-mono">✓ Verified Owner</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-[#11131a] border border-white/5 text-center text-xs text-white/50">
                Be the first to leave a review for this newly released hardware batch.
              </div>
            )}
          </div>

          {/* 5. Deterministic Recommendations */}
          {relatedProducts.length > 0 && (
            <div className="space-y-6 border-t border-white/10 pt-16">
              <div>
                <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">
                  Frequently Paired With
                </span>
                <h3 className="text-2xl font-display font-bold text-white mt-1">
                  You May Also Like
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelectProduct={(target) => {
                      onSelectProduct(target);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full-Screen Zoom Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeImage}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
          />
        </div>
      )}

      {/* Submit Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#14161f] border border-white/15 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Review {product.name}</h3>
                <p className="text-xs text-white/50">Share your acoustic or charging experience</p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Rating Select */}
              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setReviewRating(num)}
                      className={`text-xl ${
                        num <= reviewRating ? 'text-amber-400' : 'text-white/20'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kwame Mensah"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Review Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Incredible ANC in traffic"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium">Detailed Review</label>
                <textarea
                  rows={4}
                  placeholder="Describe your day-to-day impressions, battery life, soundstage, build..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-black font-semibold text-xs uppercase"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
