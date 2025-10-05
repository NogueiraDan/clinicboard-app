import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  overlay?: boolean;
}

export const LoadingSpinner = React.memo<LoadingSpinnerProps>(({
  size = 'large',
  color,
  overlay = false,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const defaultColor = color || Colors[colorScheme].tint;

  if (overlay) {
    return (
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size={size} color={defaultColor} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={defaultColor} />
    </View>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});