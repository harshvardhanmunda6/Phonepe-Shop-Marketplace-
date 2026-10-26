import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Building2,
  Clock,
  Sparkles,
  ChevronRight,
  Plus,
} from 'lucide-react';

export const CheckoutScreen: React.FC = () => {
  const {
    cart,
    cartTotal,
    addresses,
    selectedAddress,
    setSelectedAddress,
    startCheckout,
    navigateTo,
    goBack,
    showToast,
  } = useShop();

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'EMI' | 'PayLater'>('UPI');
  const [selectedBank, setSelectedBank] = useState<'SBI' | 'HDFC'>('SBI');
  const [emiTenure, setEmiTenure] = useState<3 | 6 | 9>(3);
  const [isChangingAddress, setIsChangingAddress] = useState(false);

  const finalAmount = cartTotal;

  const handleProceedToPay = () => {
    let details = '';
    if (paymentMethod === 'UPI') {
      details = `PhonePe UPI • ${selectedBank === 'SBI' ? 'SBI (••••4821)' : 'HDFC (••••9012)'}`;
    } else if (paymentMethod === 'EMI') {
      const monthly = Math.round(finalAmount / emiTenure);
      details = `PhonePe No-Cost EMI • ${emiTenure} Months @ ₹${monthly.toLocaleString('en-IN')}/mo`;
    } else {
      details = 'PhonePe Pay Later • Credit Account';
    }

    startCheckout(paymentMethod, details);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-2xs px-3.5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xs font-bold text-slate-900">Checkout</h2>
            <p className="text-[10px] text-slate-500">Fast UPI & Verified Delivery</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Safe</span>
        </div>
      </header>

      <div className="p-3.5 space-y-3.5">

        {/* 1. Delivery Address Card */}
        <section className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <MapPin className="w-4 h-4 text-[#5F259F]" />
              <span>Deliver To</span>
            </div>
            <button
              onClick={() => setIsChangingAddress(!isChangingAddress)}
              className="text-xs font-bold text-[#5F259F] hover:underline"
            >
              {isChangingAddress ? 'Done' : 'Change'}
            </button>
          </div>

          {!isChangingAddress ? (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span>{selectedAddress.name}</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                  HOME
                </span>
                <span className="text-slate-500 font-normal">{selectedAddress.phone}</span>
              </div>
              <p className="text-slate-600 mt-1 leading-snug">
                {selectedAddress.flat}, {selectedAddress.street}, {selectedAddress.city},{' '}
                {selectedAddress.state} - <strong>{selectedAddress.pincode}</strong>
              </p>
            </div>
          ) : (
            <div className="space-y-2 pt-1 animate-in fade-in">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => {
                    setSelectedAddress(addr);
                    setIsChangingAddress(false);
                    showToast(`Delivery set to ${addr.city}`);
                  }}
                  className={`p-2.5 rounded-xl border cursor-pointer transition ${
                    selectedAddress.id === addr.id
                      ? 'border-[#5F259F] bg-purple-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-bold text-xs text-slate-800">{addr.name}</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {addr.flat}, {addr.street}, {addr.city} - {addr.pincode}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 2. Payment Method Selector */}
        <section className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Payment Method
            </h3>
            <span className="text-[10px] font-semibold text-[#5F259F]">Zero Extra Fees</span>
          </div>

          <div className="space-y-2">

            {/* Option A: PhonePe UPI */}
            <div
              onClick={() => setPaymentMethod('UPI')}
              className={`p-3 rounded-2xl border cursor-pointer transition ${
                paymentMethod === 'UPI'
                  ? 'border-[#5F259F] bg-purple-50/50 ring-1 ring-[#5F259F]'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#5F259F] text-white flex items-center justify-center font-bold text-xs">
                    UPI
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      PhonePe UPI
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-extrabold">
                        RECOMMENDED
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500">Fast 1-click payment via your bank</p>
                  </div>
                </div>

                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'UPI'
                      ? 'border-[#5F259F] bg-[#5F259F]'
                      : 'border-slate-300'
                  }`}
                >
                  {paymentMethod === 'UPI' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
              </div>

              {/* Bank Accounts Sub-list */}
              {paymentMethod === 'UPI' && (
                <div className="mt-3 pt-2.5 border-t border-purple-200/60 space-y-2 text-xs">
                  <label
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBank('SBI');
                    }}
                    className="flex items-center justify-between p-2 rounded-xl bg-white border border-purple-100 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                        SBI
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">State Bank of India ••••4821</p>
                        <p className="text-[10px] text-slate-400">Primary Bank Account</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="bank"
                      checked={selectedBank === 'SBI'}
                      onChange={() => setSelectedBank('SBI')}
                      className="text-[#5F259F] focus:ring-[#5F259F]"
                    />
                  </label>

                  <label
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBank('HDFC');
                    }}
                    className="flex items-center justify-between p-2 rounded-xl bg-white border border-purple-100 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-[10px]">
                        HDFC
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">HDFC Bank ••••9012</p>
                        <p className="text-[10px] text-slate-400">Savings Account</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="bank"
                      checked={selectedBank === 'HDFC'}
                      onChange={() => setSelectedBank('HDFC')}
                      className="text-[#5F259F] focus:ring-[#5F259F]"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Option B: No-Cost EMI */}
            <div
              onClick={() => setPaymentMethod('EMI')}
              className={`p-3 rounded-2xl border cursor-pointer transition ${
                paymentMethod === 'EMI'
                  ? 'border-[#5F259F] bg-purple-50/50 ring-1 ring-[#5F259F]'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">No-Cost EMI (0% Interest)</h4>
                    <p className="text-[11px] text-slate-500">Pay in easy monthly installments</p>
                  </div>
                </div>

                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'EMI'
                      ? 'border-[#5F259F] bg-[#5F259F]'
                      : 'border-slate-300'
                  }`}
                >
                  {paymentMethod === 'EMI' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
              </div>

              {paymentMethod === 'EMI' && (
                <div className="mt-3 pt-2.5 border-t border-purple-200/60 space-y-1.5 text-xs">
                  <div className="grid grid-cols-3 gap-1.5">
                    {([3, 6, 9] as const).map((tenure) => (
                      <button
                        key={tenure}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEmiTenure(tenure);
                        }}
                        className={`p-1.5 rounded-lg border text-center transition ${
                          emiTenure === tenure
                            ? 'bg-[#5F259F] text-white border-[#5F259F]'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        <p className="font-extrabold text-[11px]">
                          ₹{Math.round(finalAmount / tenure).toLocaleString('en-IN')}
                        </p>
                        <p className="text-[9px]">{tenure} Months</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Option C: PhonePe Pay Later */}
            <div
              onClick={() => setPaymentMethod('PayLater')}
              className={`p-3 rounded-2xl border cursor-pointer transition ${
                paymentMethod === 'PayLater'
                  ? 'border-[#5F259F] bg-purple-50/50 ring-1 ring-[#5F259F]'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">PhonePe Pay Later</h4>
                    <p className="text-[11px] text-slate-500">Available Credit: ₹10,000</p>
                  </div>
                </div>

                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'PayLater'
                      ? 'border-[#5F259F] bg-[#5F259F]'
                      : 'border-slate-300'
                  }`}
                >
                  {paymentMethod === 'PayLater' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3. Items Summary Preview */}
        <section className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800">
              Order Items ({cart.length})
            </h4>
            <span className="text-[11px] text-purple-700 font-semibold cursor-pointer" onClick={() => navigateTo('cart')}>
              Edit Cart
            </span>
          </div>

          <div className="space-y-1.5 text-xs divide-y divide-slate-100">
            {cart.map((item) => (
              <div key={item.id} className="pt-1.5 flex justify-between items-center">
                <div className="max-w-[210px]">
                  <p className="font-semibold text-slate-900 truncate">{item.product.name}</p>
                  <p className="text-[10px] text-slate-500">
                    Qty: {item.quantity} {item.warrantyAdded ? '• with PhonePe Protect' : ''}
                  </p>
                </div>
                <span className="font-bold text-slate-900">
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed sm:absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-between z-30 shadow-lg">
        <div>
          <p className="text-[10px] text-slate-500 font-medium">Amount to Pay</p>
          <span className="text-lg font-black text-slate-950">
            ₹{finalAmount.toLocaleString('en-IN')}
          </span>
        </div>

        <button
          onClick={handleProceedToPay}
          className="px-6 py-2.5 bg-[#5F259F] text-white rounded-xl text-xs font-bold hover:bg-[#4d1d82] shadow-md shadow-purple-600/30 transition active:scale-95 flex items-center gap-1.5"
        >
          <span>Pay ₹{finalAmount.toLocaleString('en-IN')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
