import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'onboarding',
  // Exclude types.ts from being treated as a route
  exclude: ['constants/types.ts'],
};
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ColorSchemeProvider } from '@/providers/ColorSchemeProvider';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const clearOnboardingData = async () => {
      try {
        await AsyncStorage.removeItem('onboardingComplete');
        await AsyncStorage.removeItem('userName');
        console.log('Onboarding data cleared for testing.');
      } catch (e) {
        console.error('Failed to clear onboarding data from AsyncStorage', e);
      }
    };
    // clearOnboardingData();

    const checkOnboardingStatus = async () => {
      try {
        const onboardingValue = await AsyncStorage.getItem('onboardingComplete');
        const userNameValue = await AsyncStorage.getItem('userName');

        if (onboardingValue === 'true' && userNameValue) {
          setOnboardingComplete(true);
        } else {
          setOnboardingComplete(false);
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
    <ColorSchemeProvider>
      <RootLayoutNav onboardingComplete={onboardingComplete} />
    </ColorSchemeProvider>
  );
}

function RootLayoutNav({ onboardingComplete }: { onboardingComplete: boolean }) {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        {onboardingComplete ? (
          <Stack.Screen name="homescreen" />
        ) : (
          <Stack.Screen name="onboarding" />
        )}
        <Stack.Screen
          name="habit-details/[id]"
          options={({ navigation }) => ({
            headerShown: true,
            title: 'Habit Stats',
            headerBackTitle: '',
            headerLeft: ({ tintColor }) => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
                <Ionicons name="chevron-back" size={24} color={tintColor ?? undefined} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
