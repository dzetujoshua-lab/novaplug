import React, { useState, useMemo } from 'react';
import { useProducts } from '../context/ProductsContext';
import { ProductCard } from '../components/ProductCard';
import { Product, ProductCategory } from '../types';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search, Check } from 'lucide-react';

interface ProductListPageProps {
  initialCategory?: string;
  onSelectProduct: (product: Product) => void;
  onNavigate: (route: string, param?: string) => void;
}

export const ProductListPage: React.FC<ProductListPageProps> = ({
  initialCategory = 'all',
  onSelectProduct,
  onNavigate,
}) => {
  const { products } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [searchFilter, setSearchFilter] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const categories: { label: string; value: string }[] = [
    { label: 'All Hardware', value: 'all' },
    { label: 'Audio & ANC', value: 'audio' },
    { label: 'Power & GaN', value: 'power' },
    { label: 'Creator Studio', value: 'creator' },
    { label: 'Cables & Accessories', value: 'accessories' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category check
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Price check
      if (p.priceGHS > maxPrice) {
        return false;
      }
      // Stock check
      if (inStockOnly && !p.inStock) {
        return false;
      }
      // Search term
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesTagline = p.tagline.toLowerCase().includes(query);
        const matchesSku = p.sku.toLowerCase().includes(query);
        if (!matchesName && !matchesTagline && !matchesSku) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceGHS - b.priceGHS;
      if (sortBy === 'price-desc') return b.priceGHS - a.priceGHS;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, maxPrice, inStockOnly, sortBy, searchFilter]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setMaxPrice(3000);
    setInStockOnly(false);
    setSearchFilter('');
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f3f4f6] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-white/40 font-mono uppercase mb-1">
              <span>Home</span>
              <span>/</span>
              <span className="text-amber-400">Catalogue</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Hardware Catalogue
            </h1>
            <p className="text-xs sm:text-sm text-white/50 mt-1">
              Explore authentic NovaPlug audio, high-output GaN power, and broadcast creator tools.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-white/50 font-mono">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'device' : 'devices'}
            </span>

            {/* Mobile Filters Toggle Button */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 text-white text-xs font-medium"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 bg-[#0f1118] border border-white/10 rounded-2xl p-6 h-fit sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span>Filters</span>
              </span>
              <button
                onClick={resetFilters}
                className="text-[11px] text-white/40 hover:text-white transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Search filter input */}
            <div className="space-y-2">
              <label className="text-xs text-white/60 font-medium">Search Keyword</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter by name..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs text-white/60 font-medium">Hardware Class</label>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === cat.value
                        ? 'bg-amber-400 text-black font-semibold'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.value && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/60 font-medium">Max Price</span>
                <span className="font-mono text-amber-400 font-semibold">
                  GH₵ {maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-white/40">
                <span>GH₵ 200</span>
                <span>GH₵ 3,000+</span>
              </div>
            </div>

            {/* Stock Availability */}
            <div className="pt-2 border-t border-white/5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-amber-400 focus:ring-0 accent-amber-400"
                />
                <span>In-Stock Items Only</span>
              </label>
            </div>
          </aside>

          {/* Main Catalogue Area */}
          <main className="lg:col-span-3 space-y-6">
            {/* Top Sort Bar */}
            <div className="flex items-center justify-between bg-[#11131a] border border-white/10 rounded-xl p-3 text-xs">
              <div className="flex items-center gap-2 text-white/60">
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
                <span>Sort by:</span>
              </div>

              <div className="flex items-center gap-1">
                {[
                  { label: 'Featured', value: 'featured' },
                  { label: 'Price: Low → High', value: 'price-asc' },
                  { label: 'Price: High → Low', value: 'price-desc' },
                  { label: 'Rating', value: 'rating' },
                ].map((sortOption) => (
                  <button
                    key={sortOption.value}
                    onClick={() => setSortBy(sortOption.value as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      sortBy === sortOption.value
                        ? 'bg-white/20 text-white font-semibold'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {sortOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelectProduct={(p) => onSelectProduct(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-[#11131a] rounded-2xl border border-white/10 space-y-3">
                <p className="text-base font-semibold text-white">No products found matching filters</p>
                <p className="text-xs text-white/50 max-w-sm mx-auto">
                  Try adjusting the maximum price or resetting the selected hardware category.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-2 px-4 py-2 rounded-lg bg-amber-400 text-black text-xs font-semibold hover:bg-amber-300"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col lg:hidden">
          <div className="p-4 flex items-center justify-between border-b border-white/10 bg-[#0b0c10]">
            <h3 className="text-base font-semibold text-white">Filters & Sorting</h3>
            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="p-1 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#0b0c10]">
            <div className="space-y-2">
              <label className="text-xs text-white/60 font-medium">Category</label>
              <div className="grid grid-cols-1 gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === cat.value
                        ? 'bg-amber-400 text-black font-semibold'
                        : 'text-white/70 bg-white/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-white/60 font-medium">
                Max Price: GH₵ {maxPrice.toLocaleString()}
              </label>
              <input
                type="range"
                min="200"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-amber-400 accent-amber-400"
                />
                <span>In-Stock Only</span>
              </label>
            </div>

            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="w-full py-3 rounded-xl bg-amber-400 text-black font-semibold text-xs uppercase"
            >
              Apply Filters ({filteredProducts.length} Results)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
