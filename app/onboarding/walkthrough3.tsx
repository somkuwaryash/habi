import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';

export default function Walkthrough3Screen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Stay Motivated</ThemedText>
      <ThemedText style={styles.description}>
        Receive smart reminders and celebrate your progress.
        Build lasting habits and achieve your goals.
      </ThemedText>
      <Link href="/onboarding/cta" asChild>
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Continue</ThemedText>
        </TouchableOpacity>
      </Link>
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
