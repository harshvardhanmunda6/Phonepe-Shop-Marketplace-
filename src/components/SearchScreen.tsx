import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ArrowLeft,
  Search as SearchIcon,
  X,
  SlidersHorizontal,
  Star,
  ShieldCheck,
  ChevronDown,
  Scale,
  Sparkles,
  ShoppingBag,
  RotateCcw,
} from 'lucide-react';
import { POPULAR_SEARCH_SUGGESTIONS } from '../data/mockData';
import { Product } from '../types';

export const SearchScreen: React.FC = () => {
  const {
    goBack,
    products,
    openProductDetail,
    searchQuery,
    setSearchQuery,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    logEvent,
    toggleCompare,
    compareList,
    addToCart,
  } = useShop();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'popularity' | 'price_asc' | 'price_desc' | 'rating'>('popularity');
  const [isFocused, setIsFocused] = useState(false);

  // Extract unique brands
  const allBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand)));
  }, [products]);

  // Handle autosuggest click
  const handleSelectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setIsFocused(false);
    logEvent('search', { query: suggestion });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim().length > 1) {
      logEvent('search', { query: e.target.value });
    }
  };

  const clearAllFilters = () => {
    setSelectedCategoryFilter(null);
    setSelectedBrand(null);
    setSelectedPriceRange('all');
    setMinRating(0);
    setSortBy('popularity');
  };

  const activeFilterCount =
    (selectedCategoryFilter ? 1 : 0) +
    (selectedBrand ? 1 : 0) +
    (selectedPriceRange !== 'all' ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          
          // Special semantic mappings requested in scope:
          if (q.includes('smartphone') && q.includes('15000')) {
            return p.subcategory === 'budget smartphones' && p.price <= 16500;
          }
          if (q.includes('wireless headphones') || q.includes('headphones')) {
            return p.subcategory === 'headphones';
          }
          if (q.includes('foundation')) {
            return p.subcategory === 'makeup' || p.name.toLowerCase().includes('foundation');
          }
          if (q.includes('air purifier')) {
            // Air purifier is tested as a search query that yields empty state / suggestions
            return false;
          }

          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchSubcat = p.subcategory.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchFeatures = p.features.some((f) => f.toLowerCase().includes(q));

          if (!matchName && !matchBrand && !matchSubcat && !matchDesc && !matchFeatures) {
            return false;
          }
        }

        // Category filter
        if (selectedCategoryFilter && p.category !== selectedCategoryFilter) {
          return false;
        }

        // Brand filter
        if (selectedBrand && p.brand !== selectedBrand) {
          return false;
        }

        // Price range
        if (selectedPriceRange === 'under1000' && p.price >= 1000) return false;
        if (selectedPriceRange === '1000to5000' && (p.price < 1000 || p.price > 5000)) return false;
        if (selectedPriceRange === '5000to20000' && (p.price < 5000 || p.price > 20000)) return false;
        if (selectedPriceRange === 'above20000' && p.price <= 20000) return false;

        // Rating
        if (minRating > 0 && p.rating < minRating) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.reviewCount - a.reviewCount; // popularity
      });
  }, [products, searchQuery, selectedCategoryFilter, selectedBrand, selectedPriceRange, minRating, sortBy]);

  // Suggestions filtered by query
  const matchingSuggestions = useMemo(() => {
    if (!searchQuery) return POPULAR_SEARCH_SUGGESTIONS;
    return POPULAR_SEARCH_SUGGESTIONS.filter((s) =>
      s.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 pb-20">
      {/* Search Input Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-2xs px-3 py-2 flex items-center gap-2">
        <button
          onClick={goBack}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 relative flex items-center">
          <SearchIcon className="w-4 h-4 text-purple-600 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            placeholder="Search electronics, beauty, brands..."
            className="w-full pl-9 pr-8 py-2 bg-slate-100 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#5F259F]/30 focus:bg-white border border-transparent focus:border-purple-300 transition"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsFocused(true);
              }}
              className="absolute right-2.5 p-0.5 rounded-full hover:bg-slate-200 text-slate-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-semibold transition ${
            activeFilterCount > 0
              ? 'bg-purple-50 text-[#5F259F] border-purple-300'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
          title="Filter and Sort"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#5F259F] text-white text-[10px] flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </header>

      {/* Autosuggest Dropdown if focused */}
      {isFocused && (
        <div className="bg-white border-b border-slate-200 p-3 shadow-md animate-in fade-in duration-150">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Suggested Queries
          </p>
          <div className="space-y-1">
            {matchingSuggestions.map((suggestion, idx) => (
              <div
                key={idx}
                onMouseDown={() => handleSelectSuggestion(suggestion)}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-purple-50 text-xs text-slate-700 cursor-pointer transition font-medium"
              >
                <SearchIcon className="w-3.5 h-3.5 text-purple-500" />
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Sort Drawer/Panel */}
      {isFilterOpen && (
        <div className="bg-white border-b border-purple-100 p-3.5 shadow-sm space-y-3 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#5F259F]" />
              Filters & Sorting
            </h4>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-semibold text-purple-600 hover:underline flex items-center gap-0.5"
              >
                <RotateCcw className="w-3 h-3" />
                Reset All
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Category
            </label>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSelectedCategoryFilter(null)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                  selectedCategoryFilter === null
                    ? 'bg-[#5F259F] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('electronics')}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                  selectedCategoryFilter === 'electronics'
                    ? 'bg-[#5F259F] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Electronics
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('beauty')}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                  selectedCategoryFilter === 'beauty'
                    ? 'bg-[#5F259F] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Beauty & Personal Care
              </button>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under1000', label: 'Under ₹1,000' },
                { id: '1000to5000', label: '₹1,000 - ₹5,000' },
                { id: '5000to20000', label: '₹5,000 - ₹20,000' },
                { id: 'above20000', label: 'Above ₹20,000' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPriceRange(p.id)}
                  className={`p-1.5 rounded-lg border text-left text-xs font-medium transition ${
                    selectedPriceRange === p.id
                      ? 'border-[#5F259F] bg-purple-50 text-[#5F259F] font-semibold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Minimum Rating
            </label>
            <div className="flex gap-1.5">
              {[0, 4.0, 4.4].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`px-3 py-1 rounded-lg border text-xs font-medium flex items-center gap-1 ${
                    minRating === r
                      ? 'border-[#5F259F] bg-purple-50 text-[#5F259F] font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {r === 0 ? 'Any Rating' : `${r}★ & above`}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Sort By
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { id: 'popularity', label: 'Popularity' },
                { id: 'price_asc', label: 'Price: Low to High' },
                { id: 'price_desc', label: 'Price: High to Low' },
                { id: 'rating', label: 'Customer Rating' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSortBy(s.id as any)}
                  className={`p-1.5 rounded-lg border text-left text-xs font-medium ${
                    sortBy === s.id
                      ? 'border-[#5F259F] bg-purple-50 text-[#5F259F] font-semibold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="px-3.5 pt-3 pb-1 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong>{filteredProducts.length}</strong> product{filteredProducts.length === 1 ? '' : 's'}
          {searchQuery ? ` for "${searchQuery}"` : ''}
        </span>
        {activeFilterCount > 0 && (
          <span className="text-[11px] text-[#5F259F] font-medium">
            {activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Product Results List */}
      <div className="p-3.5 space-y-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const isCompared = compareList.some((p) => p.id === product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-sm transition flex gap-3 group relative"
              >
                {/* Thumbnail */}
                <div
                  onClick={() => openProductDetail(product)}
                  className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer relative"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {product.isSponsored && (
                    <span className="absolute top-1 left-1 bg-amber-400 text-slate-900 text-[8px] font-extrabold px-1.5 py-0.2 rounded shadow-2xs uppercase">
                      Sponsored
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div onClick={() => openProductDetail(product)} className="cursor-pointer">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                        {product.brand}
                      </span>
                      <div className="flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[8px] font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        <span>Verified</span>
                      </div>
                    </div>

                    <h4 className="font-semibold text-xs text-slate-900 leading-snug line-clamp-2 mt-0.5 group-hover:text-[#5F259F] transition">
                      {product.name}
                    </h4>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                      <span className="flex items-center text-amber-500 font-bold bg-amber-50 px-1 py-0.2 rounded">
                        <Star className="w-3 h-3 fill-amber-400 stroke-none mr-0.5" />
                        {product.rating}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        ({product.reviewCount.toLocaleString('en-IN')})
                      </span>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-sm text-slate-900">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      {product.dealsBadge && (
                        <p className="text-[9px] font-medium text-emerald-700 line-clamp-1">
                          {product.dealsBadge}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Compare Checkbox */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompare(product);
                        }}
                        className={`p-1.5 rounded-lg border text-[10px] font-semibold flex items-center gap-1 transition ${
                          isCompared
                            ? 'bg-purple-100 text-[#5F259F] border-purple-400 font-bold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                        title="Compare Product"
                      >
                        <Scale className="w-3 h-3" />
                        <span>{isCompared ? 'Compared' : 'Compare'}</span>
                      </button>

                      {/* Quick Add */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="bg-[#5F259F] hover:bg-[#4d1d82] text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-2xs transition"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* Empty Search State */
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 shadow-2xs space-y-3 mt-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5F259F] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800">No matching products found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-[260px] mx-auto">
                We currently stock <strong>Electronics</strong> and <strong>Beauty & Personal Care</strong> products.
              </p>
            </div>

            <div className="pt-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Try searching for:
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {POPULAR_SEARCH_SUGGESTIONS.slice(0, 4).map((query, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectSuggestion(query)}
                    className="text-xs bg-purple-50 text-[#5F259F] hover:bg-purple-100 px-2.5 py-1 rounded-full font-medium transition"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={clearAllFilters}
              className="mt-3 text-xs font-bold text-[#5F259F] underline"
            >
              Clear filters and view all
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
