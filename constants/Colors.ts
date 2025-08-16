/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // Extended tokens
    primary: '#FF9800',
    primaryContrast: '#FFFFFF',
    card: '#FFFFFF',
    surface: '#F9FAFB',
    surfaceAlt: '#FFF8E1',
    border: '#E5E7EB',
    muted: '#6B7280',
    inputBackground: '#F3F4F6',
    inputPlaceholder: '#9CA3AF',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // Extended tokens
    primary: '#FF9800',
    primaryContrast: '#FFFFFF',
    card: '#1F1F1F',
    surface: '#1B1D1F',
    surfaceAlt: '#242628',
    border: '#2A2E33',
    muted: '#A0A0A0',
    inputBackground: '#1F2328',
    inputPlaceholder: '#6B7280',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
};
