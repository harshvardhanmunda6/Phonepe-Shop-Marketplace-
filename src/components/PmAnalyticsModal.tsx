import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  BarChart3,
  TrendingUp,
  Activity,
  RotateCcw,
  Search,
  Eye,
  Scale,
  ShoppingCart,
  CreditCard,
  ShieldCheck,
  Repeat,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const PmAnalyticsModal: React.FC = () => {
  const {
    isAnalyticsModalOpen,
    setIsAnalyticsModalOpen,
    analyticsEvents,
    funnelMetrics,
    resetAnalytics,
  } = useShop();

  if (!isAnalyticsModalOpen) return null;

  const eventConfigs: {
    type: string;
    label: string;
    icon: any;
    count: number;
    color: string;
    bg: string;
  }[] = [
    {
      type: 'search',
      label: 'Searches',
      icon: Search,
      count: funnelMetrics.searches,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200',
    },
    {
      type: 'product_view',
      label: 'Product Views',
      icon: Eye,
      count: funnelMetrics.views,
      color: 'text-purple-600',
      bg: 'bg-purple-50 border-purple-200',
    },
    {
      type: 'compare',
      label: 'Compare Toggled',
      icon: Scale,
      count: funnelMetrics.compare,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-200',
    },
    {
      type: 'add_to_cart',
      label: 'Added to Cart',
      icon: ShoppingCart,
      count: funnelMetrics.cartAdds,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
    },
    {
      type: 'emi_selected',
      label: 'EMI Selected',
      icon: CreditCard,
      count: funnelMetrics.emiSelected,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
    },
    {
      type: 'warranty_attached',
      label: 'Warranty Attached',
      icon: ShieldCheck,
      count: funnelMetrics.warrantyAttached,
      color: 'text-teal-600',
      bg: 'bg-teal-50 border-teal-200',
    },
    {
      type: 'subscription_started',
      label: 'Autopay Subscriptions',
      icon: Repeat,
      count: funnelMetrics.subscriptionsStarted,
      color: 'text-pink-600',
      bg: 'bg-pink-50 border-pink-200',
    },
    {
      type: 'order_placed',
      label: 'Orders Placed',
      icon: CheckCircle2,
      count: funnelMetrics.orders,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50 border-emerald-300',
    },
    {
      type: 'return_requested',
      label: 'Returns / Cancels',
      icon: RotateCcw,
      count: funnelMetrics.returnsRequested,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-200',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full sm:max-w-[440px] max-h-[90vh] rounded-3xl flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <header className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-400/30">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-white">PM Analytics Dashboard</h3>
              <p className="text-[10px] text-slate-400">
                Triggered via header triple-tap • Live session metrics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetAnalytics}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
              title="Reset metrics"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsAnalyticsModalOpen(false)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Scroll View */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-slate-50">

          {/* Funnel Conversion Metrics Card */}
          <section className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                <TrendingUp className="w-4 h-4 text-[#5F259F]" />
                <span>Conversion Funnel Analysis</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Overall: {funnelMetrics.overallConversionRate}%
              </span>
            </div>

            {/* Stepper Funnel Bars */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] mb-1 font-semibold text-slate-700">
                  <span>1. Search to Product View</span>
                  <span className="text-[#5F259F]">{funnelMetrics.searchToViewRate}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#5F259F] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, funnelMetrics.searchToViewRate)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1 font-semibold text-slate-700">
                  <span>2. Product View to Cart Add</span>
                  <span className="text-purple-600">{funnelMetrics.viewToCartRate}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, funnelMetrics.viewToCartRate)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1 font-semibold text-slate-700">
                  <span>3. Cart to Order Placed</span>
                  <span className="text-emerald-600">{funnelMetrics.cartToOrderRate}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, funnelMetrics.cartToOrderRate)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Attach Rates Summary */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-xl bg-purple-50/70 border border-purple-100">
                <p className="text-[10px] text-slate-500 font-medium">EMI Attach Rate</p>
                <p className="text-base font-extrabold text-[#5F259F]">
                  {funnelMetrics.emiAttachRate}%
                </p>
                <p className="text-[9px] text-slate-400">of Cart additions</p>
              </div>

              <div className="p-2 rounded-xl bg-pink-50/70 border border-pink-100">
                <p className="text-[10px] text-slate-500 font-medium">Subscription Rate</p>
                <p className="text-base font-extrabold text-pink-700">
                  {funnelMetrics.subscriptionRate}%
                </p>
                <p className="text-[9px] text-slate-400">Autopay frequency</p>
              </div>
            </div>
          </section>

          {/* 9 Live Event Counters Grid */}
          <section className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Live Session Event Counters
            </h4>

            <div className="grid grid-cols-3 gap-2">
              {eventConfigs.map((evt) => {
                const Icon = evt.icon;
                return (
                  <div
                    key={evt.type}
                    className={`p-2.5 rounded-xl border ${evt.bg} flex flex-col justify-between shadow-2xs`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-4 h-4 ${evt.color}`} />
                      <span className="text-sm font-black text-slate-900">{evt.count}</span>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-700 mt-1 leading-tight">
                      {evt.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Live Event Stream Log */}
          <section className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#5F259F]" />
                Event Stream ({analyticsEvents.length})
              </span>
              <span className="text-[10px] text-slate-400">Most recent first</span>
            </div>

            <div className="space-y-1.5 max-h-44 overflow-y-auto no-scrollbar divide-y divide-slate-100">
              {analyticsEvents.slice(0, 15).map((e) => (
                <div key={e.id} className="pt-1.5 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5F259F]"></span>
                    <span className="font-bold text-slate-800">{e.type}</span>
                    {e.details?.query && (
                      <span className="text-slate-500 text-[10px]">"{e.details.query}"</span>
                    )}
                    {e.details?.name && (
                      <span className="text-slate-500 text-[10px] truncate max-w-[120px]">
                        {e.details.name}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400">
                    {new Date(e.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[10px]">
            In-memory telemetry store
          </span>
          <button
            onClick={() => setIsAnalyticsModalOpen(false)}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800"
          >
            Close Dashboard
          </button>
        </footer>

      </div>
    </div>
  );
};
