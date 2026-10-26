export type CategoryType = 'electronics' | 'beauty';

export interface Product {
  id: string;
  name: string;
  category: CategoryType;
  subcategory: string; // 'budget smartphones' | 'headphones' | 'fitness trackers' | 'student laptops' | 'skincare' | 'makeup' | 'hair care' | "men's grooming"
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  specs: Record<string, string>;
  verifiedSeller: boolean;
  isSponsored?: boolean;
  inStock: boolean;
  dealsBadge?: string;
  features: string[];
  emiOptions?: {
    months: number;
    monthlyAmount: number;
  }[];
}

export interface CartItem {
  id: string; // unique item entry id
  productId: string;
  product: Product;
  quantity: number;
  warrantyAdded: boolean; // ₹499 PhonePe Protect Plan
  isSubscription: boolean; // Beauty Subscribe & Save
  subscriptionFrequency?: 30 | 60 | 90; // days
  emiMonths?: number | null; // Electronics No Cost EMI
}

export interface OrderTimelineStep {
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  transactionId: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: 'UPI' | 'EMI' | 'PayLater';
  paymentDetails: string;
  status: 'placed' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  timeline: OrderTimelineStep[];
  shippingAddress: Address;
  returnReason?: string;
  cancelledReason?: string;
}

export interface Subscription {
  id: string;
  productId: string;
  product: Product;
  frequencyDays: 30 | 60 | 90;
  discountPercentage: number;
  nextDebitDate: string;
  amount: number;
  upiAutopayMandate: string;
  status: 'active' | 'paused' | 'cancelled';
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  flat: string;
  street: string;
  city: string;
  pincode: string;
  state: string;
  isDefault: boolean;
}

export type AnalyticsEventType =
  | 'search'
  | 'product_view'
  | 'compare'
  | 'add_to_cart'
  | 'emi_selected'
  | 'warranty_attached'
  | 'subscription_started'
  | 'order_placed'
  | 'return_requested';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: number;
  details?: Record<string, any>;
}

export interface FunnelMetrics {
  searches: number;
  views: number;
  compare: number;
  cartAdds: number;
  orders: number;
  emiSelected: number;
  warrantyAttached: number;
  subscriptionsStarted: number;
  returnsRequested: number;
  searchToViewRate: number;
  viewToCartRate: number;
  cartToOrderRate: number;
  overallConversionRate: number;
  emiAttachRate: number;
  subscriptionRate: number;
}
