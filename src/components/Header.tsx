import React from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Typography } from './Typography';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  transparent?: boolean;
  variant?: 'default' | 'large' | 'compact';
  showLogo?: boolean;
}

export function Header({
  title,
  subtitle,
  leftIcon = 'arrow-back',
  rightIcon,
  onLeftPress,
  onRightPress,
  transparent = false,
  variant = 'default',
  showLogo = false,
}: HeaderProps) {
  // Calculate status bar height
  const statusBarHeight = StatusBar.currentHeight || (Platform.OS === 'ios' ? 44 : 0);

  return (
    <View
      style={[
        styles.container,
        transparent && styles.transparent,
        variant === 'large' && styles.large,
        variant === 'compact' && styles.compact,
        { paddingTop: transparent ? statusBarHeight : statusBarHeight + theme.spacing.sm },
      ]}
    >
      <StatusBar
        barStyle={transparent ? "light-content" : "dark-content"}
        backgroundColor={transparent ? "transparent" : theme.colors.surface}
        translucent={transparent}
      />
      
      <View style={styles.header}>
        {/* Left section */}
        <View style={styles.leftSection}>
          {onLeftPress && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onLeftPress}
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
            >
              <Ionicons
                name={leftIcon as any}
                size={24}
                color={transparent ? theme.colors.surface : theme.colors.text.primary}
              />
            </TouchableOpacity>
          )}
          
          {showLogo && (
            <View style={styles.logoContainer}>
              <View style={styles.logoBox}>
                <Typography variant="h4" color={transparent ? "surface" : "primary"} style={styles.logoText}>
                  TF
                </Typography>
              </View>
            </View>
          )}
        </View>

        {/* Center section */}
        <View style={styles.centerSection}>
          <Typography
            variant={variant === 'large' ? 'h3' : 'h4'}
            color={transparent ? "surface" : "primary"}
            numberOfLines={1}
            style={styles.title}
          >
            {title}
          </Typography>
          
          {subtitle && (
            <Typography
              variant="small"
              color={transparent ? "surface" : "secondary"}
              numberOfLines={1}
              style={styles.subtitle}
            >
              {subtitle}
            </Typography>
          )}
        </View>

        {/* Right section */}
        <View style={styles.rightSection}>
          {rightIcon && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onRightPress}
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
              disabled={!onRightPress}
            >
              <Ionicons
                name={rightIcon as any}
                size={24}
                color={transparent ? theme.colors.surface : theme.colors.text.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {variant === 'large' && (
        <View style={styles.decorativePattern} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    width: '100%',
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  large: {
    paddingBottom: theme.spacing.lg,
  },
  compact: {
    paddingBottom: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 40,
  },
  iconButton: {
    padding: theme.spacing.xs,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 2,
  },
  logoContainer: {
    marginLeft: theme.spacing.xs,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: theme.colors.surface,
    fontWeight: 'bold',
  },
  decorativePattern: {
    position: 'absolute',
    bottom: -theme.spacing.xl,
    right: -theme.spacing.xl,
    width: 120,
    height: 120,
    opacity: 0.05,
    backgroundColor: theme.colors.primary,
    transform: [{ rotate: '45deg' }],
  },
});