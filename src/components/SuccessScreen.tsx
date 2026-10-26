import React, { useEffect, useState } from 'react';
import { useShop } from '../context/ShopContext';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Gift,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Copy,
  Clock,
} from 'lucide-react';

export const SuccessScreen: React.FC = () => {
  const { lastCompletedOrder, navigateTo, showToast } = useShop();
  const [isScratched, setIsScratched] = useState(false);

  useEffect(() => {
    // Fire confetti on payment success
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#5F259F', '#00B56A', '#FFA800', '#FFFFFF'],
      });
    } catch (err) {
      // Ignore if confetti fails
    }
  }, []);

  if (!lastCompletedOrder) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm text-slate-600 mb-3">No recent transaction</p>
        <button
          onClick={() => navigateTo('shop_home')}
          className="bg-[#5F259F] text-white text-xs font-bold px-4 py-2 rounded-xl"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  const handleScratch = () => {
    if (!isScratched) {
      setIsScratched(true);
      try {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#FFA800', '#5F259F'],
        });
      } catch (e) {}
      showToast('🎉 You won ₹75 PhonePe Cashback!');
    }
  };

  const copyTxId = () => {
    navigator.clipboard?.writeText(lastCompletedOrder.transactionId);
    showToast('Transaction ID copied to clipboard');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 pb-20">
      {/* Top Celebratory Header */}
      <div className="bg-gradient-to-b from-emerald-600 to-teal-700 text-white pt-6 pb-8 px-4 text-center rounded-b-3xl shadow-md relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center mx-auto mb-3 shadow-inner">
          <CheckCircle2 className="w-10 h-10 text-white stroke-[2.5]" />
        </div>

        <h1 className="text-xl font-black tracking-tight">Payment Successful!</h1>
        <p className="text-xs text-emerald-100 mt-1">
          ₹{lastCompletedOrder.totalAmount.toLocaleString('en-IN')} paid via {lastCompletedOrder.paymentDetails}
        </p>

        <div className="mt-3 inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] text-emerald-100">
          <span>Txn ID: {lastCompletedOrder.transactionId}</span>
          <button onClick={copyTxId} className="hover:text-white" title="Copy">
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="p-3.5 space-y-3.5 -mt-3">

        {/* Delivery Timeline Guarantee */}
        <section className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Order Confirmed: {lastCompletedOrder.orderNumber}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Verified Seller dispatch in progress
                </p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              PLACED
            </span>
          </div>

          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#5F259F] shrink-0" />
            <span>Estimated delivery to <strong>{lastCompletedOrder.shippingAddress.city}</strong> in <strong>2 business days</strong></span>
          </p>
        </section>

        {/* Interactive Scratch Card Reward */}
        <section className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-amber-200" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider">
                PhonePe Rewards
              </h4>
            </div>
            <span className="text-[10px] bg-black/25 px-2 py-0.5 rounded-full font-bold">
              Guaranteed Win
            </span>
          </div>

          {!isScratched ? (
            <div
              onClick={handleScratch}
              className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-4 text-center cursor-pointer hover:bg-white/30 transition group select-none shadow-inner"
            >
              <div className="w-10 h-10 rounded-full bg-white text-amber-600 flex items-center justify-center mx-auto mb-2 shadow-sm group-hover:scale-110 transition">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-white">Tap to scratch your reward card!</p>
              <p className="text-[10px] text-amber-100 mt-0.5">Win up to ₹100 instant UPI cashback</p>
            </div>
          ) : (
            <div className="bg-white text-slate-900 rounded-xl p-3.5 text-center shadow-inner animate-in zoom-in-95 duration-200">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] uppercase mb-1">
                Cashback Credited
              </div>
              <p className="text-xl font-black text-[#5F259F]">₹75 Flat Cashback</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Directly added to your linked bank account via UPI
              </p>
            </div>
          )}
        </section>

        {/* Ordered Items Preview */}
        <section className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2">
          <h4 className="text-xs font-bold text-slate-700">Items Ordered</h4>
          <div className="space-y-2 text-xs divide-y divide-slate-100">
            {lastCompletedOrder.items.map((item) => (
              <div key={item.id} className="pt-2 flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{item.product.name}</p>
                  <p className="text-[10px] text-slate-500">
                    Qty: {item.quantity} • ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    {item.isSubscription ? ' (UPI Autopay active)' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => navigateTo('orders')}
            className="w-full py-3 bg-[#5F259F] hover:bg-[#4d1d82] text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30 transition flex items-center justify-center gap-1.5"
          >
            <span>Track Order Timeline</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigateTo('shop_home')}
            className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
};
