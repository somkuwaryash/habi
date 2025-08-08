import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, useColorScheme, Appearance, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const systemColorScheme = useColorScheme();
  const [appColorScheme, setAppColorScheme] = useState(systemColorScheme);
  const router = useRouter();
  const [userName, setUserName] = useState('');

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
    <ThemedView style={[styles.container, { backgroundColor: appColorScheme === 'dark' ? '#121212' : '#F5F5DC' }]}>
      <ThemedText type="title" style={[styles.title, { color: appColorScheme === 'dark' ? '#FFD700' : '#8B4513' }]}>Welcome to Hobby!</ThemedText>
      <ThemedText style={[styles.subtitle, { color: appColorScheme === 'dark' ? '#FFE0B2' : '#A0522D' }]}>Your intelligent habit tracker.</ThemedText>
      <ThemedText style={[styles.description, { color: appColorScheme === 'dark' ? '#D3D3D3' : '#696969' }]}>
        Get ready to build amazing habits with the power of AI.
      </ThemedText>
      <TextInput
        style={[styles.input, { borderColor: appColorScheme === 'dark' ? '#FFD700' : '#8B4513', color: appColorScheme === 'dark' ? '#FFFFFF' : '#000000' }]}
        placeholder="Enter your name"
        placeholderTextColor={appColorScheme === 'dark' ? '#A0A0A0' : '#808080'}
        value={userName}
        onChangeText={setUserName}
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: appColorScheme === 'dark' ? '#FF8C00' : '#FF4500' }]} onPress={handleGetStarted}>
        <ThemedText style={styles.buttonText}>Get Started</ThemedText>
      </TouchableOpacity>
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
    fontSize: 38,
    fontWeight: 'bold',
    marginBottom: 15,
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
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18,
  }

});
