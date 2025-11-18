import { Patient } from "@/types";

// Mock de horários disponíveis (08:00 - 21:00)
export const AVAILABLE_TIMES = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

// Mock de pacientes (temporário - remover quando API voltar)
export const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "+5511987654321",
    user_id: "mock-user",
    age: "35",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "+5511976543210",
    user_id: "mock-user",
    age: "28",
  },
  {
    id: "3",
    name: "Pedro Oliveira",
    email: "pedro.oliveira@email.com",
    phone: "+5511965432109",
    user_id: "mock-user",
    age: "42",
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "+5511954321098",
    user_id: "mock-user",
    age: "31",
  },
];
