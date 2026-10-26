import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ArrowLeft,
  Share2,
  ShoppingCart,
  Star,
  ShieldCheck,
  Bell,
  Scale,
  CreditCard,
  Repeat,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Truck,
  RotateCcw,
  Tag,
  ChevronDown,
  ChevronUp,
  Percent,
} from 'lucide-react';

export const ProductDetailScreen: React.FC = () => {
  const {
    selectedProduct,
    goBack,
    navigateTo,
    addToCart,
    cartItemCount,
    toggleCompare,
    compareList,
    priceAlerts,
    togglePriceAlert,
    showToast,
    logEvent,
  } = useShop();

  if (!selectedProduct) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm text-slate-600 mb-3">No product selected</p>
        <button
          onClick={goBack}
          className="bg-[#5F259F] text-white text-xs font-bold px-4 py-2 rounded-xl"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Electronics state
  const [selectedEmiMonths, setSelectedEmiMonths] = useState<number | null>(null);
  const [warrantyAdded, setWarrantyAdded] = useState(false);

  // Beauty state
  const [isSubscription, setIsSubscription] = useState(false);
  const [subscriptionFrequency, setSubscriptionFrequency] = useState<30 | 60 | 90>(30);

  // Offers accordion toggle
  const [isOffersOpen, setIsOffersOpen] = useState(true);

  const isElectronics = selectedProduct.category === 'electronics';
  const isBeauty = selectedProduct.category === 'beauty';

  const isCompared = compareList.some((p) => p.id === selectedProduct.id);
  const hasPriceAlert = !!priceAlerts[selectedProduct.id];

  // Calculated effective price
  const basePrice = selectedProduct.price;
  const subscriptionDiscount = isSubscription ? Math.round(basePrice * 0.05) : 0;
  const warrantyCost = warrantyAdded ? 499 : 0;
  const finalCalculatedPrice = basePrice - subscriptionDiscount + warrantyCost;

  const handleEmiSelect = (months: number | null) => {
    setSelectedEmiMonths(months);
    if (months) {
      logEvent('emi_selected', { productId: selectedProduct.id, months });
      showToast(`Selected ${months} Months No-Cost EMI`, 'info');
    }
  };

  const handleWarrantyToggle = (checked: boolean) => {
    setWarrantyAdded(checked);
    if (checked) {
      logEvent('warranty_attached', { productId: selectedProduct.id });
      showToast('Added 1-Year PhonePe Protect Insurance Plan (+₹499)');
    }
  };

  const handleSubscriptionToggle = (isSub: boolean) => {
    setIsSubscription(isSub);
    if (isSub) {
      logEvent('subscription_started', {
        productId: selectedProduct.id,
        frequency: subscriptionFrequency,
      });
      showToast(`UPI Autopay activated: 5% off every ${subscriptionFrequency} days!`);
    }
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, {
      warrantyAdded,
      isSubscription,
      subscriptionFrequency,
      emiMonths: selectedEmiMonths,
    });
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, {
      warrantyAdded,
      isSubscription,
      subscriptionFrequency,
      emiMonths: selectedEmiMonths,
    });
    navigateTo('cart');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-2xs px-3.5 py-2.5 flex items-center justify-between">
        <button
          onClick={goBack}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider truncate max-w-[180px]">
          {selectedProduct.brand}
        </span>

        <div className="flex items-center gap-1.5">
          {/* Compare toggle */}
          <button
            onClick={() => toggleCompare(selectedProduct)}
            className={`p-1.5 rounded-full transition ${
              isCompared ? 'bg-purple-100 text-[#5F259F]' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Compare with other products"
          >
            <Scale className="w-5 h-5" />
          </button>

          {/* Share button */}
          <button
            onClick={() => showToast('Product link copied to clipboard')}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition"
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => navigateTo('cart')}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 relative transition"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#5F259F] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="p-3.5 space-y-3.5">

        {/* 4. Gallery Carousel */}
        <section className="bg-white rounded-3xl p-3 border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-3">
            <img
              src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
              alt={selectedProduct.name}
              className="w-full h-full object-cover transition duration-300"
            />

            {/* Sponsored Badge */}
            {selectedProduct.isSponsored && (
              <span className="absolute top-2 left-2 bg-amber-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                Sponsored Listing
              </span>
            )}

            {/* Verified Seller Pill */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-emerald-600/95 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Seller</span>
            </div>

            {/* Compare Quick Pill */}
            {compareList.length > 0 && (
              <button
                onClick={() => navigateTo('compare')}
                className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1"
              >
                <Scale className="w-3 h-3" />
                <span>Compare ({compareList.length}/3)</span>
              </button>
            )}
          </div>

          {/* Thumbnail Strip */}
          {selectedProduct.images.length > 1 && (
            <div className="flex gap-2 justify-center">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition ${
                    activeImageIndex === idx
                      ? 'border-[#5F259F] scale-105 shadow-xs'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Title, Brand, Ratings */}
        <section className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5F259F] uppercase tracking-wider">
              {selectedProduct.brand} • {selectedProduct.subcategory}
            </span>

            {/* Price-drop alert toggle */}
            <button
              onClick={() => togglePriceAlert(selectedProduct.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition ${
                hasPriceAlert
                  ? 'bg-amber-50 text-amber-800 border-amber-300 font-bold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Set price-drop notification"
            >
              <Bell className={`w-3.5 h-3.5 ${hasPriceAlert ? 'fill-amber-400 stroke-amber-700' : ''}`} />
              <span>{hasPriceAlert ? 'Alert Set' : 'Price Alert'}</span>
            </button>
          </div>

          <h1 className="text-base font-bold text-slate-900 leading-snug">
            {selectedProduct.name}
          </h1>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center bg-emerald-600 text-white font-bold text-xs px-2 py-0.5 rounded-md">
              <span>{selectedProduct.rating}</span>
              <Star className="w-3 h-3 fill-white stroke-none ml-1" />
            </div>
            <span className="text-slate-500 font-medium">
              {selectedProduct.reviewCount.toLocaleString('en-IN')} Ratings & Reviews
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-semibold text-[11px]">In Stock</span>
          </div>

          {/* Price Block */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-950">
                ₹{basePrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 line-through">
                ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                {Math.round(((selectedProduct.originalPrice - basePrice) / selectedProduct.originalPrice) * 100)}% OFF
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Inclusive of all taxes & free shipping</p>
          </div>

          {/* Description Snippet */}
          <p className="text-xs text-slate-600 leading-relaxed pt-1">
            {selectedProduct.description}
          </p>
        </section>

        {/* 6. Beauty Extras: Authenticity Guarantee & Subscribe & Save via UPI Autopay */}
        {isBeauty && (
          <section className="bg-white rounded-2xl p-4 border border-purple-100 shadow-2xs space-y-3">
            {/* Authenticity Guarantee Badge */}
            <div className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-xl p-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                  Authenticity Guarantee
                </p>
                <p className="text-[11px] text-emerald-800">
                  100% Genuine, directly sourced from brand & dermatologist tested.
                </p>
              </div>
            </div>

            {/* Subscribe & Save via UPI Autopay */}
            <div className="border border-purple-200 rounded-2xl p-3.5 bg-gradient-to-br from-purple-50/50 to-pink-50/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#5F259F] text-white flex items-center justify-center">
                    <Repeat className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Subscribe & Save via UPI Autopay
                    </h4>
                    <p className="text-[10px] text-purple-700 font-semibold">
                      Extra 5% Off on recurring delivery • Cancel anytime
                    </p>
                  </div>
                </div>
              </div>

              {/* Purchase Mode Radios */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <button
                  onClick={() => handleSubscriptionToggle(false)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    !isSubscription
                      ? 'border-[#5F259F] bg-white text-slate-900 font-bold shadow-2xs ring-1 ring-[#5F259F]'
                      : 'border-slate-200 bg-white/60 text-slate-600 hover:bg-white'
                  }`}
                >
                  <p className="font-bold">One-time Order</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">₹{basePrice.toLocaleString('en-IN')}</p>
                </button>

                <button
                  onClick={() => handleSubscriptionToggle(true)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    isSubscription
                      ? 'border-[#5F259F] bg-white text-purple-900 font-bold shadow-2xs ring-1 ring-[#5F259F]'
                      : 'border-purple-200 bg-white/60 text-slate-600 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#5F259F]">Autopay (5% Off)</p>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1 rounded">SAVE</span>
                  </div>
                  <p className="text-[11px] font-extrabold text-slate-900 mt-0.5">
                    ₹{Math.round(basePrice * 0.95).toLocaleString('en-IN')}/del
                  </p>
                </button>
              </div>

              {/* Cadence Selector if subscription enabled */}
              {isSubscription && (
                <div className="pt-2 border-t border-purple-200/60 animate-in fade-in">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-purple-900 block mb-1.5">
                    Select Delivery Cadence:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {([30, 60, 90] as const).map((days) => (
                      <button
                        key={days}
                        onClick={() => setSubscriptionFrequency(days)}
                        className={`p-1.5 rounded-lg text-xs font-semibold border text-center transition ${
                          subscriptionFrequency === days
                            ? 'bg-[#5F259F] text-white border-[#5F259F]'
                            : 'bg-white text-slate-700 border-purple-200 hover:bg-purple-50'
                        }`}
                      >
                        Every {days} Days
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#5F259F]" />
                    <span>Next auto-debit on PhonePe UPI after {subscriptionFrequency} days</span>
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 5. Electronics Extras: No-Cost EMI Selector & Warranty Add-on */}
        {isElectronics && (
          <section className="bg-white rounded-2xl p-4 border border-purple-100 shadow-2xs space-y-3.5">
            {/* No-Cost EMI Selector */}
            {selectedProduct.emiOptions && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#5F259F]" />
                    <h4 className="text-xs font-bold text-slate-900">
                      PhonePe No-Cost EMI
                    </h4>
                  </div>
                  <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
                    0% Interest
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {selectedProduct.emiOptions.map((opt) => (
                    <button
                      key={opt.months}
                      onClick={() =>
                        handleEmiSelect(selectedEmiMonths === opt.months ? null : opt.months)
                      }
                      className={`p-2 rounded-xl border text-center transition ${
                        selectedEmiMonths === opt.months
                          ? 'border-[#5F259F] bg-purple-50/70 text-[#5F259F] font-bold shadow-2xs ring-1 ring-[#5F259F]'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <p className="text-xs font-extrabold">₹{opt.monthlyAmount.toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-slate-500">/mo for {opt.months}m</p>
                    </button>
                  ))}
                </div>

                {selectedEmiMonths ? (
                  <p className="text-[11px] text-purple-700 font-semibold mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {selectedEmiMonths} months @ ₹
                      {selectedProduct.emiOptions
                        .find((o) => o.months === selectedEmiMonths)
                        ?.monthlyAmount.toLocaleString('en-IN')}
                      /month on PhonePe UPI / Card
                    </span>
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1">Tap a plan to apply No-Cost EMI</p>
                )}
              </div>
            )}

            {/* Optional Warranty / Insurance Add-on Checkbox */}
            <div className="pt-3 border-t border-slate-100">
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer hover:bg-purple-50/30 transition">
                <input
                  type="checkbox"
                  checked={warrantyAdded}
                  onChange={(e) => handleWarrantyToggle(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#5F259F] focus:ring-[#5F259F] border-slate-300 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      1-Year PhonePe Protect Damage Plan
                    </span>
                    <span className="text-xs font-extrabold text-[#5F259F]">+₹499</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Covers screen damage, liquid spills, electrical surges & free doorstep pickup.
                  </p>
                </div>
              </label>
            </div>
          </section>
        )}

        {/* 4. Bank and UPI Offers */}
        <section className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs">
          <div
            onClick={() => setIsOffersOpen(!isOffersOpen)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-900">
                Bank & UPI Offers (3 Available)
              </h4>
            </div>
            {isOffersOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>

          {isOffersOpen && (
            <div className="mt-3 space-y-2 border-t border-slate-100 pt-2.5 text-xs animate-in fade-in">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <div>
                  <span className="font-bold text-slate-800">PhonePe UPI Instant Discount: </span>
                  <span className="text-slate-600">Get flat ₹100 instant cashback on orders above ₹1,000.</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></span>
                <div>
                  <span className="font-bold text-slate-800">HDFC & SBI UPI Cards: </span>
                  <span className="text-slate-600">Extra 5% reward SuperCoins credited to PhonePe Wallet.</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                <div>
                  <span className="font-bold text-slate-800">No Cost EMI: </span>
                  <span className="text-slate-600">Zero processing fee & zero interest on select tenure.</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Compare Button Section */}
        <section className="bg-purple-50/60 rounded-2xl p-3 border border-purple-200/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#5F259F]" />
            <div>
              <p className="text-xs font-bold text-purple-950">
                Compare with alternative products
              </p>
              <p className="text-[10px] text-purple-700">
                {compareList.length === 0
                  ? 'Add up to 3 products to compare specs'
                  : `${compareList.length} product(s) in compare drawer`}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (!isCompared) toggleCompare(selectedProduct);
              navigateTo('compare');
            }}
            className="bg-[#5F259F] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs hover:bg-[#4d1d82]"
          >
            {isCompared ? 'View Compare' : '+ Compare'}
          </button>
        </section>

        {/* Specifications Table */}
        <section className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Product Specifications
          </h4>

          <div className="divide-y divide-slate-100 text-xs">
            {Object.entries(selectedProduct.specs).map(([key, value]) => (
              <div key={key} className="py-2 flex justify-between gap-4">
                <span className="text-slate-500 font-medium">{key}</span>
                <span className="text-slate-900 font-semibold text-right">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Verified Customer Reviews */}
        <section className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Verified Buyer Reviews
            </h4>
            <span className="text-xs font-bold text-[#5F259F]">View all {selectedProduct.reviewCount}</span>
          </div>

          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-800">Rohan Sharma</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-semibold">
                    Verified Buyer
                  </span>
                </div>
                <div className="flex items-center text-amber-500">
                  <Star className="w-3 h-3 fill-amber-400 stroke-none" />
                  <Star className="w-3 h-3 fill-amber-400 stroke-none" />
                  <Star className="w-3 h-3 fill-amber-400 stroke-none" />
                  <Star className="w-3 h-3 fill-amber-400 stroke-none" />
                  <Star className="w-3 h-3 fill-amber-400 stroke-none" />
                </div>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                "Super fast delivery via PhonePe! Item was 100% original and verified package. UPI payment was seamless in one second."
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-800">Pooja Iyer</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-semibold">
                    Verified Buyer
                  </span>
                </div>
                <div className="flex items-center text-amber-500">
                  <Star className="w-3 h-3 fill-amber-400 stroke-none" />
                  <Star className="w-3 h-3 fill-amber-400 stroke-none" />
                  <Star className="w-3 h-3 fill-amber-400 stroke-none" />
                  <Star className="w-3 h-3 fill-amber-400 stroke-none" />
                </div>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                "Great quality for the price. Exactly matches the specifications listed. Glad PhonePe has this marketplace now."
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed sm:absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-between z-30 shadow-lg">
        <div>
          <p className="text-[10px] text-slate-500 font-medium">Total Payable</p>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-slate-950">
              ₹{finalCalculatedPrice.toLocaleString('en-IN')}
            </span>
            {isSubscription && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                -5% Autopay
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            className="px-3.5 py-2.5 bg-purple-50 text-[#5F259F] border border-purple-200 rounded-xl text-xs font-bold hover:bg-purple-100 transition active:scale-95"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="px-5 py-2.5 bg-[#5F259F] text-white rounded-xl text-xs font-bold hover:bg-[#4d1d82] shadow-md shadow-purple-600/30 transition active:scale-95"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
