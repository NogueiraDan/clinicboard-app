export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  address: Address;
  medicalHistory?: string;
  allergies?: string[];
  emergencyContact: EmergencyContact;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface PatientFormData {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  address: Address;
  medicalHistory?: string;
  allergies: string;
  emergencyContact: EmergencyContact;
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
