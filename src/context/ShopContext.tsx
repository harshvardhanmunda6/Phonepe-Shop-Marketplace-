import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  Subscription,
  Address,
  AnalyticsEvent,
  AnalyticsEventType,
  FunnelMetrics,
} from '../types';
import {
  MOCK_PRODUCTS,
  MOCK_ADDRESSES,
  MOCK_ORDERS_INITIAL,
  MOCK_SUBSCRIPTIONS_INITIAL,
} from '../data/mockData';

export type ScreenName =
  | 'phonepe_home'
  | 'shop_home'
  | 'search'
  | 'product_detail'
  | 'compare'
  | 'cart'
  | 'checkout'
  | 'upi_pin'
  | 'success'
  | 'orders';

interface PendingCheckout {
  paymentMethod: 'UPI' | 'EMI' | 'PayLater';
  paymentDetails: string;
  totalAmount: number;
  items: CartItem[];
  address: Address;
}

interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'warning';
}

interface ShopContextType {
  // Navigation
  currentScreen: ScreenName;
  navigationHistory: ScreenName[];
  navigateTo: (screen: ScreenName) => void;
  goBack: () => void;

  // Catalog & Products
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  openProductDetail: (product: Product) => void;

  // Compare products (up to 3)
  compareList: Product[];
  toggleCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    options?: {
      warrantyAdded?: boolean;
      isSubscription?: boolean;
      subscriptionFrequency?: 30 | 60 | 90;
      emiMonths?: number | null;
    }
  ) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
  cartItemCount: number;

  // Checkout & Orders
  addresses: Address[];
  selectedAddress: Address;
  setSelectedAddress: (addr: Address) => void;
  pendingCheckout: PendingCheckout | null;
  startCheckout: (method: 'UPI' | 'EMI' | 'PayLater', details: string) => void;
  completeOrderViaPin: (enteredPin: string) => void;
  orders: Order[];
  lastCompletedOrder: Order | null;
  cancelOrder: (orderId: string, reason: string) => void;
  returnOrder: (orderId: string, reason: string) => void;

  // Subscriptions
  subscriptions: Subscription[];
  pauseSubscription: (subId: string) => void;
  resumeSubscription: (subId: string) => void;
  cancelSubscription: (subId: string) => void;

  // Search state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategoryFilter: string | null;
  setSelectedCategoryFilter: (cat: string | null) => void;

  // AI Assistant Modal
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;

  // PM Analytics
  isAnalyticsModalOpen: boolean;
  setIsAnalyticsModalOpen: (open: boolean) => void;
  analyticsEvents: AnalyticsEvent[];
  logEvent: (type: AnalyticsEventType, details?: Record<string, any>) => void;
  resetAnalytics: () => void;
  funnelMetrics: FunnelMetrics;

  // Price drop alert notification simulation
  priceAlerts: Record<string, boolean>;
  togglePriceAlert: (productId: string) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('phonepe_home');
  const [navigationHistory, setNavigationHistory] = useState<ScreenName[]>(['phonepe_home']);

  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(MOCK_PRODUCTS[0]);
  const [compareList, setCompareList] = useState<Product[]>([]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [addresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<Address>(MOCK_ADDRESSES[0]);

  const [pendingCheckout, setPendingCheckout] = useState<PendingCheckout | null>(null);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS_INITIAL);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS_INITIAL);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);

  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([
    { id: 'ev-init-1', type: 'search', timestamp: Date.now() - 3600000, details: { query: 'wireless headphones' } },
    { id: 'ev-init-2', type: 'product_view', timestamp: Date.now() - 3500000, details: { productId: 'elec-3' } },
    { id: 'ev-init-3', type: 'add_to_cart', timestamp: Date.now() - 3400000, details: { productId: 'elec-3' } },
    { id: 'ev-init-4', type: 'order_placed', timestamp: Date.now() - 3300000, details: { orderId: 'ord-1001' } },
  ]);

  const [priceAlerts, setPriceAlerts] = useState<Record<string, boolean>>({});
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = 'toast-' + Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logEvent = (type: AnalyticsEventType, details?: Record<string, any>) => {
    const newEvent: AnalyticsEvent = {
      id: 'ev-' + Math.random().toString(36).slice(2, 9),
      type,
      timestamp: Date.now(),
      details,
    };
    setAnalyticsEvents((prev) => [newEvent, ...prev]);
  };

  const resetAnalytics = () => {
    setAnalyticsEvents([]);
    showToast('Session analytics reset', 'info');
  };

  // Funnel calculations
  const calculateFunnelMetrics = (): FunnelMetrics => {
    const searches = analyticsEvents.filter((e) => e.type === 'search').length;
    const views = analyticsEvents.filter((e) => e.type === 'product_view').length;
    const compareCount = analyticsEvents.filter((e) => e.type === 'compare').length;
    const cartAdds = analyticsEvents.filter((e) => e.type === 'add_to_cart').length;
    const ordersCount = analyticsEvents.filter((e) => e.type === 'order_placed').length;
    const emiSelected = analyticsEvents.filter((e) => e.type === 'emi_selected').length;
    const warrantyAttached = analyticsEvents.filter((e) => e.type === 'warranty_attached').length;
    const subscriptionsStarted = analyticsEvents.filter((e) => e.type === 'subscription_started').length;
    const returnsRequested = analyticsEvents.filter((e) => e.type === 'return_requested').length;

    const searchToViewRate = searches > 0 ? Math.min(100, Math.round((views / searches) * 100)) : 0;
    const viewToCartRate = views > 0 ? Math.min(100, Math.round((cartAdds / views) * 100)) : 0;
    const cartToOrderRate = cartAdds > 0 ? Math.min(100, Math.round((ordersCount / cartAdds) * 100)) : 0;
    const overallConversionRate = searches > 0 ? Math.min(100, Math.round((ordersCount / searches) * 100)) : 0;

    const emiAttachRate = cartAdds > 0 ? Math.min(100, Math.round((emiSelected / cartAdds) * 100)) : 0;
    const subscriptionRate = cartAdds > 0 ? Math.min(100, Math.round((subscriptionsStarted / cartAdds) * 100)) : 0;

    return {
      searches,
      views,
      compare: compareCount,
      cartAdds,
      orders: ordersCount,
      emiSelected,
      warrantyAttached,
      subscriptionsStarted,
      returnsRequested,
      searchToViewRate,
      viewToCartRate,
      cartToOrderRate,
      overallConversionRate,
      emiAttachRate,
      subscriptionRate,
    };
  };

  const navigateTo = (screen: ScreenName) => {
    setNavigationHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop();
      const previous = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentScreen(previous);
    } else {
      setCurrentScreen('phonepe_home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    logEvent('product_view', { productId: product.id, name: product.name, price: product.price });
    navigateTo('product_detail');
  };

  const toggleCompare = (product: Product) => {
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed ${product.name.slice(0, 20)}... from compare`, 'info');
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        showToast('You can compare up to 3 products at a time', 'warning');
        return prev;
      }
      logEvent('compare', { productId: product.id, name: product.name });
      showToast(`Added ${product.name.slice(0, 20)}... to compare (${prev.length + 1}/3)`);
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const addToCart = (
    product: Product,
    options?: {
      warrantyAdded?: boolean;
      isSubscription?: boolean;
      subscriptionFrequency?: 30 | 60 | 90;
      emiMonths?: number | null;
    }
  ) => {
    const warrantyAdded = !!options?.warrantyAdded;
    const isSubscription = !!options?.isSubscription;
    const subscriptionFrequency = options?.subscriptionFrequency || 30;
    const emiMonths = options?.emiMonths || null;

    if (warrantyAdded) {
      logEvent('warranty_attached', { productId: product.id });
    }
    if (isSubscription) {
      logEvent('subscription_started', { productId: product.id, frequency: subscriptionFrequency });
    }
    if (emiMonths) {
      logEvent('emi_selected', { productId: product.id, months: emiMonths });
    }

    logEvent('add_to_cart', {
      productId: product.id,
      name: product.name,
      price: product.price,
      warrantyAdded,
      isSubscription,
      emiMonths,
    });

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.warrantyAdded === warrantyAdded &&
          item.isSubscription === isSubscription
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        };
        return next;
      }

      const newItem: CartItem = {
        id: 'ci-' + Math.random().toString(36).slice(2, 9),
        productId: product.id,
        product,
        quantity: 1,
        warrantyAdded,
        isSubscription,
        subscriptionFrequency: isSubscription ? subscriptionFrequency : undefined,
        emiMonths,
      };
      return [...prev, newItem];
    });

    showToast(`Added ${product.name.slice(0, 22)}... to Cart!`);
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart financial totals
  const cartSubtotal = cart.reduce((sum, item) => {
    let itemPrice = item.product.price;
    if (item.isSubscription) {
      itemPrice = Math.round(itemPrice * 0.95); // 5% Subscribe & Save discount
    }
    const warrantyCost = item.warrantyAdded ? 499 : 0;
    return sum + (itemPrice + warrantyCost) * item.quantity;
  }, 0);

  // Discount from original MRP
  const cartDiscount = cart.reduce((sum, item) => {
    const diff = (item.product.originalPrice - item.product.price) * item.quantity;
    const subDiff = item.isSubscription ? Math.round(item.product.price * 0.05 * item.quantity) : 0;
    return sum + diff + subDiff;
  }, 0);

  const cartTotal = cartSubtotal;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const startCheckout = (method: 'UPI' | 'EMI' | 'PayLater', details: string) => {
    if (cart.length === 0) return;
    setPendingCheckout({
      paymentMethod: method,
      paymentDetails: details,
      totalAmount: cartTotal,
      items: [...cart],
      address: selectedAddress,
    });
    navigateTo('upi_pin');
  };

  const completeOrderViaPin = (_enteredPin: string) => {
    if (!pendingCheckout) return;

    const now = new Date();
    const formattedDate = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const txId = 'T2610' + Math.floor(1000000000 + Math.random() * 9000000000);
    const orderNum = 'PPE-' + Math.floor(10000 + Math.random() * 90000) + '-IN';

    const newOrder: Order = {
      id: 'ord-' + Math.random().toString(36).slice(2, 9),
      orderNumber: orderNum,
      transactionId: txId,
      date: formattedDate,
      items: pendingCheckout.items,
      totalAmount: pendingCheckout.totalAmount,
      paymentMethod: pendingCheckout.paymentMethod,
      paymentDetails: pendingCheckout.paymentDetails,
      status: 'placed',
      timeline: [
        { label: 'Order Placed', description: `Paid ₹${pendingCheckout.totalAmount.toLocaleString('en-IN')} via ${pendingCheckout.paymentDetails}`, timestamp: formattedDate, completed: true, current: true },
        { label: 'Packed', description: 'Seller is preparing your verified authentic shipment', timestamp: 'Expected in 4 hrs', completed: false, current: false },
        { label: 'Shipped', description: 'Express courier delivery partner assignment', timestamp: 'Tomorrow morning', completed: false, current: false },
        { label: 'Delivered', description: 'Estimated arrival in 2-3 business days', timestamp: '2-3 Days', completed: false, current: false },
      ],
      shippingAddress: pendingCheckout.address,
    };

    // Also check if any item is a subscription and register it
    pendingCheckout.items.forEach((item) => {
      if (item.isSubscription) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + (item.subscriptionFrequency || 30));
        const sub: Subscription = {
          id: 'sub-' + Math.random().toString(36).slice(2, 9),
          productId: item.productId,
          product: item.product,
          frequencyDays: item.subscriptionFrequency || 30,
          discountPercentage: 5,
          nextDebitDate: nextDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          amount: Math.round(item.product.price * 0.95),
          upiAutopayMandate: 'UPI-MND-' + Math.floor(100000 + Math.random() * 900000) + '-' + item.product.brand.toUpperCase(),
          status: 'active',
        };
        setSubscriptions((prev) => [sub, ...prev]);
      }
    });

    logEvent('order_placed', {
      orderId: newOrder.id,
      amount: newOrder.totalAmount,
      paymentMethod: newOrder.paymentMethod,
      itemCount: newOrder.items.length,
    });

    setOrders((prev) => [newOrder, ...prev]);
    setLastCompletedOrder(newOrder);
    setCart([]);
    setPendingCheckout(null);
    navigateTo('success');
  };

  const cancelOrder = (orderId: string, reason: string) => {
    logEvent('return_requested', { orderId, action: 'cancel', reason });
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'cancelled',
            cancelledReason: reason,
            timeline: [
              ...ord.timeline,
              {
                label: 'Order Cancelled',
                description: `Cancelled: ${reason}. Instant refund initiated to ${ord.paymentDetails}`,
                timestamp: 'Just now',
                completed: true,
                current: true,
              },
            ],
          };
        }
        return ord;
      })
    );
    showToast('Order cancelled. ₹ Refund initiated to your UPI account.');
  };

  const returnOrder = (orderId: string, reason: string) => {
    logEvent('return_requested', { orderId, action: 'return', reason });
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'returned',
            returnReason: reason,
            timeline: [
              ...ord.timeline,
              {
                label: 'Return Requested',
                description: `Return reason: ${reason}. Verified courier will pick up within 24 hours.`,
                timestamp: 'Just now',
                completed: true,
                current: true,
              },
            ],
          };
        }
        return ord;
      })
    );
    showToast('Return requested. Free doorstep pickup scheduled.');
  };

  const pauseSubscription = (subId: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s))
    );
    showToast('Subscription status updated');
  };

  const resumeSubscription = (subId: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, status: 'active' } : s))
    );
    showToast('UPI Autopay subscription resumed');
  };

  const cancelSubscription = (subId: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, status: 'cancelled' } : s))
    );
    showToast('Autopay mandate cancelled for this subscription', 'info');
  };

  const togglePriceAlert = (productId: string) => {
    setPriceAlerts((prev) => {
      const active = !prev[productId];
      showToast(
        active
          ? '🔔 Price drop alert enabled! You will get a PhonePe notification if price drops.'
          : 'Price drop alert disabled',
        'info'
      );
      return { ...prev, [productId]: active };
    });
  };

  return (
    <ShopContext.Provider
      value={{
        currentScreen,
        navigationHistory,
        navigateTo,
        goBack,
        products,
        selectedProduct,
        setSelectedProduct,
        openProductDetail,
        compareList,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        cartItemCount,
        addresses,
        selectedAddress,
        setSelectedAddress,
        pendingCheckout,
        startCheckout,
        completeOrderViaPin,
        orders,
        lastCompletedOrder,
        cancelOrder,
        returnOrder,
        subscriptions,
        pauseSubscription,
        resumeSubscription,
        cancelSubscription,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        isAiModalOpen,
        setIsAiModalOpen,
        isAnalyticsModalOpen,
        setIsAnalyticsModalOpen,
        analyticsEvents,
        logEvent,
        resetAnalytics,
        funnelMetrics: calculateFunnelMetrics(),
        priceAlerts,
        togglePriceAlert,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
