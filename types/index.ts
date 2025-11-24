export interface Patient {
  id?: string;
  additional_info?: string;
  age?: string;
  name: string;
  email: string;
  phone: string;
  user_id: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  id: string;
  name: string;
  email: string;
  contact: string;
  role: string;
  access_token: string;
};

export type User = {
  id?: string;
  role?: string;
  password?: string;
  name: string;
  email: string;
  contact: string;
};

export enum AppointmentType {
  MARCACAO = 'MARCACAO',
  REMARCACAO = 'REMARCACAO',
  CANCELAMENTO = 'CANCELAMENTO',
}

export interface Appointment {
  id?: string;
  date: string;
  hour: string;
  type: AppointmentType;
  user_id: string;
  patient_id: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'reminder' | 'system';
  isRead: boolean;
  createdAt: string;
}