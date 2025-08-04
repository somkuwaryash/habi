import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';

export default function Walkthrough2Screen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>AI-Powered Insights</ThemedText>
      <ThemedText style={styles.description}>
        Gain valuable insights into your habits with intelligent analytics.
        Understand your progress and identify areas for improvement.
      </ThemedText>
      <Link href="/onboarding/walkthrough3" asChild>
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
