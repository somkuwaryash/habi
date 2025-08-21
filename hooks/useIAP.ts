import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
// IAP product IDs are not used while IAP is disabled.

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
  // IAP is temporarily disabled to allow Android builds while we migrate away from expo-in-app-purchases.
  // Set to true and implement a supported IAP library (e.g., react-native-iap) when ready.
  const IAP_ENABLED = false;
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
      // Skip IAP entirely on web, Expo Go, or when disabled.
      if (Platform.OS === 'web' || Constants.appOwnership === 'expo' || !IAP_ENABLED) {
        await loadPremiumFlag();
        setLoading(false);
        return;
      }
      // Placeholder for future IAP implementation
      setLoading(false);
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
      if (!IAP_ENABLED) return;
      // Placeholder for future IAP implementation
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load products');
    }
  }, []);

  const buySubscription = useCallback(async () => {
    if (!IAP_ENABLED) {
      setError('In-app purchases are currently unavailable.');
      return;
    }
    if (Platform.OS === 'web') {
      setError('In-app purchases are not available on web');
      return;
    }
    // Placeholder for future IAP implementation
  }, [products, refreshProducts]);

  const restorePurchases = useCallback(async () => {
    if (!IAP_ENABLED) {
      setError('In-app purchases are currently unavailable.');
      return;
    }
    if (Platform.OS === 'web') {
      setError('In-app purchases are not available on web');
      return;
    }
    // Placeholder for future IAP implementation
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
