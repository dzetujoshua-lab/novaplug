export type ProductCategory = 'audio' | 'power' | 'creator' | 'accessories';

export interface ProductVariant {
  id: string;
  name: string;
  colorName: string;
  colorHex: string;
  capacity?: string;
  priceDeltaGHS: number;
  inStock: boolean;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: ProductCategory;
  priceGHS: number;
  originalPriceGHS?: number;
  inStock: boolean;
  stockQuantity: number;
  reservedQuantity?: number;
  sku: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  gallery: string[];
  variants: ProductVariant[];
  specs: Record<string, string>;
  inTheBox: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  highlightFeatures: {
    title: string;
    description: string;
  }[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
  priceAtAddition: number;
}

export type PaymentMethod = 
  | 'momo_mtn' 
  | 'momo_telecel' 
  | 'momo_at' 
  | 'card_paystack' 
  | 'card_flutterwave' 
  | 'bank_transfer';

export type OrderStatus = 
  | 'placed' 
  | 'paid' 
  | 'processing' 
  | 'packed' 
  | 'shipped' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  email: string;
  streetAddress: string;
  landmark?: string;
  city: string;
  region: string;
  ghanaPostGps?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantName?: string;
  sku: string;
  quantity: number;
  unitPriceGHS: number;
  totalGHS: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotalGHS: number;
  shippingFeeGHS: number;
  discountGHS: number;
  totalGHS: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  paymentStatus: 'pending' | 'successful' | 'failed' | 'refunded';
  shippingAddress: ShippingAddress;
  deliveryZone: string;
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface ProductCode {
  id: string;
  code: string;
  productId: string;
  productName: string;
  batchNumber: string;
  manufactureDate: string;
  factoryLocation: string;
  isGenuine: boolean;
  verificationCount: number;
  firstVerifiedAt?: string;
  lastVerifiedAt?: string;
  warrantyMonths: number;
  warrantyValidUntil: string;
}

export interface Review {
  id: string;
  productId: string;
  userId?: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValueGHS: number;
  isActive: boolean;
  expiresAt: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  regions: string[];
  standardFeeGHS: number;
  expressFeeGHS: number;
  estimatedDays: string;
}
