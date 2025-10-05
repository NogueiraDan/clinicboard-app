import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { Metrics } from '@/constants/metrics';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface PatientInfoCardProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
  onEdit?: () => void;
  isEditable?: boolean;
}

export const PatientInfoCard = React.memo<PatientInfoCardProps>(({
  title,
  children,
  icon,
  onEdit,
  isEditable = false,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <ThemedView style={[styles.card, { borderColor: colors.icon + '30' }]}>
      <ThemedView style={styles.cardHeader}>
        <ThemedView style={styles.titleContainer}>
          {icon && (
            <IconSymbol
              name={icon as any}
              size={Metrics.iconSize.md}
              color={colors.tint}
            />
          )}
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            {title}
          </ThemedText>
        </ThemedView>
        
        {isEditable && onEdit && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={onEdit}
            activeOpacity={Metrics.touchableOpacity}
          >
            <IconSymbol
              name="pencil"
              size={Metrics.iconSize.sm}
              color={colors.icon}
            />
          </TouchableOpacity>
        )}
      </ThemedView>
      
      <ThemedView style={styles.cardContent}>
        {children}
      </ThemedView>
    </ThemedView>
  );
});

PatientInfoCard.displayName = 'PatientInfoCard';

const styles = StyleSheet.create({
  card: {
    borderRadius: Metrics.borderRadius.lg,
    borderWidth: 1,
    marginBottom: Metrics.margin.md,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Metrics.padding.md,
    paddingVertical: Metrics.padding.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Metrics.margin.sm,
  },
  cardTitle: {
    fontSize: Metrics.fontSize.md,
  },
  editButton: {
    padding: Metrics.padding.xs,
  },
  cardContent: {
    padding: Metrics.padding.md,
  },
});