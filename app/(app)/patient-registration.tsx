import React, { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Colors } from '@/constants/theme';
import { Metrics } from '@/constants/metrics';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFormValidation } from '@/hooks/use-form-validation';
import { PatientFormData } from '@/types';
import { validationRules } from '@/utils/validation';
import { formatters } from '@/utils/formatters';

const INITIAL_VALUES: PatientFormData = {
  name: '',
  email: '',
  phone: '',
  birthDate: '',
  address: {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  },
  medicalHistory: '',
  allergies: '',
  emergencyContact: {
    name: '',
    phone: '',
    relationship: '',
  },
};

const VALIDATION_RULES = {
  name: [validationRules.required, validationRules.minLength(2)],
  email: [validationRules.required, validationRules.email],
  phone: [validationRules.required, validationRules.phone],
  birthDate: [validationRules.required],
  'address.street': [validationRules.required],
  'address.number': [validationRules.required],
  'address.neighborhood': [validationRules.required],
  'address.city': [validationRules.required],
  'address.state': [validationRules.required],
  'address.zipCode': [validationRules.required, validationRules.zipCode],
  'emergencyContact.name': [validationRules.required],
  'emergencyContact.phone': [validationRules.required, validationRules.phone],
  'emergencyContact.relationship': [validationRules.required],
};

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const SectionHeader = React.memo<SectionHeaderProps>(({ title, subtitle }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <ThemedView style={styles.sectionHeader}>
      <ThemedText type="subtitle">{title}</ThemedText>
      {subtitle && (
        <ThemedText style={[styles.sectionSubtitle, { color: colors.icon }]}>
          {subtitle}
        </ThemedText>
      )}
    </ThemedView>
  );
});

SectionHeader.displayName = 'SectionHeader';

