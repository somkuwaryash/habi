import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';

export default function Walkthrough1Screen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Track Your Habits</ThemedText>
      <ThemedText style={styles.description}>
        Easily add, track, and manage your daily habits.
        Stay consistent with a simple and intuitive interface.
      </ThemedText>
      <Link href="/onboarding/walkthrough2" asChild>
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Next</ThemedText>
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
