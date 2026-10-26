import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  QrCode,
  Bell,
  HelpCircle,
  Smartphone,
  Building2,
  UserCheck,
  CreditCard,
  Tv,
  Zap,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Percent,
  Search,
  History,
  Store,
  Layers,
  Award,
} from 'lucide-react';

export const PhonePeHomeScreen: React.FC = () => {
  const { navigateTo, orders, showToast } = useShop();

  return (
    <div className="flex-1 flex flex-col bg-[#F3F4F8] pb-14">
      {/* PhonePe Header with Purple Gradient */}
      <header className="bg-gradient-to-b from-[#5F259F] to-[#4c1c80] text-white pt-2 pb-4 px-4 rounded-b-2xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold text-sm shadow-inner">
              HM
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm">HSR Layout, Bengaluru</span>
                <span className="text-[10px] bg-white/20 px-1 rounded text-white/90">▼</span>
              </div>
              <p className="text-[11px] text-purple-200">PhonePe UPI ID: 9876543210@ybl</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => showToast('QR Scanner opened (Simulation)', 'info')}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition"
              title="Scan QR"
            >
              <QrCode className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => showToast('No new notifications', 'info')}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full"></span>
            </button>
            <button
              onClick={() => showToast('24/7 PhonePe Support active', 'info')}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition"
              title="Help"
            >
              <HelpCircle className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Home Sections */}
      <div className="p-3.5 space-y-3.5 -mt-2">

        {/* PROMINENT SHOP MARKETPLACE BANNER (Primary Task requirement) */}
        <section
          onClick={() => navigateTo('shop_home')}
          className="relative overflow-hidden bg-gradient-to-r from-[#5F259F] via-[#7B2CBF] to-[#9D4EDD] rounded-2xl p-4 text-white shadow-lg cursor-pointer transform active:scale-[0.99] transition duration-200 border border-purple-300/30 group"
        >
          {/* Background Ambient Glow */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
          
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1 max-w-[210px]">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-slate-950" />
                <span>NEW ON PHONEPE</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white leading-tight">
                PhonePe <span className="underline decoration-amber-300">Shop</span>
              </h2>
              <p className="text-xs text-purple-100 font-medium leading-snug">
                Buy Verified Electronics & Beauty items at direct UPI prices!
              </p>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-inner group-hover:scale-105 transition">
                <ShoppingBag className="w-7 h-7 text-amber-300" />
              </div>
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-white/20 flex items-center justify-between relative z-10 text-[11px]">
            <div className="flex items-center gap-2 text-purple-100">
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                Verified Sellers
              </span>
              <span>•</span>
              <span className="font-medium text-amber-200">No-Cost EMI & UPI Autopay</span>
            </div>
            <div className="flex items-center gap-0.5 font-bold text-white bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg">
              <span>Open</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </section>

        {/* Transfer Money Card */}
        <section className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Transfer Money
            </h3>
            <span className="text-[11px] font-medium text-[#5F259F]">UPI Enabled</span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <button
              onClick={() => showToast('Enter Mobile Number to send money', 'info')}
              className="flex flex-col items-center gap-1.5 p-1 rounded-xl hover:bg-slate-50 transition"
            >
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#5F259F] flex items-center justify-center border border-purple-100">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-slate-700 leading-tight">To Mobile Number</span>
            </button>

            <button
              onClick={() => showToast('Enter Bank Account or UPI ID', 'info')}
              className="flex flex-col items-center gap-1.5 p-1 rounded-xl hover:bg-slate-50 transition"
            >
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#5F259F] flex items-center justify-center border border-purple-100">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-slate-700 leading-tight">To Bank / UPI ID</span>
            </button>

            <button
              onClick={() => showToast('Transfer between self accounts', 'info')}
              className="flex flex-col items-center gap-1.5 p-1 rounded-xl hover:bg-slate-50 transition"
            >
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#5F259F] flex items-center justify-center border border-purple-100">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-slate-700 leading-tight">To Self Account</span>
            </button>

            <button
              onClick={() => showToast('SBI ••••4821 Balance: ₹42,850.50')}
              className="flex flex-col items-center gap-1.5 p-1 rounded-xl hover:bg-slate-50 transition"
            >
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#5F259F] flex items-center justify-center border border-purple-100">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-slate-700 leading-tight">Check Balance</span>
            </button>
          </div>
        </section>

        {/* Quick Shopping Shortcuts inside PhonePe */}
        <section className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950">Deals on PhonePe UPI</p>
              <p className="text-[11px] text-amber-800">Flat ₹250 instant cashback on Electronics & Beauty</p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('shop_home')}
            className="text-xs font-bold text-[#5F259F] bg-white px-2.5 py-1.5 rounded-lg border border-purple-200 shrink-0 shadow-2xs"
          >
            Explore
          </button>
        </section>

        {/* Recharge & Pay Bills */}
        <section className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recharge & Pay Bills
            </h3>
            <span className="text-[11px] font-medium text-[#5F259F] cursor-pointer hover:underline" onClick={() => showToast('View all billers')}>
              View All
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <button
              onClick={() => showToast('Mobile Recharge: Jio, Airtel, Vi', 'info')}
              className="flex flex-col items-center gap-1.5 p-1 rounded-xl hover:bg-slate-50"
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-50 text-[#5F259F] flex items-center justify-center border border-slate-200">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="text-[11px] text-slate-700">Mobile</span>
            </button>

            <button
              onClick={() => showToast('DTH recharge Tata Play, Sun Direct', 'info')}
              className="flex flex-col items-center gap-1.5 p-1 rounded-xl hover:bg-slate-50"
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-50 text-[#5F259F] flex items-center justify-center border border-slate-200">
                <Tv className="w-4 h-4" />
              </div>
              <span className="text-[11px] text-slate-700">DTH</span>
            </button>

            <button
              onClick={() => showToast('Electricity bill payment BESCOM', 'info')}
              className="flex flex-col items-center gap-1.5 p-1 rounded-xl hover:bg-slate-50"
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-50 text-[#5F259F] flex items-center justify-center border border-slate-200">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-[11px] text-slate-700">Electricity</span>
            </button>

            <button
              onClick={() => showToast('Credit Card Bill via UPI', 'info')}
              className="flex flex-col items-center gap-1.5 p-1 rounded-xl hover:bg-slate-50"
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-50 text-[#5F259F] flex items-center justify-center border border-slate-200">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-[11px] text-slate-700">Credit Card</span>
            </button>
          </div>
        </section>

        {/* Active Orders Quick Peek */}
        {orders.length > 0 && (
          <section
            onClick={() => navigateTo('orders')}
            className="bg-white rounded-2xl p-3 shadow-sm border border-purple-100 flex items-center justify-between cursor-pointer hover:bg-purple-50/40 transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#5F259F] flex items-center justify-center">
                <History className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Track {orders.length} Shop Order{orders.length > 1 ? 's' : ''}
                </p>
                <p className="text-[11px] text-slate-500">
                  Latest: {orders[0].items[0]?.product.name.slice(0, 22)}... ({orders[0].status})
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </section>
        )}
      </div>

      {/* Bottom PhonePe Nav Bar */}
      <nav className="fixed sm:absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around z-30 shadow-md">
        <button className="flex flex-col items-center gap-0.5 text-[#5F259F]">
          <Layers className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button
          onClick={() => navigateTo('shop_home')}
          className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[#5F259F] relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#5F259F]" />
            <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-900 font-extrabold text-[8px] px-1 rounded-full">
              NEW
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#5F259F]">Shop</span>
        </button>
        <button
          onClick={() => showToast('Insurance services', 'info')}
          className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[#5F259F]"
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px]">Insurance</span>
        </button>
        <button
          onClick={() => showToast('Wealth & Gold investments', 'info')}
          className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[#5F259F]"
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px]">Wealth</span>
        </button>
        <button
          onClick={() => navigateTo('orders')}
          className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[#5F259F]"
        >
          <History className="w-5 h-5" />
          <span className="text-[10px]">History</span>
        </button>
      </nav>
    </div>
  );
};
