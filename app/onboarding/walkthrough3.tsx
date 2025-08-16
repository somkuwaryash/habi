import React from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable, Dimensions, PanResponder, GestureResponderEvent } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function Walkthrough3Screen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const theme = Colors[(colorScheme ?? 'light') as 'light' | 'dark'];

  const screenWidth = Dimensions.get('window').width;

  const goNext = () => router.push('/onboarding/cta');
  const goBack = () => router.push('/onboarding/walkthrough2');

  const handleTap = (e: GestureResponderEvent) => {
    const x = e.nativeEvent.locationX;
    if (x > screenWidth * 0.5) {
      goNext();
    }
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gestureState) =>
        Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 20,
      onPanResponderRelease: (_evt, gestureState) => {
        if (gestureState.dx <= -30) {
          goNext();
        } else if (gestureState.dx >= 30) {
          goBack();
        }
      },
    })
  ).current;

  // Theme is controlled globally via ColorSchemeProvider

  return (
    <Pressable style={{ flex: 1 }} onPress={handleTap} {...panResponder.panHandlers}>
      <ThemedView style={[styles.container, { backgroundColor: theme.surfaceAlt }]}> 
      {/* Decorative warm blobs */}
      <View style={[styles.bgBlob, { backgroundColor: theme.primary }]} />
      <View style={[styles.bgBlob2, { backgroundColor: theme.primary }]} />

      {/* Skip */}
      <TouchableOpacity style={styles.skipButton} onPress={() => router.push('/onboarding/cta')}>
        <ThemedText style={{ color: theme.muted }}>Skip</ThemedText>
      </TouchableOpacity>
      <ThemedText type="title" style={[styles.title, { color: theme.text }]}>Stay Motivated</ThemedText>
      <ThemedText style={[styles.description, { color: theme.muted }]}>
        Receive smart reminders and celebrate your progress.
        Build lasting habits and achieve your goals.
      </ThemedText>
      {/* Tap right side to go forward; swipe left/right to navigate */}

      {/* Progress dots (4/4) */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, { backgroundColor: theme.border }]} />
        <View style={[styles.progressDot, { backgroundColor: theme.border }]} />
        <View style={[styles.progressDot, { backgroundColor: theme.border }]} />
        <View style={[styles.progressDot, styles.progressDotActive, { backgroundColor: theme.primary }]} />
      </View>
      </ThemedView>
    </Pressable>
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

});
