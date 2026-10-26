import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  Bot,
  Send,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Star,
  Loader2,
} from 'lucide-react';
import { Product } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  recommendedProducts?: Product[];
  timestamp: string;
}

export const AiAssistantModal: React.FC = () => {
  const {
    isAiModalOpen,
    setIsAiModalOpen,
    products,
    openProductDetail,
    addToCart,
  } = useShop();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'Namaste! I am your PhonePe Shop Assistant. How can I help you discover the best electronics and personal care products today?',
      timestamp: 'Just now',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isAiModalOpen) return null;

  // Prepare catalog context string for Gemini
  const catalogContext = products
    .map(
      (p) =>
        `ID: ${p.id} | Name: ${p.name} | Category: ${p.category} (${p.subcategory}) | Brand: ${p.brand} | Price: ₹${p.price} (MRP: ₹${p.originalPrice}) | Rating: ${p.rating}★ | Key features: ${p.features.join(', ')}`
    )
    .join('\n');

  // Scripted Fallback generator when Gemini key is not present or offline
  const getScriptedResponse = (query: string): { text: string; productIds: string[] } => {
    const q = query.toLowerCase();

    if (q.includes('15000') || q.includes('phone') || q.includes('5g') || q.includes('mobile')) {
      return {
        text: 'For budget 5G smartphones under ₹15,000–₹16,500, the Redmi Note 13 5G and Realme Narzo 70 Pro 5G are top-rated picks with 120Hz AMOLED displays and fast charging.',
        productIds: ['elec-1', 'elec-2'],
      };
    }

    if (q.includes('headphone') || q.includes('boat') || q.includes('earbuds') || q.includes('audio') || q.includes('anc')) {
      return {
        text: 'For immersive sound with Active Noise Cancellation, I recommend boAt Nirvana Ion ANC with an incredible 120-hour battery or the lightweight OnePlus Bullets Z2 ANC.',
        productIds: ['elec-3', 'elec-5', 'elec-4'],
      };
    }

    if (q.includes('sunscreen') || q.includes('sun') || q.includes('spf')) {
      return {
        text: 'The Dot & Key Watermelon Cooling Sunscreen SPF 50+ has zero white cast, broad PA++++ UVA/UVB protection, and you can save 5% with UPI Autopay.',
        productIds: ['beauty-2'],
      };
    }

    if (q.includes('serum') || q.includes('acne') || q.includes('skin') || q.includes('niacinamide')) {
      return {
        text: 'Minimalist 10% Niacinamide Serum is our top-selling verified skincare item. It balances sebum, fades blemishes, and is safe for daily use.',
        productIds: ['beauty-1', 'beauty-2'],
      };
    }

    if (q.includes('laptop') || q.includes('student') || q.includes('coding') || q.includes('college')) {
      return {
        text: 'The ASUS Vivobook 15 Student Edition features a 12th Gen Intel Core i3, 512GB NVMe SSD, and pre-installed MS Office with No-Cost EMI starting from ₹4,332/mo.',
        productIds: ['elec-8'],
      };
    }

    if (q.includes('watch') || q.includes('fitness') || q.includes('amoled') || q.includes('smartwatch')) {
      return {
        text: 'Check out the Noise ColorFit Pro 5 with a 1.85" AMOLED display and TruSync calling, or Fire-Boltt Invincible Plus which lets you store songs offline.',
        productIds: ['elec-6', 'elec-7'],
      };
    }

    if (q.includes('trimmer') || q.includes('beard') || q.includes('men') || q.includes('grooming')) {
      return {
        text: 'For men\'s grooming, the Bombay Shaving Co 6-in-1 Waterproof Trimmer and Beardo Godfather Beard Oil make a great combo for sharp grooming.',
        productIds: ['beauty-7', 'beauty-8'],
      };
    }

    if (q.includes('hair') || q.includes('shampoo') || q.includes('oil')) {
      return {
        text: 'For strong and frizz-free hair, Mamaearth Onion Hair Oil reduces hair fall, and Tresemme Keratin Smooth with Argan Oil keeps hair sleek for up to 72 hours.',
        productIds: ['beauty-5', 'beauty-6'],
      };
    }

    if (q.includes('autopay') || q.includes('subscribe')) {
      return {
        text: 'UPI Autopay lets you schedule automatic recurring deliveries for skincare and beauty products every 30, 60, or 90 days. You get an automatic 5% discount on every replenishment, with zero convenience fees and the freedom to pause or cancel anytime.',
        productIds: ['beauty-1', 'beauty-2'],
      };
    }

    // Default general recommendation
    return {
      text: 'Here are our top customer favorites across Electronics and Beauty with verified seller authenticity and direct PhonePe UPI savings!',
      productIds: ['elec-1', 'beauty-1', 'elec-3'],
    };
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Call server endpoint
      const response = await fetch('/api/gemini/shop-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          catalogContext,
          chatHistory: messages.map((m) => ({ role: m.sender, text: m.text })),
        }),
      });

      const data = await response.json();

      let replyText = '';
      let matchedProducts: Product[] = [];

      if (!data.fallback && data.reply) {
        replyText = data.reply;
        if (data.recommendedProductIds && Array.isArray(data.recommendedProductIds)) {
          matchedProducts = products.filter((p) =>
            data.recommendedProductIds.includes(p.id)
          );
        }
      } else {
        // Fallback to rich scripted engine
        const scripted = getScriptedResponse(textToSend);
        replyText = scripted.text;
        matchedProducts = products.filter((p) => scripted.productIds.includes(p.id));
      }

      // If no matched products returned by API but keyword matches exist
      if (matchedProducts.length === 0) {
        const scripted = getScriptedResponse(textToSend);
        matchedProducts = products.filter((p) => scripted.productIds.includes(p.id));
      }

      const botMessage: Message = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: replyText,
        recommendedProducts: matchedProducts,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      // Network/parse fallback
      const scripted = getScriptedResponse(textToSend);
      const botMessage: Message = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: scripted.text,
        recommendedProducts: products.filter((p) => scripted.productIds.includes(p.id)),
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full sm:max-w-[390px] h-[90dvh] sm:h-[720px] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl border border-purple-200 overflow-hidden">
        
        {/* Header */}
        <header className="bg-gradient-to-r from-[#5F259F] to-[#7B2CBF] text-white px-4 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-white">Ask PhonePe Shop</h3>
              <p className="text-[10px] text-purple-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Powered by Gemini AI • Catalog Advisor</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Chat Messages */}
        <div ref={scrollRef} className="flex-1 p-3.5 space-y-3 overflow-y-auto bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-[#5F259F] text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>

              {/* Recommended Product Cards inside Chat */}
              {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                <div className="mt-2 space-y-1.5 w-full max-w-[90%]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#5F259F]" />
                    <span>Recommended for You:</span>
                  </p>
                  <div className="space-y-1.5">
                    {msg.recommendedProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setIsAiModalOpen(false);
                          openProductDetail(p);
                        }}
                        className="bg-white rounded-xl p-2 border border-purple-200/80 shadow-2xs hover:border-[#5F259F] cursor-pointer flex gap-2.5 items-center transition group"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-bold text-purple-700 uppercase">
                            {p.brand}
                          </p>
                          <h5 className="font-semibold text-[11px] text-slate-900 truncate">
                            {p.name}
                          </h5>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-bold text-xs text-slate-950">
                              ₹{p.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-amber-500 font-semibold flex items-center">
                              <Star className="w-2.5 h-2.5 fill-amber-400 stroke-none mr-0.5" />
                              {p.rating}
                            </span>
                          </div>
                        </div>
                        <div className="p-1 rounded-lg bg-purple-50 text-[#5F259F] group-hover:bg-[#5F259F] group-hover:text-white transition">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-purple-700 font-medium bg-white p-2.5 rounded-xl border border-purple-100 max-w-[200px] animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-[#5F259F]" />
              <span>Checking PhonePe catalog...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompts */}
        <div className="bg-white border-t border-slate-100 p-2 overflow-x-auto no-scrollbar flex gap-1.5">
          {[
            'Budget 5G phone under ₹15,000',
            'boAt headphones with ANC',
            'Best sunscreen SPF 50',
            'College student laptop',
            'How does UPI Autopay work?',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="shrink-0 text-[10px] font-medium bg-purple-50 hover:bg-purple-100 text-[#5F259F] px-2.5 py-1 rounded-full border border-purple-200 transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about specs, prices, recommendations..."
            className="flex-1 px-3 py-2 bg-slate-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#5F259F] focus:bg-white border border-transparent focus:border-purple-300 transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2 bg-[#5F259F] hover:bg-[#4d1d82] text-white rounded-xl disabled:opacity-40 transition shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
