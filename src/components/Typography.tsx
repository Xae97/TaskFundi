import React from 'react';
import { Text, StyleSheet, TextProps, TextStyle, Platform } from 'react-native';
import { theme } from '../theme';

type VariantType = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodyBold' | 'small' | 'smallBold' | 'caption' | 'label';
type AlignType = 'auto' | 'left' | 'center' | 'right' | 'justify';
type ColorType = 'primary' | 'secondary' | 'muted' | 'accent' | 'error' | 'success' | 'warning' | 'white' | 'surface';

interface TypographyProps extends TextProps {
  variant?: VariantType;
  color?: ColorType;
  align?: AlignType;
  style?: TextStyle;
  children: React.ReactNode;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  gutterBottom?: boolean;
  animated?: boolean;
}

export function Typography({
  variant = 'body',
  color = 'primary',
  align = 'left',
  style,
  children,
  numberOfLines,
  ellipsizeMode,
  gutterBottom = false,
  animated = false,
  ...rest
}: TypographyProps) {
  const getTextStyles = () => {
    const styles: TextStyle[] = [typographyStyles.text];
    
    // Add variant styles
    switch(variant) {
      case 'h1':
        styles.push(typographyStyles.h1);
        break;
      case 'h2':
        styles.push(typographyStyles.h2);
        break;
      case 'h3':
        styles.push(typographyStyles.h3);
        break;
      case 'h4':
        styles.push(typographyStyles.h4);
        break;
      case 'bodyBold':
        styles.push(typographyStyles.bodyBold);
        break;
      case 'small':
        styles.push(typographyStyles.small);
        break;
      case 'smallBold':
        styles.push(typographyStyles.smallBold);
        break;
      case 'caption':
        styles.push(typographyStyles.caption);
        break;
      case 'label':
        styles.push(typographyStyles.label);
        break;
      default:
        styles.push(typographyStyles.body);
    }
    
    // Add color styles
    switch(color) {
      case 'primary':
        styles.push(typographyStyles.colorPrimary);
        break;
      case 'secondary':
        styles.push(typographyStyles.colorSecondary);
        break;
      case 'muted':
        styles.push(typographyStyles.colorMuted);
        break;
      case 'accent':
        styles.push(typographyStyles.colorAccent);
        break;
      case 'error':
        styles.push(typographyStyles.colorError);
        break;
      case 'success':
        styles.push(typographyStyles.colorSuccess);
        break;
      case 'warning':
        styles.push(typographyStyles.colorWarning);
        break;
      case 'white':
        styles.push(typographyStyles.colorWhite);
        break;
      case 'surface':
        styles.push(typographyStyles.colorSurface);
        break;
    }
    
    // Add alignment styles
    switch(align) {
      case 'center':
        styles.push(typographyStyles.alignCenter);
        break;
      case 'right':
        styles.push(typographyStyles.alignRight);
        break;
      case 'justify':
        styles.push(typographyStyles.alignJustify);
        break;
      default:
        styles.push(typographyStyles.alignLeft);
    }
    
    // Add gutter bottom if needed
    if (gutterBottom) {
      styles.push(typographyStyles.gutterBottom);
    }
    
    return styles;
  };
  
  const TextComponent = Text;
  
  return (
    <TextComponent 
      style={[...getTextStyles(), style]} 
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      allowFontScaling={false}
      {...rest}
    >
      {children}
    </TextComponent>
  );
}

const typographyStyles = StyleSheet.create({
  text: {
    lineHeight: theme.typography.lineHeights.normal,
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'Roboto',
      }
    }),
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  h1: {
    fontSize: theme.typography.sizes.h1,
    fontWeight: '700',
    lineHeight: theme.typography.lineHeights.tight,
    marginBottom: theme.spacing.md,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: '700',
    lineHeight: theme.typography.lineHeights.tight,
    marginBottom: theme.spacing.sm,
    letterSpacing: -0.25,
  },
  h3: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: '600',
    lineHeight: theme.typography.lineHeights.tight,
    marginBottom: theme.spacing.sm,
  },
  h4: {
    fontSize: theme.typography.sizes.h4,
    fontWeight: '600',
    lineHeight: theme.typography.lineHeights.tight,
    marginBottom: theme.spacing.xs,
  },
  body: {
    fontSize: theme.typography.sizes.body,
    fontWeight: '400',
    lineHeight: theme.typography.lineHeights.relaxed,
  },
  bodyBold: {
    fontSize: theme.typography.sizes.body,
    fontWeight: '600',
    lineHeight: theme.typography.lineHeights.relaxed,
  },
  small: {
    fontSize: theme.typography.sizes.small,
    fontWeight: '400',
    lineHeight: theme.typography.lineHeights.normal,
  },
  smallBold: {
    fontSize: theme.typography.sizes.small,
    fontWeight: '600',
    lineHeight: theme.typography.lineHeights.normal,
  },
  caption: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: '400',
    lineHeight: theme.typography.lineHeights.tight,
  },
  label: {
    fontSize: theme.typography.sizes.small,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
    letterSpacing: 0.25,
  },
  colorPrimary: {
    color: theme.colors.text.primary,
  },
  colorSecondary: {
    color: theme.colors.text.secondary,
  },
  colorMuted: {
    color: theme.colors.text.muted,
  },
  colorAccent: {
    color: theme.colors.accent,
  },
  colorError: {
    color: theme.colors.error,
  },
  colorSuccess: {
    color: theme.colors.success,
  },
  colorWarning: {
    color: theme.colors.warning,
  },
  colorWhite: {
    color: theme.colors.surface,
  },
  colorSurface: {
    color: theme.colors.surface,
  },
  alignLeft: {
    textAlign: 'left',
  },
  alignCenter: {
    textAlign: 'center',
  },
  alignRight: {
    textAlign: 'right',
  },
  alignJustify: {
    textAlign: 'justify',
  },
  gutterBottom: {
    marginBottom: theme.spacing.md,
  },
});