import { useCallback, useEffect, useState } from 'react';

import { Patient } from '@/types';

interface UsePatientDataReturn {
  patient: Patient | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePatientData(patientId: string): UsePatientDataReturn {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatient = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - aqui seria uma chamada real para a API
      const mockPatient: Patient = {
        id: patientId,
        name: 'João Silva',
        email: 'joao.silva@email.com',
        phone: '(11) 99999-9999',
        birthDate: '1985-03-15',
        address: {
          street: 'Rua das Flores',
          number: '123',
          complement: 'Apto 45',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
        },
        medicalHistory: 'Hipertensão arterial controlada com medicação. Histórico familiar de diabetes.',
        allergies: ['Penicilina', 'Dipirona'],
        emergencyContact: {
          name: 'Maria Silva',
          phone: '(11) 88888-8888',
          relationship: 'Esposa',
        },
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      };
      
      setPatient(mockPatient);
    } catch (err) {
      setError('Erro ao carregar dados do paciente');
      console.error('Error fetching patient:', err);
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    if (patientId) {
      fetchPatient();
    }
  }, [patientId, fetchPatient]);

  const refetch = useCallback(async () => {
    await fetchPatient();
  }, [fetchPatient]);

  return {
    patient,
    isLoading,
    error,
    refetch,
  };
}