import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ArrowLeft,
  Package,
  Repeat,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  XCircle,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { Order, Subscription } from '../types';

export const OrdersScreen: React.FC = () => {
  const {
    orders,
    subscriptions,
    cancelOrder,
    returnOrder,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    goBack,
    navigateTo,
    openProductDetail,
    showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'subscriptions'>('orders');

  // Cancel order modal
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('Ordered by mistake');

  // Return order modal
  const [returningOrderId, setReturningOrderId] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('Defective item / Damaged');

  const handleConfirmCancel = () => {
    if (cancellingOrderId) {
      cancelOrder(cancellingOrderId, cancelReason);
      setCancellingOrderId(null);
    }
  };

  const handleConfirmReturn = () => {
    if (returningOrderId) {
      returnOrder(returningOrderId, returnReason);
      setReturningOrderId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-2xs px-3.5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xs font-bold text-slate-900">Orders & Subscriptions</h2>
        </div>

        <button
          onClick={() => navigateTo('shop_home')}
          className="text-xs font-bold text-[#5F259F] hover:underline"
        >
          Shop More
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-3.5 flex gap-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'border-[#5F259F] text-[#5F259F]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`py-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'subscriptions'
              ? 'border-[#5F259F] text-[#5F259F]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Repeat className="w-4 h-4" />
          <span>UPI Autopay Subscriptions ({subscriptions.filter((s) => s.status !== 'cancelled').length})</span>
        </button>
      </div>

      <div className="p-3.5 space-y-3.5">

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-3.5">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
                <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No orders placed yet</p>
                <button
                  onClick={() => navigateTo('shop_home')}
                  className="mt-3 bg-[#5F259F] text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              orders.map((order) => {
                const isDelivered = order.status === 'delivered';
                const isCancelled = order.status === 'cancelled';
                const isReturned = order.status === 'returned';
                const canCancel = !isDelivered && !isCancelled && !isReturned;
                const canReturn = isDelivered;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3"
                  >
                    {/* Order Meta Header */}
                    <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-slate-900">
                            {order.orderNumber}
                          </span>
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              isDelivered
                                ? 'bg-emerald-100 text-emerald-800'
                                : isCancelled
                                ? 'bg-rose-100 text-rose-800'
                                : isReturned
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{order.date}</p>
                      </div>

                      <div className="text-right">
                        <span className="font-extrabold text-xs text-slate-900">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </span>
                        <p className="text-[10px] text-slate-500">{order.paymentDetails}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => openProductDetail(item.product)}
                          className="flex gap-2.5 items-center cursor-pointer group"
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-xs text-slate-900 truncate group-hover:text-[#5F259F]">
                              {item.product.name}
                            </h4>
                            <p className="text-[10px] text-slate-500">
                              Qty: {item.quantity} • ₹{item.product.price.toLocaleString('en-IN')}
                              {item.warrantyAdded && ' • 1-Yr PhonePe Protect'}
                              {item.isSubscription && ' • UPI Autopay'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Status Stepper Timeline */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Live Tracking Timeline
                      </p>

                      <div className="space-y-2">
                        {order.timeline.map((step, idx) => (
                          <div key={idx} className="flex gap-2.5 items-start relative">
                            {/* Line connector */}
                            {idx < order.timeline.length - 1 && (
                              <div
                                className={`absolute left-2.5 top-5 bottom-0 w-0.5 -mb-2 ${
                                  step.completed ? 'bg-emerald-500' : 'bg-slate-200'
                                }`}
                              />
                            )}

                            {/* Dot Icon */}
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] z-10 ${
                                step.completed
                                  ? 'bg-emerald-600 text-white'
                                  : step.current
                                  ? 'bg-[#5F259F] text-white animate-pulse'
                                  : 'bg-slate-200 text-slate-400'
                              }`}
                            >
                              {step.completed ? '✓' : idx + 1}
                            </div>

                            <div className="flex-1 text-xs">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`font-bold ${
                                    step.completed
                                      ? 'text-slate-900'
                                      : step.current
                                      ? 'text-[#5F259F]'
                                      : 'text-slate-400'
                                  }`}
                                >
                                  {step.label}
                                </span>
                                <span className="text-[10px] text-slate-400">{step.timestamp}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified Merchant</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {canCancel && (
                          <button
                            onClick={() => setCancellingOrderId(order.id)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition"
                          >
                            Cancel Order
                          </button>
                        )}

                        {canReturn && (
                          <button
                            onClick={() => setReturningOrderId(order.id)}
                            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#5F259F] border border-purple-200 rounded-lg text-xs font-semibold transition"
                          >
                            Return / Refund
                          </button>
                        )}

                        {(isCancelled || isReturned) && (
                          <span className="text-xs font-semibold text-slate-400 italic">
                            Refund processed to UPI
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: ACTIVE SUBSCRIPTIONS */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-3.5">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-2xl border border-purple-200/80 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#5F259F] text-white flex items-center justify-center font-bold text-xs shrink-0">
                <Repeat className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900">PhonePe UPI Autopay Mandates</p>
                <p className="text-[11px] text-slate-600">
                  Recurring deliveries with 5% discount automatically debited via UPI.
                </p>
              </div>
            </div>

            {subscriptions.map((sub) => {
              const isPaused = sub.status === 'paused';
              const isCancelled = sub.status === 'cancelled';

              return (
                <div
                  key={sub.id}
                  className={`bg-white rounded-2xl p-4 border shadow-2xs space-y-3 transition ${
                    isCancelled ? 'opacity-60 border-slate-200' : 'border-purple-200/90'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={sub.product.images[0]}
                        alt={sub.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-pink-700 uppercase">
                          {sub.product.brand}
                        </span>
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                            isPaused
                              ? 'bg-amber-100 text-amber-800'
                              : isCancelled
                              ? 'bg-slate-200 text-slate-600'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 truncate">
                        {sub.product.name}
                      </h4>

                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="font-extrabold text-sm text-slate-950">
                          ₹{sub.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                          5% Off
                        </span>
                        <span className="text-[10px] text-slate-500">
                          / every {sub.frequencyDays} days
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#5F259F]" />
                        <span>Next Scheduled Delivery & Debit:</span>
                      </span>
                      <strong className="text-slate-900">{sub.nextDebitDate}</strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 text-[10px]">
                      <span>Mandate ID:</span>
                      <span className="font-mono">{sub.upiAutopayMandate}</span>
                    </div>
                  </div>

                  {!isCancelled && (
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => {
                          showToast(`Next delivery for ${sub.product.name.slice(0, 15)}... skipped`);
                        }}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold"
                      >
                        Skip Next Delivery
                      </button>

                      <button
                        onClick={() =>
                          isPaused ? resumeSubscription(sub.id) : pauseSubscription(sub.id)
                        }
                        className="px-2.5 py-1 text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-[11px] font-semibold"
                      >
                        {isPaused ? 'Resume' : 'Pause'}
                      </button>

                      <button
                        onClick={() => cancelSubscription(sub.id)}
                        className="px-2.5 py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-[11px] font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Cancel Order Modal */}
      {cancellingOrderId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-xs rounded-3xl p-4 space-y-3 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">Cancel Order</h3>
            </div>

            <p className="text-xs text-slate-600">
              Please choose a reason for cancellation. Any UPI payment made will be refunded to your source account immediately.
            </p>

            <div className="space-y-1.5 text-xs">
              {[
                'Ordered by mistake',
                'Found cheaper price elsewhere',
                'Delivery date is too late',
                'Need to change shipping address',
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    checked={cancelReason === reason}
                    onChange={() => setCancelReason(reason)}
                    className="text-[#5F259F] focus:ring-[#5F259F]"
                  />
                  <span className="text-slate-800 font-medium">{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCancellingOrderId(null)}
                className="flex-1 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700 shadow-xs"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Order Modal */}
      {returningOrderId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-xs rounded-3xl p-4 space-y-3 shadow-2xl">
            <div className="flex items-center gap-2 text-purple-600">
              <RotateCcw className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">Return & Instant UPI Refund</h3>
            </div>

            <p className="text-xs text-slate-600">
              Verified courier will pick up within 24 hours. Your ₹ refund will be credited directly to your bank account.
            </p>

            <div className="space-y-1.5 text-xs">
              {[
                'Defective item / Damaged',
                'Wrong product or shade received',
                'Performance not as expected',
                'Packaging opened or missing seal',
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="returnReason"
                    checked={returnReason === reason}
                    onChange={() => setReturnReason(reason)}
                    className="text-[#5F259F] focus:ring-[#5F259F]"
                  />
                  <span className="text-slate-800 font-medium">{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setReturningOrderId(null)}
                className="flex-1 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200"
              >
                Back
              </button>
              <button
                onClick={handleConfirmReturn}
                className="flex-1 py-2 text-xs font-bold bg-[#5F259F] text-white rounded-xl hover:bg-[#4d1d82] shadow-xs"
              >
                Request Pickup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