export default function PatientRegistrationScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);

  const {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateForm,
    resetForm,
  } = useFormValidation(INITIAL_VALUES, VALIDATION_RULES);

  const handleInputChange = useCallback((field: keyof PatientFormData | string, value: string) => {
    if (field.includes('.')) {
      // Handle nested fields
      const [parent, child] = field.split('.');
      const parentValue = values[parent as keyof PatientFormData];
      
      if (typeof parentValue === 'object' && parentValue !== null) {
        setValue(parent as keyof PatientFormData, {
          ...parentValue,
          [child]: value,
        });
      }
    } else {
      setValue(field as keyof PatientFormData, value);
    }
  }, [values, setValue]);

  const getFieldValue = useCallback((field: string): string => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const parentValue = values[parent as keyof PatientFormData];
      
      if (typeof parentValue === 'object' && parentValue !== null) {
        return String((parentValue as any)[child] || '');
      }
    }
    
    return String(values[field as keyof PatientFormData] || '');
  }, [values]);

  const getFieldError = useCallback((field: string): string | undefined => {
    if (field.includes('.')) {
      return errors[field as keyof typeof errors];
    }
    
    return errors[field as keyof PatientFormData];
  }, [errors]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      Alert.alert('Erro de Validação', 'Por favor, corrija os erros no formulário.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Sucesso!',
        'Paciente cadastrado com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar o paciente. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [validateForm, resetForm]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Cancelar Cadastro',
      'Tem certeza que deseja cancelar? Todos os dados preenchidos serão perdidos.',
      [
        { text: 'Continuar Editando', style: 'cancel' },
        {
          text: 'Cancelar',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  }, []);

  const formattedPhone = useMemo(() => 
    formatters.phone(getFieldValue('phone')), 
    [getFieldValue]
  );

  const formattedEmergencyPhone = useMemo(() => 
    formatters.phone(getFieldValue('emergencyContact.phone')), 
    [getFieldValue]
  );

  const formattedZipCode = useMemo(() => 
    formatters.zipCode(getFieldValue('address.zipCode')), 
    [getFieldValue]
  );

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleCancel}
          activeOpacity={Metrics.touchableOpacity}
        >
          <IconSymbol
            name="chevron.left"
            size={Metrics.iconSize.md}
            color={colors.icon}
          />
        </TouchableOpacity>
        
        <ThemedView style={styles.headerContent}>
          <ThemedText type="title" numberOfLines={1}>
            Novo Paciente
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: colors.icon }]}>
            Preencha as informações do paciente
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Informações Pessoais */}
          <SectionHeader 
            title="Informações Pessoais"
            subtitle="Dados básicos do paciente"
          />
          
          <Input
            label="Nome Completo"
            value={getFieldValue('name')}
            onChangeText={(value) => handleInputChange('name', value)}
            onBlur={() => setFieldTouched('name')}
            placeholder="Digite o nome completo"
            autoCapitalize="words"
            error={getFieldError('name')}
            isRequired
          />

          <Input
            label="Email"
            value={getFieldValue('email')}
            onChangeText={(value) => handleInputChange('email', value)}
            onBlur={() => setFieldTouched('email')}
            placeholder="exemplo@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={getFieldError('email')}
            isRequired
          />

          <Input
            label="Telefone"
            value={formattedPhone}
            onChangeText={(value) => handleInputChange('phone', value)}
            onBlur={() => setFieldTouched('phone')}
            placeholder="(11) 99999-9999"
            keyboardType="phone-pad"
            error={getFieldError('phone')}
            isRequired
          />

          <Input
            label="Data de Nascimento"
            value={getFieldValue('birthDate')}
            onChangeText={(value) => handleInputChange('birthDate', value)}
            onBlur={() => setFieldTouched('birthDate')}
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
            error={getFieldError('birthDate')}
            isRequired
          />

          {/* Endereço */}
          <SectionHeader 
            title="Endereço"
            subtitle="Endereço residencial do paciente"
          />

          <Input
            label="CEP"
            value={formattedZipCode}
            onChangeText={(value) => handleInputChange('address.zipCode', value)}
            onBlur={() => setFieldTouched('address.zipCode')}
            placeholder="12345-678"
            keyboardType="numeric"
            error={getFieldError('address.zipCode')}
            isRequired
          />

          <ThemedView style={styles.row}>
            <ThemedView style={[styles.inputContainer, { flex: 2 }]}>
              <Input
                label="Rua"
                value={getFieldValue('address.street')}
                onChangeText={(value) => handleInputChange('address.street', value)}
                onBlur={() => setFieldTouched('address.street')}
                placeholder="Nome da rua"
                error={getFieldError('address.street')}
                isRequired
              />
            </ThemedView>
            
            <ThemedView style={[styles.inputContainer, { flex: 1 }]}>
              <Input
                label="Número"
                value={getFieldValue('address.number')}
                onChangeText={(value) => handleInputChange('address.number', value)}
                onBlur={() => setFieldTouched('address.number')}
                placeholder="123"
                keyboardType="numeric"
                error={getFieldError('address.number')}
                isRequired
              />
            </ThemedView>
          </ThemedView>

          <Input
            label="Complemento"
            value={getFieldValue('address.complement')}
            onChangeText={(value) => handleInputChange('address.complement', value)}
            placeholder="Apto, sala, bloco (opcional)"
          />

          <Input
            label="Bairro"
            value={getFieldValue('address.neighborhood')}
            onChangeText={(value) => handleInputChange('address.neighborhood', value)}
            onBlur={() => setFieldTouched('address.neighborhood')}
            placeholder="Nome do bairro"
            error={getFieldError('address.neighborhood')}
            isRequired
          />

          <ThemedView style={styles.row}>
            <ThemedView style={[styles.inputContainer, { flex: 2 }]}>
              <Input
                label="Cidade"
                value={getFieldValue('address.city')}
                onChangeText={(value) => handleInputChange('address.city', value)}
                onBlur={() => setFieldTouched('address.city')}
                placeholder="Nome da cidade"
                error={getFieldError('address.city')}
                isRequired
              />
            </ThemedView>
            
            <ThemedView style={[styles.inputContainer, { flex: 1 }]}>
              <Input
                label="Estado"
                value={getFieldValue('address.state')}
                onChangeText={(value) => handleInputChange('address.state', value)}
                onBlur={() => setFieldTouched('address.state')}
                placeholder="SP"
                autoCapitalize="characters"
                maxLength={2}
                error={getFieldError('address.state')}
                isRequired
              />
            </ThemedView>
          </ThemedView>

          {/* Contato de Emergência */}
          <SectionHeader 
            title="Contato de Emergência"
            subtitle="Pessoa para contatar em caso de emergência"
          />

          <Input
            label="Nome"
            value={getFieldValue('emergencyContact.name')}
            onChangeText={(value) => handleInputChange('emergencyContact.name', value)}
            onBlur={() => setFieldTouched('emergencyContact.name')}
            placeholder="Nome do contato"
            autoCapitalize="words"
            error={getFieldError('emergencyContact.name')}
            isRequired
          />

          <Input
            label="Telefone"
            value={formattedEmergencyPhone}
            onChangeText={(value) => handleInputChange('emergencyContact.phone', value)}
            onBlur={() => setFieldTouched('emergencyContact.phone')}
            placeholder="(11) 99999-9999"
            keyboardType="phone-pad"
            error={getFieldError('emergencyContact.phone')}
            isRequired
          />

          <Input
            label="Parentesco"
            value={getFieldValue('emergencyContact.relationship')}
            onChangeText={(value) => handleInputChange('emergencyContact.relationship', value)}
            onBlur={() => setFieldTouched('emergencyContact.relationship')}
            placeholder="Ex: Mãe, Pai, Cônjuge"
            autoCapitalize="words"
            error={getFieldError('emergencyContact.relationship')}
            isRequired
          />

          {/* Informações Médicas */}
          <SectionHeader 
            title="Informações Médicas"
            subtitle="Histórico médico e alergias (opcional)"
          />

          <Input
            label="Histórico Médico"
            value={getFieldValue('medicalHistory')}
            onChangeText={(value) => handleInputChange('medicalHistory', value)}
            placeholder="Descreva o histórico médico relevante"
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />

          <Input
            label="Alergias"
            value={getFieldValue('allergies')}
            onChangeText={(value) => handleInputChange('allergies', value)}
            placeholder="Liste as alergias conhecidas"
            multiline
            numberOfLines={2}
            style={styles.textArea}
          />
        </ScrollView>

        {/* Footer com botões */}
        <ThemedView style={[styles.footer, { borderTopColor: colors.icon }]}>
          <Button
            title="Cancelar"
            onPress={handleCancel}
            variant="outline"
            disabled={isLoading}
          />
          
          <Button
            title="Cadastrar Paciente"
            onPress={handleSubmit}
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
          />
        </ThemedView>
      </KeyboardAvoidingView>

      {isLoading && <LoadingSpinner overlay />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Metrics.padding.lg,
    paddingVertical: Metrics.padding.md,
    gap: Metrics.margin.md,
  },
  backButton: {
    padding: Metrics.padding.sm,
  },
  headerContent: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: Metrics.fontSize.sm,
    marginTop: 2,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Metrics.padding.lg,
    paddingBottom: Metrics.padding.xl,
  },
  sectionHeader: {
    marginTop: Metrics.margin.lg,
    marginBottom: Metrics.margin.md,
  },
  sectionSubtitle: {
    fontSize: Metrics.fontSize.sm,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: Metrics.margin.md,
  },
  inputContainer: {
    flex: 1,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Metrics.padding.lg,
    paddingVertical: Metrics.padding.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: Metrics.margin.md,
  },
});