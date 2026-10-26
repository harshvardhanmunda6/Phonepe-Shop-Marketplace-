import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShieldAlert,
  Delete,
  Check,
  Lock,
  ArrowLeft,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

export const UpiPinScreen: React.FC = () => {
  const { pendingCheckout, completeOrderViaPin, goBack } = useShop();
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!pendingCheckout) {
    return null;
  }

  const handleDigitPress = (digit: string) => {
    if (isProcessing) return;
    if (pin.length < 4) {
      const next = pin + digit;
      setPin(next);
      if (next.length === 4) {
        // Auto-submit after brief pause
        submitPin(next);
      }
    }
  };

  const handleDelete = () => {
    if (isProcessing) return;
    setPin((prev) => prev.slice(0, -1));
  };

  const submitPin = (pinToSubmit: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      completeOrderViaPin(pinToSubmit);
    }, 1300);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0f141c] text-white select-none">
      {/* Top UPI NPCI Header */}
      <header className="px-4 py-3 bg-[#161d28] border-b border-slate-800 flex items-center justify-between">
        <button
          onClick={goBack}
          disabled={isProcessing}
          className="p-1 rounded text-slate-400 hover:text-white transition disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
            ✓
          </div>
          <span className="text-xs font-bold tracking-wider text-slate-200 uppercase">
            BHIM UPI SECURE
          </span>
        </div>

        <div className="w-6"></div>
      </header>

      {/* Payment Details Banner */}
      <div className="p-4 bg-[#141b24] border-b border-slate-800 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-slate-400">Paying To</p>
          <h3 className="text-sm font-bold text-white">PhonePe Shop Marketplace</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">{pendingCheckout.paymentDetails}</p>
        </div>

        <div className="text-right">
          <p className="text-[11px] text-slate-400">Total Amount</p>
          <p className="text-xl font-black text-emerald-400">
            ₹{pendingCheckout.totalAmount.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Main PIN Prompt */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-3">
          <Lock className="w-3.5 h-3.5" />
          <span>ENTER 4-DIGIT UPI PIN</span>
        </div>

        {/* 4 Masked PIN Dots */}
        <div className="flex gap-4 mb-4">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                  isFilled
                    ? 'bg-emerald-400 border-emerald-400 scale-110 shadow-[0_0_12px_rgba(52,211,153,0.6)]'
                    : 'border-slate-600 bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {/* Security Warning Notice */}
        <div className="flex items-center gap-1.5 text-[11px] text-amber-300/80 bg-amber-950/40 border border-amber-800/40 rounded-xl px-3 py-1.5 max-w-[280px] text-center">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>You are authorizing a direct bank transfer via NPCI UPI</span>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-semibold animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying UPI PIN with bank...</span>
          </div>
        )}
      </div>

      {/* Custom Tactile Numeric Keypad */}
      <div className="bg-[#161d28] border-t border-slate-800 p-3 pt-2">
        <div className="grid grid-cols-3 gap-2 max-w-[340px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigitPress(digit)}
              disabled={isProcessing}
              className="h-13 rounded-2xl bg-[#1d2634] hover:bg-[#253042] active:bg-[#2d3a4f] text-white text-xl font-bold flex items-center justify-center transition shadow-xs disabled:opacity-50"
            >
              {digit}
            </button>
          ))}

          {/* Delete / Backspace */}
          <button
            onClick={handleDelete}
            disabled={isProcessing || pin.length === 0}
            className="h-13 rounded-2xl bg-[#1d2634] hover:bg-[#253042] active:bg-[#2d3a4f] text-slate-400 hover:text-white flex items-center justify-center transition disabled:opacity-30"
          >
            <Delete className="w-6 h-6" />
          </button>

          {/* Digit 0 */}
          <button
            onClick={() => handleDigitPress('0')}
            disabled={isProcessing}
            className="h-13 rounded-2xl bg-[#1d2634] hover:bg-[#253042] active:bg-[#2d3a4f] text-white text-xl font-bold flex items-center justify-center transition shadow-xs disabled:opacity-50"
          >
            0
          </button>

          {/* Submit Checkmark Button */}
          <button
            onClick={() => pin.length === 4 && submitPin(pin)}
            disabled={isProcessing || pin.length < 4}
            className="h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold flex items-center justify-center transition disabled:opacity-30 shadow-md shadow-emerald-900/40"
          >
            <Check className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        <p className="text-[10px] text-center text-slate-500 mt-2 font-medium">
          NPCI Unified Payments Interface 2.0 • Secured by 256-bit encryption
        </p>
      </div>
    </div>
  );
};
