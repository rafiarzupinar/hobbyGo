/**
 * AtölyeKeşif Theme - Dark theme matching HTML design
 */

import { Platform } from 'react-native';

// Primary brand color - Emerald Green
const primaryColor = '#10b981';

export const Colors = {
  // Dark theme (primary theme for the app)
  dark: {
    background: '#000000',
    foreground: '#ffffff',
    primary: primaryColor,
    primaryForeground: '#ffffff',
    secondary: '#111111',
    secondaryForeground: '#ffffff',
    muted: '#262626',
    mutedForeground: '#a1a1aa',
    accent: '#111111',
    accentForeground: '#ffffff',
    destructive: '#ef4444',
    card: '#111111',
    cardForeground: '#ffffff',
    border: '#262626',
    input: '#262626',
    ring: primaryColor,
    // Tab bar colors
    tabIconDefault: '#a1a1aa',
    tabIconSelected: primaryColor,
    text: '#ffffff',
    tint: primaryColor,
    icon: '#a1a1aa',
  },
  // Light theme (fallback, but app primarily uses dark)
  light: {
    background: '#ffffff',
    foreground: '#000000',
    primary: primaryColor,
    primaryForeground: '#ffffff',
    secondary: '#f4f4f5',
    secondaryForeground: '#000000',
    muted: '#f4f4f5',
    mutedForeground: '#71717a',
    accent: '#f4f4f5',
    accentForeground: '#000000',
    destructive: '#ef4444',
    card: '#ffffff',
    cardForeground: '#000000',
    border: '#e4e4e7',
    input: '#e4e4e7',
    ring: primaryColor,
    // Tab bar colors
    tabIconDefault: '#71717a',
    tabIconSelected: primaryColor,
    text: '#000000',
    tint: primaryColor,
    icon: '#71717a',
  },
};

// Category colors for gradient backgrounds
export const CategoryColors = {
  seramik: { from: '#a855f7', to: '#9333ea' }, // purple
  resim: { from: '#ec4899', to: '#db2777' }, // pink
  muzik: { from: '#3b82f6', to: '#2563eb' }, // blue
  dans: { from: '#f97316', to: '#ea580c' }, // orange
  elSanatlari: { from: '#22c55e', to: '#16a34a' }, // green
  'el-sanatlari': { from: '#22c55e', to: '#16a34a' }, // green (kebab-case)
  fotograf: { from: '#eab308', to: '#ca8a04' }, // yellow
  'aile-cocuk': { from: '#ec4899', to: '#db2777' }, // pink
  'deneyim-ogrenme': { from: '#06b6d4', to: '#0891b2' }, // cyan
  'doga-outdoor': { from: '#84cc16', to: '#65a30d' }, // lime
  'el-isi-zanaat': { from: '#f59e0b', to: '#d97706' }, // amber
  'kisisel-gelisim-saglik': { from: '#8b5cf6', to: '#7c3aed' }, // violet
  'kulturel-geleneksel': { from: '#f43f5e', to: '#e11d48' }, // rose
  'moda-giyim': { from: '#ec4899', to: '#db2777' }, // pink
  'performans-sahne': { from: '#f97316', to: '#ea580c' }, // orange
  'sanat-el-sanatlari': { from: '#a855f7', to: '#9333ea' }, // purple
  'teknoloji-dijital': { from: '#3b82f6', to: '#2563eb' }, // blue
};

// Spacing constants
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
};

// Border radius constants
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

// Font sizes
export const FontSizes = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
};

// Font weights
export const FontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Menlo',
  },
  android: {
    sans: 'Roboto',
    serif: 'serif',
    rounded: 'Roboto',
    mono: 'monospace',
  },
  default: {
    sans: 'System',
    serif: 'serif',
    rounded: 'System',
    mono: 'monospace',
  },
});
