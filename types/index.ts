export interface Patient {
  id?: string;
  additional_info?: string;
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
