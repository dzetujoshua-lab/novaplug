import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant, Coupon, ShippingZone, Order, PaymentMethod, ShippingAddress } from '../types';
import { SHIPPING_ZONES, INITIAL_COUPONS } from '../data/initialData';
import { useProducts } from './ProductsContext';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotalGHS: number;
  discountGHS: number;
  shippingFeeGHS: number;
  totalGHS: number;
  isCartOpen: boolean;
  appliedCoupon: Coupon | null;
  selectedZone: ShippingZone;
  shippingMethod: 'standard' | 'express';
  freeShippingThreshold: number;
  freeShippingProgress: number;
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => boolean;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setSelectedZone: (zone: ShippingZone) => void;
  setShippingMethod: (method: 'standard' | 'express') => void;
  createOrder: (
    address: ShippingAddress,
    paymentMethod: PaymentMethod,
    customerNotes?: string
  ) => Promise<{ success: boolean; order?: Order; error?: string }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { updateProductStock, products } = useProducts();
  const { user } = useAuth();

  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('novaplug_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem('novaplug_applied_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedZone, setSelectedZone] = useState<ShippingZone>(SHIPPING_ZONES[0]);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  const freeShippingThreshold = 2000;

  // Persist cart
  useEffect(() => {
    localStorage.setItem('novaplug_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('novaplug_applied_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('novaplug_applied_coupon');
    }
  }, [appliedCoupon]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Recalculate subtotal using current validated prices from products
  const subtotalGHS = items.reduce((sum, item) => {
    const latestProduct = products.find((p) => p.id === item.product.id) || item.product;
    const basePrice = latestProduct.priceGHS;
    const delta = item.selectedVariant?.priceDeltaGHS || 0;
    return sum + (basePrice + delta) * item.quantity;
  }, 0);

  // Free shipping progress
  const freeShippingProgress = Math.min(100, Math.round((subtotalGHS / freeShippingThreshold) * 100));

  // Calculate discount
  let discountGHS = 0;
  if (appliedCoupon && subtotalGHS >= appliedCoupon.minOrderValueGHS) {
    if (appliedCoupon.discountType === 'percentage') {
      discountGHS = Math.round((subtotalGHS * appliedCoupon.discountValue) / 100);
    } else {
      discountGHS = Math.min(appliedCoupon.discountValue, subtotalGHS);
    }
  }

  // Calculate shipping fee (free standard shipping over threshold)
  let shippingFeeGHS = 0;
  if (selectedZone.id === 'zone-pickup') {
    shippingFeeGHS = 0;
  } else if (subtotalGHS >= freeShippingThreshold && shippingMethod === 'standard') {
    shippingFeeGHS = 0;
  } else {
    shippingFeeGHS = shippingMethod === 'express' ? selectedZone.expressFeeGHS : selectedZone.standardFeeGHS;
  }

  const totalGHS = Math.max(0, subtotalGHS - discountGHS + shippingFeeGHS);

  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1): boolean => {
    const currentStock = product.stockQuantity;
    const existing = items.find(
      (item) => item.product.id === product.id && item.selectedVariant?.id === variant?.id
    );
    const currentQtyInCart = existing ? existing.quantity : 0;

    if (currentQtyInCart + quantity > currentStock) {
      return false;
    }

    const priceAtAddition = product.priceGHS + (variant?.priceDeltaGHS || 0);

    setItems((prev) => {
      const matchIndex = prev.findIndex(
        (i) => i.product.id === product.id && i.selectedVariant?.id === variant?.id
      );

      if (matchIndex >= 0) {
        const next = [...prev];
        next[matchIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, selectedVariant: variant, quantity, priceAtAddition }];
    });

    setIsCartOpen(true);
    return true;
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    const prod = products.find((p) => p.id === productId);
    if (prod && quantity > prod.stockQuantity) {
      quantity = prod.stockQuantity;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedVariant?.id === variantId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedVariant?.id === variantId)
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    const coupon = INITIAL_COUPONS.find((c) => c.code === code && c.isActive);

    if (!coupon) {
      return { success: false, message: 'Invalid or expired promotional code.' };
    }

    if (subtotalGHS < coupon.minOrderValueGHS) {
      return {
        success: false,
        message: `This coupon requires a minimum subtotal of GH₵ ${coupon.minOrderValueGHS.toLocaleString()}.`,
      };
    }

    setAppliedCoupon(coupon);
    return {
      success: true,
      message: `Coupon "${coupon.code}" applied! You save ${
        coupon.discountType === 'percentage'
          ? `${coupon.discountValue}%`
          : `GH₵ ${coupon.discountValue}`
      }.`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Secure checkout order creation
  const createOrder = async (
    address: ShippingAddress,
    paymentMethod: PaymentMethod,
    customerNotes?: string
  ): Promise<{ success: boolean; order?: Order; error?: string }> => {
    if (items.length === 0) {
      return { success: false, error: 'Your cart is currently empty.' };
    }

    // Verify stock availability for all items before placing
    for (const item of items) {
      const liveProd = products.find((p) => p.id === item.product.id);
      if (!liveProd || liveProd.stockQuantity < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for "${item.product.name}". Only ${
            liveProd?.stockQuantity || 0
          } units remaining.`,
        };
      }
    }

    const orderId = `ord-${Date.now()}`;
    const orderNumber = `NP-${Math.floor(100000 + Math.random() * 900000)}`;
    const paymentRef = `NP-PAY-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const orderItems = items.map((item) => {
      const unitPrice = item.product.priceGHS + (item.selectedVariant?.priceDeltaGHS || 0);
      return {
        productId: item.product.id,
        productName: item.product.name,
        variantName: item.selectedVariant?.name,
        sku: item.selectedVariant?.sku || item.product.sku,
        quantity: item.quantity,
        unitPriceGHS: unitPrice,
        totalGHS: unitPrice * item.quantity,
        imageUrl: item.product.imageUrl,
      };
    });

    const now = new Date().toISOString();

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      userId: user?.uid || 'guest',
      customerEmail: address.email,
      customerName: address.fullName,
      customerPhone: address.phoneNumber,
      items: orderItems,
      subtotalGHS,
      shippingFeeGHS,
      discountGHS,
      totalGHS,
      status: 'paid', // Instant confirmation simulation for authenticated payment
      paymentMethod,
      paymentReference: paymentRef,
      paymentStatus: 'successful',
      shippingAddress: address,
      deliveryZone: selectedZone.name,
      estimatedDelivery: selectedZone.estimatedDays,
      createdAt: now,
      updatedAt: now,
      notes: customerNotes,
    };

    // Deduct stock
    for (const item of items) {
      const liveProd = products.find((p) => p.id === item.product.id);
      if (liveProd) {
        await updateProductStock(liveProd.id, Math.max(0, liveProd.stockQuantity - item.quantity));
      }
    }

    // Store order in Firestore & localStorage
    try {
      await setDoc(doc(db, 'orders', orderId), newOrder);
    } catch (e) {
      console.warn('Could not write order to Firestore, saving to local cache:', e);
    }

    const existingOrders = JSON.parse(localStorage.getItem('novaplug_orders') || '[]');
    localStorage.setItem('novaplug_orders', JSON.stringify([newOrder, ...existingOrders]));

    clearCart();
    return { success: true, order: newOrder };
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotalGHS,
        discountGHS,
        shippingFeeGHS,
        totalGHS,
        isCartOpen,
        appliedCoupon,
        selectedZone,
        shippingMethod,
        freeShippingThreshold,
        freeShippingProgress,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        setIsCartOpen,
        applyCoupon,
        removeCoupon,
        setSelectedZone,
        setShippingMethod,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
