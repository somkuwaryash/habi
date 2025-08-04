import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="walkthrough1" />
      <Stack.Screen name="walkthrough2" />
      <Stack.Screen name="walkthrough3" />
      <Stack.Screen name="cta" />
    </Stack>
  );
}
