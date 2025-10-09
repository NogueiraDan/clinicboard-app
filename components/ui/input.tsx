import React, { forwardRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isRequired?: boolean;
  labelStyle?: object;
}

export const Input = React.memo(
  forwardRef<TextInput, InputProps>(
  ({ label, error, isRequired, style, labelStyle, ...props }, ref) => {
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
        <View style={[styles.container, {
          backgroundColor: '#000',
          padding: 0,
          marginBottom: 16,
          width: '100%',
          alignSelf: 'stretch',
        }] }>
          {label && (
            <Text style={[
              styles.label,
              { color: '#fff', fontWeight: 'bold' },
              labelStyle,
            ]}>
              {label}
              {isRequired && <Text style={styles.required}> *</Text>}
            </Text>
          )}
          <TextInput
            ref={ref}
            style={[inputStyles, { width: '100%', alignSelf: 'stretch', backgroundColor: '#000', color: '#fff' }]}
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
    backgroundColor: 'transparent',
    width: '100%',
    alignSelf: 'stretch',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
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
    backgroundColor: '#000',
    color: '#fff',
    width: '100%',
    alignSelf: 'stretch',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 4,
  },
});