import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { Metrics } from '@/constants/metrics';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface PatientInfoRowProps {
  label: string;
  value: string | string[];
  isLast?: boolean;
}

export const PatientInfoRow = React.memo<PatientInfoRowProps>(({
  label,
  value,
  isLast = false,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const renderValue = () => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'Não informado';
    }
    return value || 'Não informado';
  };

  return (
    <ThemedView style={[styles.row, !isLast && { borderBottomColor: colors.icon + '20' }]}>
      <ThemedText style={[styles.label, { color: colors.icon }]}>
        {label}
      </ThemedText>
      <ThemedText style={styles.value} numberOfLines={3}>
        {renderValue()}
      </ThemedText>
    </ThemedView>
  );
});

PatientInfoRow.displayName = 'PatientInfoRow';

const styles = StyleSheet.create({
  row: {
    paddingVertical: Metrics.padding.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: Metrics.fontSize.sm,
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontSize: Metrics.fontSize.md,
    lineHeight: 20,
  },
});