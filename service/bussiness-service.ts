import { API_ENDPOINTS } from "@/constants/endpoints";
import { Patient } from "@/types";
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

  register: async (patient: Patient): Promise<Patient> => {
    const { data } = await api.post<Patient>(
      API_ENDPOINTS.BUSINESS_SERVICE.CREATE_PATIENT,
      patient
    );
    return data;
  },
};
