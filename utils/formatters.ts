export const formatters = {
  /**
   * Formata o valor digitado para o padrão '+55XXXXXXXXXXX' (E.164 Brasil)
   * Exemplo: input '11999876543' => '+5511999876543'
   */
  formatContactToBrazilE164: (value: string): string => {
    const onlyNumbers = value.replace(/\D/g, '').slice(0, 11);
    return onlyNumbers ? `+55${onlyNumbers}` : '';
  },
  
  /**
   * Formata telefone de forma inteligente, respeitando entrada do usuário
   */
  smartPhone: (value: string): string => {
    // Se já começar com +55, manter e apenas limpar caracteres inválidos
    if (value.startsWith('+55')) {
      const numbers = value.replace(/\D/g, '');
      const withoutCountryCode = numbers.slice(2); // Remove os '55' do país
      return `+55${withoutCountryCode.slice(0, 11)}`; // Limita a 11 dígitos após +55
    }
    
    // Se começar só com +, adicionar 55
    if (value.startsWith('+')) {
      const numbers = value.replace(/\D/g, '');
      return `+55${numbers.slice(0, 11)}`;
    }
    
    // Se for só números, adicionar +55
    const numbers = value.replace(/\D/g, '');
    return numbers ? `+55${numbers.slice(0, 11)}` : '';
  },
  phone: (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  },

  zipCode: (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 5) {
      return numbers;
    } else {
      return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
    }
  },

  cpf: (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    } else if (numbers.length <= 9) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    } else {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
    }
  },

  currency: (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  },

  date: (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR').format(dateObj);
  },

  dateTime: (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  },
} as const;