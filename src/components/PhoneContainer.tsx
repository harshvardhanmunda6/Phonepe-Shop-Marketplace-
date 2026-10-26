import React, { useState, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { Wifi, BatteryMedium, Signal, BarChart3, Bot, ShoppingBag } from 'lucide-react';

interface PhoneContainerProps {
  children: React.ReactNode;
}

export const PhoneContainer: React.FC<PhoneContainerProps> = ({ children }) => {
  const {
    currentScreen,
    navigateTo,
    cartItemCount,
    setIsAiModalOpen,
    setIsAnalyticsModalOpen,
    toasts,
    dismissToast,
  } = useShop();

  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Triple-tap on top bar triggers PM Analytics Panel
  const handleHeaderTap = () => {
    setClickCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        setIsAnalyticsModalOpen(true);
        return 0;
      }
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => {
        setClickCount(0);
      }, 500);
      return next;
    });
  };

  const isMarketplace = currentScreen !== 'phonepe_home' && currentScreen !== 'upi_pin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#1e1330] to-slate-900 flex flex-col items-center justify-center p-0 sm:p-4 text-slate-800 font-sans selection:bg-[#5F259F]/20">
      
      {/* Desktop Helper Banner */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-[840px] mb-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 text-white/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-purple-300">PhonePe Shop Marketplace Prototype</span>
          <span className="text-white/40">•</span>
          <span className="text-white/60">390px Mobile Viewport</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAnalyticsModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/30 rounded-lg text-purple-200 text-xs transition"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Open PM Analytics (or triple-tap header)</span>
          </button>
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/30 rounded-lg text-emerald-200 text-xs transition"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask AI Assistant</span>
          </button>
        </div>
      </div>

      {/* 390px Mobile Device Frame */}
      <div className="relative w-full sm:w-[390px] h-[100dvh] sm:h-[844px] bg-white sm:rounded-[42px] shadow-2xl sm:shadow-[0_25px_60px_-15px_rgba(95,37,159,0.4)] overflow-hidden flex flex-col border-0 sm:border-[8px] sm:border-slate-800">
        
        {/* Dynamic Island / Top Notch */}
        <div
          onClick={handleHeaderTap}
          title="Triple tap here for PM Analytics"
          className="cursor-pointer select-none relative z-50 bg-[#5F259F] text-white pt-2.5 pb-2 px-5 flex items-center justify-between text-xs font-semibold shrink-0"
        >
          {/* Time */}
          <span className="text-[13px] font-medium tracking-tight">9:41</span>
          
          {/* Speaker / Notch simulator */}
          <div className="h-4 w-20 bg-black/25 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-white/10 mr-1.5"></div>
            <div className="w-8 h-1 rounded-full bg-white/20"></div>
          </div>

          {/* Icons: 5G, Wifi, Battery */}
          <div className="flex items-center gap-1.5 text-white/90">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px]">98%</span>
              <BatteryMedium className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Global Toast Floating Notifications */}
        <div className="absolute top-12 left-3 right-3 z-50 pointer-events-none flex flex-col gap-1.5">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              onClick={() => dismissToast(toast.id)}
              className="pointer-events-auto shadow-lg rounded-xl px-3.5 py-2.5 text-xs flex items-center justify-between text-white bg-slate-900/95 backdrop-blur-md border border-white/10 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0"></span>
                <span>{toast.text}</span>
              </div>
              <span className="text-white/40 text-[10px] ml-2">tap to dismiss</span>
            </div>
          ))}
        </div>

        {/* Main Screen Content Viewport */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 flex flex-col relative no-scrollbar">
          {children}
        </main>

        {/* Floating Quick Navigation & Shop Assistant pill if in shop */}
        {isMarketplace && (
          <div className="absolute bottom-6 right-3.5 z-40 flex flex-col items-end gap-2 pointer-events-none">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="pointer-events-auto flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#5F259F] to-[#7b2cbf] text-white rounded-full shadow-lg shadow-purple-600/40 hover:scale-105 active:scale-95 transition text-xs font-semibold border border-purple-400/40"
            >
              <Bot className="w-4 h-4 text-purple-200" />
              <span>Ask AI Shop</span>
            </button>
          </div>
        )}

        {/* Phone Bottom Home Bar Indicator */}
        <footer className="bg-white border-t border-slate-100 py-1.5 px-4 flex flex-col items-center justify-center shrink-0">
          <div className="flex items-center justify-between w-full text-[10px] text-slate-400 mb-0.5">
            <span>Prototype, mock data</span>
            <button
              onClick={() => setIsAnalyticsModalOpen(true)}
              className="hover:text-[#5F259F] underline font-medium"
            >
              PM Analytics
            </button>
          </div>
          <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
        </footer>
      </div>

    </div>
  );
};
