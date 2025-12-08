// Design system based on existing HTML design
export const theme = {
  colors: {
    background: '#000000',
    foreground: '#ffffff',
    primary: {
      DEFAULT: '#10b981',
      foreground: '#ffffff',
    },
    secondary: {
      DEFAULT: '#111111',
      foreground: '#ffffff',
    },
    muted: {
      DEFAULT: '#262626',
      foreground: '#a1a1aa',
    },
    accent: {
      DEFAULT: '#111111',
      foreground: '#ffffff',
    },
    destructive: {
      DEFAULT: '#ef4444',
    },
    card: {
      DEFAULT: '#111111',
      foreground: '#ffffff',
    },
    border: '#262626',
    input: '#262626',
    ring: '#10b981',

    // Category colors
    categories: {
      purple: {
        from: '#a855f7',
        to: '#9333ea',
      },
      pink: {
        from: '#ec4899',
        to: '#db2777',
      },
      blue: {
        from: '#60a5fa',
        to: '#3b82f6',
      },
      orange: {
        from: '#fb923c',
        to: '#f97316',
      },
      green: {
        from: '#4ade80',
        to: '#22c55e',
      },
      yellow: {
        from: '#facc15',
        to: '#eab308',
      },
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      elevation: 12,
    },
  },
};

export type Theme = typeof theme;
