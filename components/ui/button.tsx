import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    type TouchableOpacityProps
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  textStyle?: object;
}

export const Button = React.memo<ButtonProps>(({ 
  title, 
  variant = 'primary', 
  isLoading = false,
  disabled,
  style,
  textStyle,
  ...props 
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const buttonStyles = [
    styles.button,
    variant === 'primary' && { backgroundColor: colors.tint },
    variant === 'secondary' && { backgroundColor: colors.icon },
    variant === 'outline' && { 
      backgroundColor: 'transparent', 
      borderWidth: 1, 
      borderColor: colors.tint 
    },
    (disabled || isLoading) && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    variant === 'primary' && { color: '#FFFFFF' },
    variant === 'secondary' && { color: '#FFFFFF' },
    variant === 'outline' && { color: colors.tint },
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? colors.tint : '#FFFFFF'} 
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
});