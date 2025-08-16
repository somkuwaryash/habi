import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function WelcomeScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const theme = Colors[(colorScheme ?? 'light') as 'light' | 'dark'];

  // Theme is controlled globally via ColorSchemeProvider

  const handleGetStarted = async () => {
    if (userName.trim() === '') {
      Alert.alert('Name Required', 'Please enter your name to get started.');
      return;
    }
    try {
      await AsyncStorage.setItem('userName', userName.trim());
      router.push('/onboarding/walkthrough1');
    } catch (e) {
      console.error('Failed to save user name to AsyncStorage', e);
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.surfaceAlt }]}> 
      {/* Decorative warm blobs */}
      <View style={[styles.bgBlob, { backgroundColor: theme.primary }]} />
      <View style={[styles.bgBlob2, { backgroundColor: theme.primary }]} />

      {/* Skip */}
      <TouchableOpacity style={styles.skipButton} onPress={() => router.push('/onboarding/cta')}>
        <ThemedText style={{ color: theme.muted }}>Skip</ThemedText>
      </TouchableOpacity>
      <ThemedText type="title" style={[styles.title, { color: theme.text }]}>Welcome to Habi!</ThemedText>
      <ThemedText style={[styles.subtitle, { color: theme.muted }]}>Your intelligent habit tracker.</ThemedText>
      <ThemedText style={[styles.description, { color: theme.muted }]}> 
        Get ready to build amazing habits with the power of AI.
      </ThemedText>
      <TextInput
        style={[styles.input, { borderColor: theme.border, backgroundColor: theme.inputBackground, color: theme.text }]}
        placeholder="Enter your name"
        placeholderTextColor={theme.inputPlaceholder}
        value={userName}
        onChangeText={setUserName}
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary, shadowColor: theme.icon }]} onPress={handleGetStarted}>
        <ThemedText style={[styles.buttonText, { color: theme.primaryContrast }]}>Get Started</ThemedText>
      </TouchableOpacity>

      {/* Progress dots (1/4) */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, styles.progressDotActive, { backgroundColor: theme.primary }]} />
        <View style={[styles.progressDot, { backgroundColor: theme.border }]} />
        <View style={[styles.progressDot, { backgroundColor: theme.border }]} />
        <View style={[styles.progressDot, { backgroundColor: theme.border }]} />
      </View>
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
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    marginBottom: 25,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
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
  },
  progressContainer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    opacity: 0.9,
  },
  progressDotActive: {
    width: 20,
    borderRadius: 10,
  },
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
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
  }

});
