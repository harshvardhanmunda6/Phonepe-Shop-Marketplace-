import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  ArrowLeft,
  X,
  Star,
  ShieldCheck,
  Plus,
  Scale,
  ShoppingCart,
  CheckCircle2,
} from 'lucide-react';

export const CompareModal: React.FC = () => {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    goBack,
    navigateTo,
    addToCart,
    openProductDetail,
    products,
  } = useShop();

  if (compareList.length === 0) {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 p-4 pb-20">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-2xs px-3.5 py-2.5 flex items-center justify-between mb-4">
          <button onClick={goBack} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-slate-800">Compare Products</span>
          <div className="w-8"></div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white rounded-3xl border border-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#5F259F] flex items-center justify-center mb-3">
            <Scale className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">No products in compare list</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-[240px]">
            Tap the "Compare" button on any product detail or search result to compare up to 3 products side-by-side.
          </p>
          <button
            onClick={() => navigateTo('shop_home')}
            className="mt-4 bg-[#5F259F] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
          >
            Explore Catalog
          </button>
        </div>
      </div>
    );
  }

  // Get common spec keys across products
  const allSpecKeys = Array.from(
    new Set(compareList.flatMap((p) => Object.keys(p.specs)))
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-50 pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-2xs px-3.5 py-2.5 flex items-center justify-between">
        <button
          onClick={goBack}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2 className="text-xs font-bold text-slate-900">Side-by-Side Comparison</h2>
          <p className="text-[10px] text-slate-500">{compareList.length} of 3 items selected</p>
        </div>

        <button
          onClick={clearCompare}
          className="text-[11px] font-semibold text-rose-600 hover:underline"
        >
          Clear
        </button>
      </header>

      {/* Comparison Grid Scroll Container */}
      <div className="p-3.5 overflow-x-auto">
        <div className="min-w-[340px] space-y-3">
          
          {/* Product Header Cards Row */}
          <div className={`grid gap-2 ${compareList.length === 1 ? 'grid-cols-1' : compareList.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {compareList.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-2xs flex flex-col justify-between relative"
              >
                <button
                  onClick={() => removeFromCompare(product.id)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 z-10"
                  title="Remove from compare"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div>
                  <div
                    onClick={() => openProductDetail(product)}
                    className="w-full aspect-square rounded-xl overflow-hidden bg-slate-100 mb-2 cursor-pointer"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <span className="text-[9px] font-bold text-purple-700 uppercase">
                    {product.brand}
                  </span>
                  <h4
                    onClick={() => openProductDetail(product)}
                    className="font-bold text-[11px] text-slate-900 line-clamp-2 leading-tight cursor-pointer hover:text-[#5F259F]"
                  >
                    {product.name}
                  </h4>

                  <div className="flex items-center gap-1 mt-1 text-[10px]">
                    <span className="flex items-center text-amber-500 font-bold">
                      <Star className="w-2.5 h-2.5 fill-amber-400 stroke-none mr-0.5" />
                      {product.rating}
                    </span>
                    <span className="text-slate-400">({product.reviewCount})</span>
                  </div>

                  <div className="mt-1.5">
                    <p className="font-extrabold text-xs text-slate-950">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[9px] text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="mt-2 w-full py-1.5 bg-[#5F259F] text-white rounded-lg text-[10px] font-bold shadow-2xs hover:bg-[#4d1d82] flex items-center justify-center gap-1"
                >
                  <ShoppingCart className="w-3 h-3" />
                  <span>Add to Cart</span>
                </button>
              </div>
            ))}
          </div>

          {/* Quick Add Slot if less than 3 */}
          {compareList.length < 3 && (
            <div
              onClick={() => navigateTo('search')}
              className="p-3 bg-purple-50/50 border border-dashed border-purple-300 rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold text-[#5F259F] cursor-pointer hover:bg-purple-50"
            >
              <Plus className="w-4 h-4" />
              <span>Add another product to compare ({3 - compareList.length} slots left)</span>
            </div>
          )}

          {/* Specs Comparison Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="bg-slate-100/70 px-3 py-2 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Feature Comparison
            </div>

            <div className="divide-y divide-slate-100 text-[11px]">
              {/* Verified Seller Row */}
              <div className="p-2.5 bg-slate-50/40">
                <span className="font-bold text-slate-400 text-[10px] uppercase block mb-1">
                  Verified Seller
                </span>
                <div className={`grid gap-2 ${compareList.length === 1 ? 'grid-cols-1' : compareList.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                  {compareList.map((p) => (
                    <div key={p.id} className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>PhonePe Verified</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* EMI / Autopay Benefit Row */}
              <div className="p-2.5">
                <span className="font-bold text-slate-400 text-[10px] uppercase block mb-1">
                  Payment Benefit
                </span>
                <div className={`grid gap-2 ${compareList.length === 1 ? 'grid-cols-1' : compareList.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                  {compareList.map((p) => (
                    <div key={p.id} className="text-slate-800 font-medium">
                      {p.emiOptions ? (
                        <span className="text-[#5F259F] font-bold">
                          No-Cost EMI from ₹{p.emiOptions[p.emiOptions.length - 1].monthlyAmount}/mo
                        </span>
                      ) : (
                        <span className="text-purple-700 font-bold">
                          UPI Autopay: 5% off
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Specs Rows */}
              {allSpecKeys.map((key) => (
                <div key={key} className="p-2.5">
                  <span className="font-bold text-slate-400 text-[10px] uppercase block mb-1">
                    {key}
                  </span>
                  <div className={`grid gap-2 ${compareList.length === 1 ? 'grid-cols-1' : compareList.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {compareList.map((p) => (
                      <div key={p.id} className="text-slate-800 font-medium">
                        {p.specs[key] || '—'}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
