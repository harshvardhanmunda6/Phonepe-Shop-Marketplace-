import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Repeat,
  Tag,
  Check,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  CreditCard,
} from 'lucide-react';

export const CartScreen: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    cartItemCount,
    goBack,
    navigateTo,
    showToast,
  } = useShop();

  const [couponCode, setCouponCode] = useState('PHONEPE100');
  const [couponApplied, setCouponApplied] = useState(true);

  if (cart.length === 0) {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 p-4 pb-20">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-2xs px-3.5 py-2.5 flex items-center justify-between mb-4">
          <button onClick={goBack} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-slate-800">Your Cart</span>
          <div className="w-8"></div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white rounded-3xl border border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-[#5F259F] flex items-center justify-center mb-3">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Your PhonePe cart is empty</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-[240px]">
            Explore our curated Electronics and Beauty departments for verified genuine products with UPI savings.
          </p>
          <button
            onClick={() => navigateTo('shop_home')}
            className="mt-4 bg-[#5F259F] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md hover:bg-[#4d1d82] transition"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  // Calculate final coupon deduction
  const couponDiscount = couponApplied ? (cartSubtotal >= 1000 ? 100 : 50) : 0;
  const finalPayable = Math.max(0, cartTotal - couponDiscount);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'PHONEPE100' || couponCode.toUpperCase() === 'UPI50') {
      setCouponApplied(true);
      showToast('Coupon applied successfully! Extra savings unlocked.');
    } else {
      showToast('Invalid coupon code. Try PHONEPE100', 'warning');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-2xs px-3.5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xs font-bold text-slate-900">
            Cart ({cartItemCount} item{cartItemCount > 1 ? 's' : ''})
          </h2>
        </div>

        <button
          onClick={clearCart}
          className="text-[11px] font-semibold text-slate-400 hover:text-rose-600"
        >
          Clear All
        </button>
      </header>

      {/* Free Delivery Banner */}
      <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 flex items-center justify-between text-[11px] text-emerald-900 font-semibold">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>You have unlocked <strong>FREE Express Delivery</strong> on this order</span>
        </span>
      </div>

      <div className="p-3.5 space-y-3.5">

        {/* Cart Item Cards */}
        <div className="space-y-2.5">
          {cart.map((item) => {
            const itemPrice = item.isSubscription
              ? Math.round(item.product.price * 0.95)
              : item.product.price;
            const itemTotal = (itemPrice + (item.warrantyAdded ? 499 : 0)) * item.quantity;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs space-y-2.5"
              >
                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-purple-700 uppercase">
                        {item.product.brand}
                      </span>
                      <h4 className="font-semibold text-xs text-slate-900 leading-snug line-clamp-2">
                        {item.product.name}
                      </h4>
                    </div>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-extrabold text-sm text-slate-950">
                        ₹{itemPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 line-through">
                        ₹{item.product.originalPrice.toLocaleString('en-IN')}
                      </span>
                      {item.isSubscription && (
                        <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1 py-0.2 rounded">
                          Autopay -5%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Extras Badges */}
                {(item.warrantyAdded || item.isSubscription || item.emiMonths) && (
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-[11px]">
                    {item.warrantyAdded && (
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>1-Yr PhonePe Protect Plan</span>
                        </span>
                        <span className="font-bold text-slate-900">+₹499</span>
                      </div>
                    )}
                    {item.isSubscription && (
                      <div className="flex items-center gap-1 text-[#5F259F] font-semibold">
                        <Repeat className="w-3.5 h-3.5" />
                        <span>Recurring UPI Autopay every {item.subscriptionFrequency} days</span>
                      </div>
                    )}
                    {item.emiMonths && (
                      <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>No-Cost EMI: {item.emiMonths} Months Plan</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Quantity and Remove */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 flex items-center gap-1 text-[11px]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Qty:</span>
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="p-1 hover:bg-slate-200 text-slate-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="p-1 hover:bg-slate-200 text-slate-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Coupon Code Section */}
        <section className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Tag className="w-4 h-4 text-[#5F259F]" />
            <span>Apply Coupon / Bank Offer</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 px-3 py-1.5 bg-slate-50 rounded-xl text-xs font-semibold text-slate-800 uppercase border border-slate-200 focus:outline-hidden focus:border-[#5F259F]"
            />
            {couponApplied ? (
              <button
                onClick={() => {
                  setCouponApplied(false);
                  showToast('Coupon removed', 'info');
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
              >
                Remove
              </button>
            ) : (
              <button
                onClick={handleApplyCoupon}
                className="px-3 py-1.5 bg-[#5F259F] text-white rounded-xl text-xs font-bold hover:bg-[#4d1d82]"
              >
                Apply
              </button>
            )}
          </div>

          {couponApplied && (
            <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>₹{couponDiscount} instant PhonePe discount applied!</span>
            </p>
          )}
        </section>

        {/* Bill Summary Breakdown */}
        <section className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Price Details ({cartItemCount} Item{cartItemCount > 1 ? 's' : ''})
          </h4>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Total MRP</span>
              <span className="font-medium">
                ₹{(cartTotal + cartDiscount).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Catalog Discount</span>
              <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
            </div>

            {couponApplied && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Coupon (PHONEPE100)</span>
                <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Delivery Charges</span>
              <span className="text-emerald-600 font-bold">FREE</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Platform Fee</span>
              <span className="text-emerald-600 font-bold">₹0 (Waived)</span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline text-slate-900 font-black text-sm">
              <span>Total Amount</span>
              <span className="text-base text-slate-950">
                ₹{finalPayable.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </section>

      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed sm:absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-between z-30 shadow-lg">
        <div>
          <p className="text-[10px] text-slate-500">Payable Amount</p>
          <span className="text-lg font-black text-slate-950">
            ₹{finalPayable.toLocaleString('en-IN')}
          </span>
        </div>

        <button
          onClick={() => navigateTo('checkout')}
          className="flex items-center gap-1.5 px-6 py-2.5 bg-[#5F259F] text-white rounded-xl text-xs font-bold hover:bg-[#4d1d82] shadow-md shadow-purple-600/30 transition active:scale-95"
        >
          <span>Select Payment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
