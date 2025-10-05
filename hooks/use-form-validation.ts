import { useCallback, useState } from 'react';

import { validateField, ValidationResult } from '@/utils/validation';

type ValidationRules<T> = {
  [K in keyof T]?: ((value: string) => ValidationResult)[];
};

type FormErrors<T> = {
  [K in keyof T]?: string;
};

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const validateField = useCallback((field: keyof T): boolean => {
    const rules = validationRules[field];
    if (!rules || rules.length === 0) return true;

    const value = String(values[field] || '');
    
    for (const rule of rules) {
      const result = rule(value);
      if (!result.isValid) {
        setErrors(prev => ({ ...prev, [field]: result.error }));
        return false;
      }
    }

    setErrors(prev => ({ ...prev, [field]: undefined }));
    return true;
  }, [values, validationRules]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors<T> = {};
    let isValid = true;

    // Marcar todos os campos como touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Record<keyof T, boolean>);
    setTouched(allTouched);

    // Validar todos os campos
    Object.keys(validationRules).forEach(field => {
      const fieldKey = field as keyof T;
      const rules = validationRules[fieldKey];
      
      if (rules && rules.length > 0) {
        const value = String(values[fieldKey] || '');
        
        for (const rule of rules) {
          const result = rule(value);
          if (!result.isValid) {
            newErrors[fieldKey] = result.error;
            isValid = false;
            break;
          }
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm,
  };
}