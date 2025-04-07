export const theme = {
  colors: {
    // Primary colors inspired by Kenyan flag and landscapes
    primary: '#B82C25', // Kenyan red
    secondary: '#228B22', // Forest green
    accent: '#FFB90F', // Golden yellow

    // Earth tones inspired by Kenyan landscapes
    earth: {
      clay: '#8B4513', // Kenyan clay soil
      sand: '#DEB887', // Savannah sand
      coffee: '#6F4E37', // Coffee bean brown
      terracotta: '#E17055', // Maasai shuka inspired
    },

    // UI colors
    surface: '#FFFFFF',
    background: '#F5F3F0', // Warm off-white
    
    text: {
      primary: '#1A1817', // Deep charcoal
      secondary: '#4A4543', // Warm gray
      muted: '#7C7977', // Soft gray
    },

    // Status colors
    success: '#27AE60',
    warning: '#F2994A',
    error: '#EB5757',
  },

  // Spacing system
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border radius
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
    circle: 999,
  },

  // Typography
  typography: {
    sizes: {
      h1: 32,
      h2: 28,
      h3: 24,
      h4: 20,
      body: 16,
      small: 14,
      caption: 12,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
  },

  // Shadows
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },

  // Enhanced shadows system
  elevation: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    }
  },

  // Animation presets
  animation: {
    scale: {
      pressed: 0.96,
      default: 1,
    },
    timing: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
  },

  // Patterns inspired by Kenyan textile patterns
  patterns: {
    triangular: {
      backgroundColor: 'transparent',
      backgroundImage: `linear-gradient(45deg, #B82C25 25%, transparent 25%, transparent 75%, #B82C25 75%, #B82C25)`,
      backgroundSize: '60px 60px',
    },
  },
} as const;