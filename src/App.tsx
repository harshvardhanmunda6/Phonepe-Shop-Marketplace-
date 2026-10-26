import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { PhoneContainer } from './components/PhoneContainer';
import { PhonePeHomeScreen } from './components/PhonePeHomeScreen';
import { ShopHomeScreen } from './components/ShopHomeScreen';
import { SearchScreen } from './components/SearchScreen';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { CompareModal } from './components/CompareModal';
import { CartScreen } from './components/CartScreen';
import { CheckoutScreen } from './components/CheckoutScreen';
import { UpiPinScreen } from './components/UpiPinScreen';
import { SuccessScreen } from './components/SuccessScreen';
import { OrdersScreen } from './components/OrdersScreen';
import { AiAssistantModal } from './components/AiAssistantModal';
import { PmAnalyticsModal } from './components/PmAnalyticsModal';

const AppContent: React.FC = () => {
  const { currentScreen } = useShop();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'phonepe_home':
        return <PhonePeHomeScreen />;
      case 'shop_home':
        return <ShopHomeScreen />;
      case 'search':
        return <SearchScreen />;
      case 'product_detail':
        return <ProductDetailScreen />;
      case 'compare':
        return <CompareModal />;
      case 'cart':
        return <CartScreen />;
      case 'checkout':
        return <CheckoutScreen />;
      case 'upi_pin':
        return <UpiPinScreen />;
      case 'success':
        return <SuccessScreen />;
      case 'orders':
        return <OrdersScreen />;
      default:
        return <PhonePeHomeScreen />;
    }
  };

  return (
    <PhoneContainer>
      {renderScreen()}
      <AiAssistantModal />
      <PmAnalyticsModal />
    </PhoneContainer>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
