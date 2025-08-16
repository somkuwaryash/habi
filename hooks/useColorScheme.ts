import { useThemeController } from '@/providers/ColorSchemeProvider';

export function useColorScheme() {
  return useThemeController().colorScheme;
}
