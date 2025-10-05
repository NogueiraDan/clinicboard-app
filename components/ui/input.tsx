import React, { forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  type TextInputProps,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isRequired?: boolean;
}

export const Input = React.memo(
  forwardRef<TextInput, InputProps>(
    ({ label, error, isRequired, style, ...props }, ref) => {
      const colorScheme = useColorScheme() ?? 'light';
      const colors = Colors[colorScheme];

      const inputStyles = [
        styles.input,
        {
          borderColor: error ? '#FF6B6B' : colors.icon,
          backgroundColor: colors.background,
          color: colors.text,
        },
        style,
      ];

      return (
        <View style={styles.container}>
          {label && (
            <Text style={[styles.label, { color: colors.text }]}>
              {label}
              {isRequired && <Text style={styles.required}> *</Text>}
            </Text>
          )}
          
          <TextInput
            ref={ref}
            style={inputStyles}
            placeholderTextColor={colors.icon}
            {...props}
          />
          
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      );
    }
  )
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  required: {
    color: '#FF6B6B',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    minHeight: 48,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 4,
  },
});