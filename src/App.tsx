/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ProductsProvider, useProducts } from './context/ProductsContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ProductListPage } from './pages/ProductListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AuthenticityPage } from './pages/AuthenticityPage';
import { ShowroomPage } from './pages/ShowroomPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { Product, Order } from './types';

function MainApp() {
  const { products, getProductBySlug } = useProducts();

  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParam, setRouteParam] = useState<string | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Sync scroll on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute, routeParam]);

  const handleNavigate = (route: string, param?: string) => {
    setCurrentRoute(route);
    setRouteParam(param);

    if (route === 'product' && param) {
      const prod = getProductBySlug(param);
      if (prod) setSelectedProduct(prod);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentRoute('product');
    setRouteParam(product.slug);
  };

  const handleOrderSuccess = (order: Order) => {
    setLastPlacedOrder(order);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f3f4f6] flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* Universal Header with Top Bar Contract */}
      <Header onNavigate={handleNavigate} activeRoute={currentRoute} />

      {/* Main Routed Content */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomePage onNavigate={handleNavigate} onSelectProduct={handleSelectProduct} />
        )}

        {currentRoute === 'products' && (
          <ProductListPage
            initialCategory={routeParam || 'all'}
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'product' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentRoute === 'cart' && <CartPage onNavigate={handleNavigate} />}

        {currentRoute === 'checkout' && (
          <CheckoutPage onNavigate={handleNavigate} onOrderSuccess={handleOrderSuccess} />
        )}

        {currentRoute === 'order-confirmation' && (
          <OrderConfirmationPage order={lastPlacedOrder} onNavigate={handleNavigate} />
        )}

        {currentRoute === 'tracking' && <OrderTrackingPage onNavigate={handleNavigate} />}

        {currentRoute === 'verify' && <AuthenticityPage onNavigate={handleNavigate} />}

        {currentRoute === 'showroom' && <ShowroomPage onNavigate={handleNavigate} />}

        {currentRoute === 'wishlist' && (
          <WishlistPage onNavigate={handleNavigate} onSelectProduct={handleSelectProduct} />
        )}

        {currentRoute === 'account' && <AccountPage onNavigate={handleNavigate} />}

        {currentRoute === 'admin' && <AdminPage onNavigate={handleNavigate} />}
      </main>

      {/* Slide-out Cart Drawer */}
      <CartDrawer onNavigate={handleNavigate} />

      {/* Premium Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <WishlistProvider>
          <CartProvider>
            <MainApp />
          </CartProvider>
        </WishlistProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}
