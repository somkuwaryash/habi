import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function CTAScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[(colorScheme ?? 'light') as 'light' | 'dark'];

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboardingComplete', 'true');
      router.replace('/(tabs)');
    } catch (e) {
      console.error('Failed to save onboarding status to AsyncStorage', e);
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.surfaceAlt }]}> 
      {/* Decorative warm blobs */}
      <View style={[styles.bgBlob, { backgroundColor: theme.primary }]} />
      <View style={[styles.bgBlob2, { backgroundColor: theme.primary }]} />
      <ThemedText type="title" style={[styles.title, { color: theme.text }]}>Ready to Build Habits?</ThemedText>
      <ThemedText style={[styles.description, { color: theme.muted }]}>
        Start tracking your habits today and achieve your goals.
      </ThemedText>
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary, shadowColor: theme.icon }]} onPress={completeOnboarding}>
        <ThemedText style={[styles.buttonText, { color: theme.primaryContrast }]}>Go to My Habits</ThemedText>
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
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 8,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  }
  ,
  bgBlob: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.08,
  },
  bgBlob2: {
    position: 'absolute',
    bottom: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.08,
  },
});
