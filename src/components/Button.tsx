import React, { useRef } from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  View, 
  ViewStyle, 
  TextStyle,
  TouchableOpacityProps,
  Animated
} from 'react-native';
import { theme } from '../theme';
import { Typography } from './Typography';

type ButtonSize = 'small' | 'medium' | 'large';
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'success' | 'error';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...rest
}: ButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: theme.animation.scale.pressed,
      friction: 4,
      tension: 300,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: theme.animation.scale.default,
      friction: 3,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  const getContainerStyle = (): ViewStyle[] => {
    const styles: ViewStyle[] = [buttonStyles.container];
    
    // Add variant styles
    switch(variant) {
      case 'primary':
        styles.push(buttonStyles.primaryContainer);
        break;
      case 'secondary':
        styles.push(buttonStyles.secondaryContainer);
        break;
      case 'outline':
        styles.push(buttonStyles.outlineContainer);
        break;
      case 'text':
        styles.push(buttonStyles.textContainer);
        break;
      case 'success':
        styles.push(buttonStyles.successContainer);
        break;
      case 'error':
        styles.push(buttonStyles.errorContainer);
        break;
    }
    
    // Add size styles
    switch(size) {
      case 'small':
        styles.push(buttonStyles.smallContainer);
        break;
      case 'medium':
        styles.push(buttonStyles.mediumContainer);
        break;
      case 'large':
        styles.push(buttonStyles.largeContainer);
        break;
    }
    
    // Add full width style if needed
    if (fullWidth) {
      styles.push(buttonStyles.fullWidth);
    }
    
    // Add disabled style if needed
    if (disabled || loading) {
      styles.push(buttonStyles.disabledContainer);
    }
    
    return styles;
  };
  
  const getTextStyle = (): TextStyle[] => {
    const styles: TextStyle[] = [buttonStyles.text];
    
    // Add variant text styles
    switch(variant) {
      case 'primary':
        styles.push(buttonStyles.primaryText);
        break;
      case 'secondary':
        styles.push(buttonStyles.secondaryText);
        break;
      case 'outline':
        styles.push(buttonStyles.outlineText);
        break;
      case 'text':
        styles.push(buttonStyles.textOnlyText);
        break;
      case 'success':
        styles.push(buttonStyles.successText);
        break;
      case 'error':
        styles.push(buttonStyles.errorText);
        break;
    }
    
    // Add size text styles
    switch(size) {
      case 'small':
        styles.push(buttonStyles.smallText);
        break;
      case 'medium':
        styles.push(buttonStyles.mediumText);
        break;
      case 'large':
        styles.push(buttonStyles.largeText);
        break;
    }
    
    // Add disabled text style if needed
    if (disabled || loading) {
      styles.push(buttonStyles.disabledText);
    }
    
    return styles;
  };

  const getLoadingColor = (): string => {
    switch(variant) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
        return '#FFFFFF';
      case 'success':
        return '#FFFFFF';
      case 'error':
        return '#FFFFFF';
      case 'outline':
      case 'text':
        return theme.colors.primary;
      default:
        return '#FFFFFF';
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[...getContainerStyle(), style]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...rest}
      >
        <View style={buttonStyles.contentContainer}>
          {leftIcon && !loading && <View style={buttonStyles.leftIcon}>{leftIcon}</View>}
          
          {loading ? (
            <ActivityIndicator 
              size="small" 
              color={getLoadingColor()} 
              style={buttonStyles.loader} 
            />
          ) : (
            <Typography 
              style={Object.assign({}, ...getTextStyle(), textStyle)} 
              variant={size === 'small' ? 'small' : 'bodyBold'}
            >
              {title}
            </Typography>
          )}
          
          {rightIcon && !loading && <View style={buttonStyles.rightIcon}>{rightIcon}</View>}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const buttonStyles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryContainer: {
    backgroundColor: theme.colors.primary,
  },
  secondaryContainer: {
    backgroundColor: theme.colors.secondary,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  textContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  successContainer: {
    backgroundColor: theme.colors.success,
  },
  errorContainer: {
    backgroundColor: theme.colors.error,
  },
  smallContainer: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  mediumContainer: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  largeContainer: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  fullWidth: {
    width: '100%',
  },
  disabledContainer: {
    opacity: 0.6,
  },
  text: {
    textAlign: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: theme.colors.primary,
  },
  textOnlyText: {
    color: theme.colors.primary,
  },
  successText: {
    color: '#FFFFFF',
  },
  errorText: {
    color: '#FFFFFF',
  },
  smallText: {
    fontSize: theme.typography.sizes.small,
  },
  mediumText: {
    fontSize: theme.typography.sizes.body,
  },
  largeText: {
    fontSize: theme.typography.sizes.h4,
  },
  disabledText: {
    opacity: 0.8,
  },
  leftIcon: {
    marginRight: theme.spacing.xs,
  },
  rightIcon: {
    marginLeft: theme.spacing.xs,
  },
  loader: {
    marginHorizontal: theme.spacing.xs,
  }
});