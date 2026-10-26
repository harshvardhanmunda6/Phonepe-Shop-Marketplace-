import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  ArrowLeft,
  Search,
  ShoppingCart,
  Bot,
  Percent,
  Sparkles,
  ShieldCheck,
  Star,
  ChevronRight,
  TrendingUp,
  Zap,
  Repeat,
  Scale,
  CreditCard,
} from 'lucide-react';
import { POPULAR_SEARCH_SUGGESTIONS } from '../data/mockData';

export const ShopHomeScreen: React.FC = () => {
  const {
    navigateTo,
    goBack,
    products,
    openProductDetail,
    cartItemCount,
    setSearchQuery,
    setSelectedCategoryFilter,
    setIsAiModalOpen,
    compareList,
    addToCart,
    toggleCompare,
  } = useShop();

  const electronicsProducts = products.filter((p) => p.category === 'electronics');
  const beautyProducts = products.filter((p) => p.category === 'beauty');

  const handleCategoryClick = (category: 'electronics' | 'beauty') => {
    setSelectedCategoryFilter(category);
    setSearchQuery('');
    navigateTo('search');
  };

  const handleTrendingSearchClick = (query: string) => {
    setSearchQuery(query);
    setSelectedCategoryFilter(null);
    navigateTo('search');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 pb-20">
      {/* Top Marketplace Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-2xs px-3.5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition"
            title="Back to PhonePe Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Text Wordmark */}
          <div className="flex items-center">
            <span className="font-extrabold text-[#5F259F] text-lg tracking-tight">
              PhonePe
            </span>
            <span className="ml-1 px-1.5 py-0.5 rounded-md bg-[#5F259F] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-2xs">
              Shop
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Ask AI Shop Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-[#5F259F] hover:bg-purple-100 border border-purple-200 rounded-full text-xs font-semibold transition"
          >
            <Bot className="w-3.5 h-3.5 text-[#5F259F]" />
            <span className="hidden xs:inline">Ask AI</span>
          </button>

          {/* Orders shortcut */}
          <button
            onClick={() => navigateTo('orders')}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition"
            title="My Orders & Subscriptions"
          >
            <TrendingUp className="w-5 h-5" />
          </button>

          {/* Cart Icon with badge */}
          <button
            onClick={() => navigateTo('cart')}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 relative transition"
            title="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#5F259F] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Sub-header Location Indicator */}
      <div className="bg-[#FAF7FD] border-b border-purple-100/60 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Deliver to <strong>HSR Layout, Bengaluru 560102</strong></span>
        </div>
        <span className="text-[#5F259F] font-semibold text-[10px]">Express 24h</span>
      </div>

      <div className="p-3.5 space-y-4">

        {/* 2. Interactive Search Bar */}
        <div
          onClick={() => navigateTo('search')}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex items-center gap-2.5 cursor-pointer hover:border-purple-300 transition group"
        >
          <Search className="w-4 h-4 text-purple-600 shrink-0 group-hover:scale-110 transition" />
          <div className="flex-1 text-xs text-slate-400 font-normal">
            Search "budget smartphones", "headphones", "serum"...
          </div>
          <span className="text-[10px] font-bold text-[#5F259F] bg-purple-50 px-2 py-0.5 rounded-md">
            Search
          </span>
        </div>

        {/* 2. Deals on UPI Strip */}
        <section className="bg-gradient-to-r from-emerald-50 via-teal-50 to-purple-50 border border-emerald-200/80 rounded-2xl p-3 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[9px] uppercase tracking-wider">
                UPI OFFERS
              </span>
              <h4 className="text-xs font-bold text-slate-800">Deals on PhonePe UPI</h4>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700">Auto-applied</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <div className="shrink-0 bg-white rounded-xl p-2 border border-emerald-100 flex items-center gap-2 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                ₹100
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-800">Flat ₹100 Off on UPI</p>
                <p className="text-[10px] text-slate-500">Min order ₹1,000</p>
              </div>
            </div>

            <div className="shrink-0 bg-white rounded-xl p-2 border border-purple-100 flex items-center gap-2 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-[#5F259F] flex items-center justify-center font-bold text-xs">
                <Repeat className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-800">5% Off with Autopay</p>
                <p className="text-[10px] text-slate-500">Beauty & Skincare items</p>
              </div>
            </div>

            <div className="shrink-0 bg-white rounded-xl p-2 border border-amber-100 flex items-center gap-2 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-800">No Cost EMI</p>
                <p className="text-[10px] text-slate-500">Up to 9 months on 0%</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Trending Searches Strip */}
        <section className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#5F259F]" />
              Trending in PhonePe Shop
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {POPULAR_SEARCH_SUGGESTIONS.slice(0, 5).map((query, idx) => (
              <button
                key={idx}
                onClick={() => handleTrendingSearchClick(query)}
                className="shrink-0 text-[11px] bg-white border border-slate-200 hover:border-purple-300 text-slate-700 px-2.5 py-1 rounded-full shadow-2xs hover:bg-purple-50/50 transition font-medium"
              >
                {query}
              </button>
            ))}
          </div>
        </section>

        {/* 2. TWO CATEGORY CARDS (Primary requirement: Electronics and Beauty & Personal Care) */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              Browse Categories
            </h3>
            <span className="text-[11px] text-[#5F259F] font-semibold">2 Curated Departments</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Category Card 1: Electronics */}
            <div
              onClick={() => handleCategoryClick('electronics')}
              className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm cursor-pointer hover:border-purple-300 hover:shadow-md transition group overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-4/3 mb-2.5 bg-purple-50">
                  <img
                    src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80"
                    alt="Electronics"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    8 Items
                  </span>
                  <span className="absolute bottom-1.5 right-1.5 bg-emerald-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-2xs">
                    No-Cost EMI
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#5F259F] transition">
                  Electronics
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  Budget 5G phones, headphones, fitness trackers, student laptops
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#5F259F]">
                <span>Explore</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </div>
            </div>

            {/* Category Card 2: Beauty & Personal Care */}
            <div
              onClick={() => handleCategoryClick('beauty')}
              className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm cursor-pointer hover:border-purple-300 hover:shadow-md transition group overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-4/3 mb-2.5 bg-pink-50">
                  <img
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80"
                    alt="Beauty & Personal Care"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    8 Items
                  </span>
                  <span className="absolute bottom-1.5 right-1.5 bg-purple-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-2xs">
                    Autopay 5% Off
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#5F259F] transition">
                  Beauty & Personal Care
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  Skincare, makeup, hair care, men's grooming & trimmers
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#5F259F]">
                <span>Explore</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Electronics Row */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Electronics Hot Deals</h3>
              <p className="text-[11px] text-slate-500">Verified gadgets with No-Cost EMI</p>
            </div>
            <button
              onClick={() => handleCategoryClick('electronics')}
              className="text-xs font-bold text-[#5F259F] hover:underline"
            >
              See All (8)
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {electronicsProducts.slice(0, 4).map((product) => (
              <div
                key={product.id}
                onClick={() => openProductDetail(product)}
                className="w-40 shrink-0 bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-2xs hover:shadow-sm cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative rounded-xl overflow-hidden aspect-square mb-2 bg-slate-100">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 flex items-center gap-0.5 bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      <span>Verified</span>
                    </div>
                  </div>

                  <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                    {product.brand}
                  </p>
                  <h5 className="font-semibold text-xs text-slate-800 line-clamp-2 leading-tight mt-0.5">
                    {product.name}
                  </h5>

                  <div className="flex items-center gap-1 mt-1 text-[11px]">
                    <span className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 stroke-none mr-0.5" />
                      {product.rating}
                    </span>
                    <span className="text-slate-400 text-[10px]">({product.reviewCount})</span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-sm text-slate-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {product.emiOptions && (
                    <p className="text-[9px] font-medium text-emerald-700 mt-0.5">
                      EMI from ₹{product.emiOptions[product.emiOptions.length - 1].monthlyAmount}/mo
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Beauty & Personal Care Row */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Beauty & Daily Care</h3>
              <p className="text-[11px] text-slate-500">100% Genuine, Subscribe & Save with UPI Autopay</p>
            </div>
            <button
              onClick={() => handleCategoryClick('beauty')}
              className="text-xs font-bold text-[#5F259F] hover:underline"
            >
              See All (8)
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {beautyProducts.slice(0, 4).map((product) => (
              <div
                key={product.id}
                onClick={() => openProductDetail(product)}
                className="w-40 shrink-0 bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-2xs hover:shadow-sm cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative rounded-xl overflow-hidden aspect-square mb-2 bg-pink-50">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.isSponsored && (
                      <span className="absolute top-1 right-1 bg-amber-400 text-slate-900 text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow-2xs uppercase">
                        Sponsored
                      </span>
                    )}
                    <div className="absolute top-1 left-1 flex items-center gap-0.5 bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      <span>Verified</span>
                    </div>
                  </div>

                  <p className="text-[10px] font-bold text-pink-700 uppercase tracking-wider">
                    {product.brand}
                  </p>
                  <h5 className="font-semibold text-xs text-slate-800 line-clamp-2 leading-tight mt-0.5">
                    {product.name}
                  </h5>

                  <div className="flex items-center gap-1 mt-1 text-[11px]">
                    <span className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 stroke-none mr-0.5" />
                      {product.rating}
                    </span>
                    <span className="text-slate-400 text-[10px]">({product.reviewCount})</span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-sm text-slate-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[9px] font-medium text-[#5F259F] mt-0.5 flex items-center gap-0.5">
                    <Repeat className="w-2.5 h-2.5" />
                    <span>Autopay: ₹{Math.round(product.price * 0.95)}/mo</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Floating Compare Drawer trigger if user has items selected */}
        {compareList.length > 0 && (
          <div className="bg-[#5F259F] text-white rounded-2xl p-3 shadow-lg flex items-center justify-between animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-purple-200" />
              <div>
                <p className="text-xs font-bold">Compare ({compareList.length}/3)</p>
                <p className="text-[10px] text-purple-200">
                  {compareList.map((p) => p.name.split(' ')[0]).join(', ')}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigateTo('compare')}
              className="bg-white text-[#5F259F] px-3 py-1 rounded-xl text-xs font-bold shadow-2xs hover:bg-purple-50"
            >
              View Table
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
