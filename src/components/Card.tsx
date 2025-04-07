import React, { useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ViewStyle, 
  ViewProps,
  Animated,
  Platform,
} from 'react-native';
import { theme } from '../theme';
import { Typography } from './Typography';

interface CardProps extends ViewProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  elevation?: 'none' | 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined' | 'filled';
  actionContent?: React.ReactNode;
  animateOnPress?: boolean;
}

export function Card({
  title,
  subtitle,
  children,
  onPress,
  style,
  contentStyle,
  elevation = 'small',
  variant = 'default',
  actionContent,
  animateOnPress = true,
  ...rest
}: CardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    if (onPress && animateOnPress) {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        friction: 5,
        tension: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  
  const handlePressOut = () => {
    if (onPress && animateOnPress) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const getCardStyle = (): ViewStyle[] => {
    const styles: ViewStyle[] = [cardStyles.card];
    
    // Add elevation styles
    switch(elevation) {
      case 'none':
        break;
      case 'small':
        styles.push(cardStyles.elevationSmall);
        break;
      case 'medium':
        styles.push(cardStyles.elevationMedium);
        break;
      case 'large':
        styles.push(cardStyles.elevationLarge);
        break;
    }
    
    // Add variant styles
    switch(variant) {
      case 'default':
        styles.push(cardStyles.variantDefault);
        break;
      case 'outlined':
        styles.push(cardStyles.variantOutlined);
        break;
      case 'filled':
        styles.push(cardStyles.variantFilled);
        break;
    }
    
    return styles;
  };
  
  const CardContent = () => (
    <>
      {(title || subtitle) && (
        <View style={cardStyles.header}>
          {title && (
            <Typography 
              variant="h4" 
              style={cardStyles.title}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography 
              variant="small" 
              color="muted" 
              style={cardStyles.subtitle}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {subtitle}
            </Typography>
          )}
        </View>
      )}
      
      <View style={[cardStyles.content, contentStyle]}>
        {children}
      </View>
      
      {actionContent && (
        <View style={cardStyles.actions}>
          {actionContent}
        </View>
      )}
    </>
  );
  
  if (onPress) {
    return (
      <Animated.View
        style={[
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <TouchableOpacity
          style={[...getCardStyle(), style]}
          onPress={onPress}
          activeOpacity={0.9}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          {...rest}
        >
          <CardContent />
        </TouchableOpacity>
      </Animated.View>
    );
  }
  
  return (
    <View style={[...getCardStyle(), style]} {...rest}>
      <CardContent />
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    marginVertical: theme.spacing.sm,
    marginHorizontal: 2,
    borderWidth: Platform.OS === 'ios' ? 0.5 : 0,
    borderColor: 'rgba(0,0,0,0.05)',
    width: '100%',
  },
  header: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xs,
    flexDirection: 'column',
  },
  title: {
    flexShrink: 1,
    flexWrap: 'wrap',
    maxWidth: '100%', // Changed from 95% to ensure full use of space
  },
  subtitle: {
    marginTop: theme.spacing.xs / 2,
    flexWrap: 'wrap',
    maxWidth: '100%', // Changed from 95% to ensure full use of space
  },
  content: {
    padding: theme.spacing.md,
    flexDirection: 'column',
    overflow: 'hidden', // Added to ensure content doesn't overflow
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: theme.spacing.md,
    paddingTop: 0,
    marginTop: theme.spacing.xs,
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  elevationSmall: {
    ...theme.elevation.small,
  },
  elevationMedium: {
    ...theme.elevation.medium,
  },
  elevationLarge: {
    ...theme.elevation.large,
  },
  variantDefault: {
    backgroundColor: theme.colors.surface,
  },
  variantOutlined: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
  },
  variantFilled: {
    backgroundColor: theme.colors.background,
  },
});