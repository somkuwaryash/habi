import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRODUCT_IDS } from '@/constants/iap';

const PREMIUM_KEY = 'iap.premium.active';

export type UseIAP = {
  loading: boolean;
  products: any[];
  isProcessing: boolean;
  isPremium: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  buySubscription: () => Promise<void>;
  restorePurchases: () => Promise<void>;
};

export function useIAP(): UseIAP {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);
  const iapRef = useRef<any>(null);

  const loadPremiumFlag = useCallback(async () => {
    try {
      const v = await AsyncStorage.getItem(PREMIUM_KEY);
      if (v === 'true') setIsPremium(true);
    } catch {}
  }, []);

  const markPremium = useCallback(async (value: boolean) => {
    try {
      await AsyncStorage.setItem(PREMIUM_KEY, value ? 'true' : 'false');
    } catch {}
    setIsPremium(value);
  }, []);

  const handlePurchaseResults = useCallback(async (purchases: any[]) => {
    const IAP = iapRef.current;
    for (const purchase of purchases) {
      try {
        if (!purchase.acknowledged) {
          // TODO: Verify receipt server-side before unlocking premium in production.
          if (IAP) {
            await IAP.finishTransactionAsync(purchase, false);
          }
          await markPremium(true);
        }
      } catch (e) {
        console.warn('finishTransactionAsync failed', e);
      }
    }
  }, [markPremium]);

  // Setup connection and listener
  useEffect(() => {
    isMounted.current = true;

    const init = async () => {
      if (Platform.OS === 'web' || Constants.appOwnership === 'expo') {
        // IAP not supported on web or in Expo Go client
        setLoading(false);
        return;
      }
      try {
        const IAP = await import('expo-in-app-purchases');
        iapRef.current = IAP;
        await IAP.connectAsync();
        await loadPremiumFlag();
        await refreshProducts();

        IAP.setPurchaseListener((result: any) => {
          const { responseCode, results, errorCode } = result || {};
          if (!isMounted.current) return;
          if (responseCode === iapRef.current?.IAPResponseCode?.OK && results) {
            handlePurchaseResults(results);
          } else if (responseCode === iapRef.current?.IAPResponseCode?.USER_CANCELED) {
            setIsProcessing(false);
          } else if (responseCode === iapRef.current?.IAPResponseCode?.DEFERRED) {
            setIsProcessing(false);
          } else if (responseCode === iapRef.current?.IAPResponseCode?.ERROR) {
            setIsProcessing(false);
            setError(`Purchase error: ${errorCode}`);
          }
        });
      } catch (e: any) {
        setError(e?.message ?? 'Failed to initialize IAP');
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    init();

    return () => {
      isMounted.current = false;
      const IAP = iapRef.current;
      if (IAP) {
        IAP.disconnectAsync().catch(() => {});
      }
    };
  }, [handlePurchaseResults, loadPremiumFlag]);

  const refreshProducts = useCallback(async () => {
    try {
      const IAP = iapRef.current;
      if (!IAP) return;
      const { responseCode, results } = await IAP.getProductsAsync(PRODUCT_IDS);
      if (responseCode === IAP.IAPResponseCode.OK && results) {
        setProducts(results);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load products');
    }
  }, []);

  const buySubscription = useCallback(async () => {
    const IAP = iapRef.current;
    if (!IAP) {
      setError('In-app purchases are not available in this client. Use a dev or production build.');
      return;
    }
    if (Platform.OS === 'web') {
      setError('In-app purchases are not available on web');
      return;
    }
    if (!products.length) await refreshProducts();
    const productId = (products[0]?.productId) || PRODUCT_IDS[0];
    try {
      setIsProcessing(true);
      await IAP.purchaseItemAsync(productId);
      // Result handled in listener
    } catch (e: any) {
      setIsProcessing(false);
      setError(e?.message ?? 'Failed to start purchase');
    }
  }, [products, refreshProducts]);

  const restorePurchases = useCallback(async () => {
    const IAP = iapRef.current;
    if (!IAP) {
      setError('In-app purchases are not available in this client. Use a dev or production build.');
      return;
    }
    if (Platform.OS === 'web') {
      setError('In-app purchases are not available on web');
      return;
    }
    try {
      setIsProcessing(true);
      const { responseCode, results } = await IAP.getPurchaseHistoryAsync();
      if (responseCode === IAP.IAPResponseCode.OK && results) {
        // If any active subscription/non-consumable appears, mark premium
        if (results.length > 0) {
          await handlePurchaseResults(results);
        }
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to restore purchases');
    } finally {
      setIsProcessing(false);
    }
  }, [handlePurchaseResults]);

  return useMemo(
    () => ({
      loading,
      products,
      isProcessing,
      isPremium,
      error,
      refreshProducts,
      buySubscription,
      restorePurchases,
    }),
    [loading, products, isProcessing, isPremium, error, refreshProducts, buySubscription, restorePurchases]
  );
}
