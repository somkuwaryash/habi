import { Platform } from 'react-native';

// Replace these with your real product IDs from App Store Connect and Google Play Console
export const IAP_PRODUCTS = {
  subscriptionMonthly: Platform.select({
    ios: 'com.yourapp.premium_monthly',
    android: 'com.yourapp.premium_monthly',
    default: 'com.yourapp.premium_monthly',
  }) as string,
};

export const PRODUCT_IDS: string[] = [IAP_PRODUCTS.subscriptionMonthly];
