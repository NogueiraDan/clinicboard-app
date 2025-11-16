import { API_ENDPOINTS } from "@/constants/endpoints";
import { Appointment, Patient } from "@/types";
import api from "./api";

export const businessService = {
  findByUserId: async (user_id: string): Promise<Patient[]> => {
    const { data } = await api.get<Patient[]>(
      API_ENDPOINTS.BUSINESS_SERVICE.FIND_PATIENT_BY_USER_ID(user_id)
    );
    return data;
  },

  findById: async (patient_id: string): Promise<Patient> => {
    const { data } = await api.get<Patient>(
      API_ENDPOINTS.BUSINESS_SERVICE.FIND_PATIENT_BY_ID(patient_id)
    );
    return data;
  },

  createPatient: async (patient: Patient): Promise<Patient> => {
    const { data } = await api.post<Patient>(
      API_ENDPOINTS.BUSINESS_SERVICE.CREATE_PATIENT,
      patient
    );
    return data;
  },

  findAppointmentByDate: async (user_id: string, date: string): Promise<Appointment[]> => {
    const { data } = await api.get<Appointment[]>(
      API_ENDPOINTS.BUSINESS_SERVICE.FIND_APPOINTMENT_BY_DATE(user_id, date)
    );
    return data;
  },
};
