import React, { useState } from 'react';
import { TextInput, StyleSheet, Text, View, TextInputProps, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function FormInput({ label, error, icon, ...props }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: theme.animation.timing.normal,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!props.value) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: theme.animation.timing.normal,
        useNativeDriver: false,
      }).start();
    }
  };

  const labelStyle = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -25],
        }),
      },
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.85],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.label, labelStyle]}>
        {label}
      </Animated.Text>
      
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        error && styles.inputContainerError,
        props.multiline && styles.inputContainerMultiline,
      ]}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={error 
              ? theme.colors.error 
              : isFocused 
                ? theme.colors.primary 
                : theme.colors.text.muted
            } 
            style={styles.icon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            props.multiline && styles.inputMultiline,
          ]}
          placeholderTextColor={theme.colors.text.muted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {error && (
          <Ionicons 
            name="alert-circle" 
            size={20} 
            color={theme.colors.error}
            style={styles.errorIcon}
          />
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    position: 'absolute',
    left: theme.spacing.md,
    top: theme.spacing.lg,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.xs,
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.text.muted,
    paddingHorizontal: theme.spacing.md,
    ...theme.elevation.small,
  },
  inputContainerFocused: {
    borderColor: theme.colors.primary,
  },
  inputContainerError: {
    borderColor: theme.colors.error,
  },
  inputContainerMultiline: {
    minHeight: 100,
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.primary,
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  errorIcon: {
    marginLeft: theme.spacing.sm,
  },
  errorText: {
    marginTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.error,
  },
});