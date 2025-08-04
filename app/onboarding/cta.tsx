import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CTAScreen() {
  const router = useRouter();

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboardingComplete', 'true');
      router.replace('/(tabs)');
    } catch (e) {
      console.error('Failed to save onboarding status to AsyncStorage', e);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Ready to Build Habits?</ThemedText>
      <ThemedText style={styles.description}>
        Start tracking your habits today and achieve your goals.
      </ThemedText>
      <TouchableOpacity style={styles.button} onPress={completeOnboarding}>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
