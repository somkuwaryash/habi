import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function CTAScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const [appColorScheme, setAppColorScheme] = useState(systemColorScheme);

  useEffect(() => {
    const loadColorScheme = async () => {
      try {
        const savedColorScheme = await AsyncStorage.getItem('appColorScheme');
        if (savedColorScheme) {
          setAppColorScheme(savedColorScheme as 'light' | 'dark');
        } else {
          setAppColorScheme(systemColorScheme);
        }
      } catch (error) {
        console.error('Failed to load color scheme from AsyncStorage', error);
        setAppColorScheme(systemColorScheme);
      }
    };
    loadColorScheme();
  }, [systemColorScheme]);

  useEffect(() => {
    const saveColorScheme = async () => {
      try {
        await AsyncStorage.setItem('appColorScheme', appColorScheme || '');
      } catch (error) {
        console.error('Failed to save color scheme to AsyncStorage', error);
      }
    };
    saveColorScheme();
  }, [appColorScheme]);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboardingComplete', 'true');
      router.replace('/(tabs)');
    } catch (e) {
      console.error('Failed to save onboarding status to AsyncStorage', e);
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: appColorScheme === 'dark' ? '#121212' : '#F5F5DC' }]}>
      <ThemedText type="title" style={[styles.title, { color: appColorScheme === 'dark' ? '#FFD700' : '#8B4513' }]}>Ready to Build Habits?</ThemedText>
      <ThemedText style={[styles.description, { color: appColorScheme === 'dark' ? '#D3D3D3' : '#696969' }]}>
        Start tracking your habits today and achieve your goals.
      </ThemedText>
      <TouchableOpacity style={[styles.button, { backgroundColor: appColorScheme === 'dark' ? '#FF8C00' : '#FF4500' }]} onPress={completeOnboarding}>
        <ThemedText style={styles.buttonText}>Go to My Habits</ThemedText>
      </TouchableOpacity>
      {/* Future: Add option to create first habit */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 24,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  }

});
