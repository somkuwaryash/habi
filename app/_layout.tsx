import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('onboardingComplete');
        if (value === 'true') {
          setOnboardingComplete(true);
        }
      } catch (e) {
        console.error('Failed to load onboarding status from AsyncStorage', e);
      } finally {
        setIsAppReady(true);
      }
    };
    checkOnboardingStatus();
  }, []);

  if (!loaded || !isAppReady) {
    return null; // Or a custom loading screen
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        {onboardingComplete ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="onboarding" />
        )}
        {/* Explicitly show header for habit-details screen */}
        <Stack.Screen name="habit-details/[id]" options={{ headerShown: true, title: 'Habit Stats' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
