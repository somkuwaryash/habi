import React, { useEffect } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function HomeScreenRedirect() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to the main tabs layout
    router.replace('/(tabs)');
  }, [router]);
  return <ThemedView style={{ flex: 1 }} />;
}
