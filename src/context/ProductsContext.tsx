import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductCode, Review, Coupon } from '../types';
import { INITIAL_PRODUCTS, INITIAL_PRODUCT_CODES, INITIAL_REVIEWS, INITIAL_COUPONS } from '../data/initialData';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';

interface ProductsContextType {
  products: Product[];
  productCodes: ProductCode[];
  reviews: Review[];
  coupons: Coupon[];
  loading: boolean;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  getProductReviews: (productId: string) => Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  verifyProductCode: (code: string) => Promise<{ codeDoc?: ProductCode; message: string; isGenuine: boolean }>;
  updateProductStock: (productId: string, newStock: number) => Promise<void>;
  saveProduct: (product: Product) => Promise<void>;
  refreshData: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('novaplug_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [productCodes, setProductCodes] = useState<ProductCode[]>(() => {
    const saved = localStorage.getItem('novaplug_product_codes');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCT_CODES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('novaplug_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('novaplug_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [loading, setLoading] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('novaplug_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('novaplug_product_codes', JSON.stringify(productCodes));
  }, [productCodes]);

  useEffect(() => {
    localStorage.setItem('novaplug_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('novaplug_coupons', JSON.stringify(coupons));
  }, [coupons]);

  // Fetch or bootstrap initial data from Firestore
  const refreshData = async () => {
    try {
      setLoading(true);
      const prodSnapshot = await getDocs(collection(db, 'products'));
      if (!prodSnapshot.empty) {
        const fetchedProds: Product[] = [];
        prodSnapshot.forEach((docSnap) => {
          fetchedProds.push(docSnap.data() as Product);
        });
        setProducts(fetchedProds);
      }
    } catch {
      // In offline or non-permission mode, gracefully keep memory/localStorage products
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug || p.id === slug);
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId && r.status === 'approved');
  };

  const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    const newId = `rev-${Date.now()}`;
    const newReview: Review = {
      ...reviewData,
      id: newId,
      status: 'approved',
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);

    // Recalculate product rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === reviewData.productId) {
          const prodReviews = [...reviews.filter((r) => r.productId === p.id), newReview];
          const avg = prodReviews.reduce((acc, r) => acc + r.rating, 0) / prodReviews.length;
          return {
            ...p,
            rating: Number(avg.toFixed(2)),
            reviewCount: prodReviews.length,
          };
        }
        return p;
      })
    );

    try {
      await setDoc(doc(db, 'reviews', newId), newReview);
    } catch (error) {
      console.warn('Could not sync review to Firestore:', error);
    }
  };

  const verifyProductCode = async (rawCode: string) => {
    const formatted = rawCode.trim().toUpperCase();
    const found = productCodes.find((c) => c.code.toUpperCase() === formatted);

    if (!found) {
      return {
        message: 'No digital product passport found matching this security code. Please ensure you entered the exact NP-XXXX-XX identifier printed on the holographic certificate or retail box.',
        isGenuine: false,
      };
    }

    const updated: ProductCode = {
      ...found,
      verificationCount: found.verificationCount + 1,
      firstVerifiedAt: found.firstVerifiedAt || new Date().toISOString(),
      lastVerifiedAt: new Date().toISOString(),
    };

    setProductCodes((prev) => prev.map((c) => (c.id === found.id ? updated : c)));

    try {
      await updateDoc(doc(db, 'product_codes', found.id), {
        verificationCount: updated.verificationCount,
        lastVerifiedAt: updated.lastVerifiedAt,
      });
    } catch {
      // offline fallback
    }

    return {
      codeDoc: updated,
      message: 'Authentic NovaPlug product verified. Official 2-Year Direct Warranty Active.',
      isGenuine: true,
    };
  };

  const updateProductStock = async (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stockQuantity: newStock, inStock: newStock > 0 } : p
      )
    );

    try {
      await updateDoc(doc(db, 'products', productId), {
        stockQuantity: newStock,
        inStock: newStock > 0,
      });
    } catch {
      // local updated
    }
  };

  const saveProduct = async (product: Product) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = product;
        return next;
      }
      return [product, ...prev];
    });

    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (error) {
      console.warn('Firestore product write failed:', error);
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        productCodes,
        reviews,
        coupons,
        loading,
        getProductBySlug,
        getProductById,
        getProductReviews,
        addReview,
        verifyProductCode,
        updateProductStock,
        saveProduct,
        refreshData,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
