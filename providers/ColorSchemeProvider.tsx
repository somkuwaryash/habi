import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme as useRNColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key for persisting user preference
const STORAGE_KEY = 'appColorScheme';

export interface ColorSchemeContextValue {
  colorScheme: NonNullable<ColorSchemeName>;
  setColorScheme: (scheme: NonNullable<ColorSchemeName>) => void;
  toggleColorScheme: () => void;
  // Whether the scheme is following the system (no explicit user choice stored)
  isFollowingSystem: boolean;
}

const ColorSchemeContext = createContext<ColorSchemeContextValue | undefined>(undefined);

export const ColorSchemeProvider: React.FC<{ children: React.ReactNode }>
  = ({ children }) => {
  const systemScheme = useRNColorScheme() ?? 'light';

  const [colorScheme, setColorSchemeState] = useState<NonNullable<ColorSchemeName>>(systemScheme);
  const [isFollowingSystem, setIsFollowingSystem] = useState(true);

  // Hydrate from storage on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) return;
        if (saved === 'light' || saved === 'dark') {
          setColorSchemeState(saved);
          setIsFollowingSystem(false);
        } else {
          setColorSchemeState(systemScheme);
          setIsFollowingSystem(true);
        }
      } catch (e) {
        setColorSchemeState(systemScheme);
        setIsFollowingSystem(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // If following system, update when system changes
  useEffect(() => {
    if (isFollowingSystem) {
      setColorSchemeState(systemScheme);
    }
  }, [systemScheme, isFollowingSystem]);

  // Persist when user explicitly changes
  const setAppColorScheme = useCallback((scheme: NonNullable<ColorSchemeName>) => {
    setColorSchemeState(scheme);
    setIsFollowingSystem(false);
    AsyncStorage.setItem(STORAGE_KEY, scheme).catch(() => {});
  }, []);

  const toggleColorScheme = useCallback(() => {
    setColorSchemeState((prev: NonNullable<ColorSchemeName>) => {
      const next: NonNullable<ColorSchemeName> = prev === 'dark' ? 'light' : 'dark';
      AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
      return next;
    });
    setIsFollowingSystem(false);
  }, []);

  const value = useMemo<ColorSchemeContextValue>(() => ({
    colorScheme,
    setColorScheme: setAppColorScheme,
    toggleColorScheme,
    isFollowingSystem,
  }), [colorScheme, setAppColorScheme, toggleColorScheme, isFollowingSystem]);

  return (
    <ColorSchemeContext.Provider value={value}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

export function useThemeController() {
  const ctx = useContext(ColorSchemeContext);
  if (!ctx) throw new Error('useThemeController must be used within ColorSchemeProvider');
  return ctx;
}
