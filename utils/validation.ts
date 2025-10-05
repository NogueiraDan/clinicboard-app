export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validationRules = {
  required: (value: string): ValidationResult => ({
    isValid: value.trim().length > 0,
    error: value.trim().length === 0 ? 'Campo obrigatório' : undefined,
  }),

  email: (value: string): ValidationResult => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(value);
    return {
      isValid,
      error: !isValid ? 'Email inválido' : undefined,
    };
  },

  phone: (value: string): ValidationResult => {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    const isValid = phoneRegex.test(value);
    return {
      isValid,
      error: !isValid ? 'Telefone deve estar no formato (11) 99999-9999' : undefined,
    };
  },

  zipCode: (value: string): ValidationResult => {
    const zipRegex = /^\d{5}-\d{3}$/;
    const isValid = zipRegex.test(value);
    return {
      isValid,
      error: !isValid ? 'CEP deve estar no formato 12345-678' : undefined,
    };
  },

  minLength: (minLength: number) => (value: string): ValidationResult => {
    const isValid = value.trim().length >= minLength;
    return {
      isValid,
      error: !isValid ? `Deve ter pelo menos ${minLength} caracteres` : undefined,
    };
  },
} as const;

export const validateField = (
  value: string,
  rules: ((value: string) => ValidationResult)[]
): ValidationResult => {
  for (const rule of rules) {
    const result = rule(value);
    if (!result.isValid) {
      return result;
    }
  }
  return { isValid: true };
};