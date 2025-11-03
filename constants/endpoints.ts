export const API_ENDPOINTS = {
  USER_SERVICE: {
    LOGIN: '/user-service/auth/login',
    LOGOUT: '/user-service/auth/logout',
    REGISTER: `/user-service/auth/register`,
    FIND_USER_BY_ID: (id: string) => `/user-service/users/${id}`,
    FIND_USER_BY_EMAIL: (email: string) => `/user-service/users/user?email=${email}`,
    FIND_ALL_USERS: '/user-service/users',
    DELETE_USER: (id: string) => `/user-service/users/${id}`,
    UPDATE_USER: (id: string) => `/user-service/users/${id}`,
  },
  BUSINESS_SERVICE: {
    // Patients
    CREATE_PATIENT: '/business-service/patients',
    FIND_ALL_PATIENT: '/business-service/patients',
    FIND_PATIENT_BY_ID: (id: string) => `/business-service/patients/${id}`,
    FIND_PATIENT_BY_USER_ID: (user_id: string) => `/business-service/patients/user/${user_id}`,
    FIND_PATIENT_BY_NAME: (name: string) => `/business-service/patients/patient?name=${name}`,
    UPDATE_PATIENT: (id: string) => `/business-service/patients/${id}`,
    DELETE_PATIENT: (id: string) => `/business-service/patients/${id}`,
    // Appointments
    CREATE_APPOINTMENT: '/business-service/appointments',
    FIND_ALL_APPOINTMENT: '/business-service/appointments',
    FIND_APPOINTMENT_BY_DATE: (userId: string, date: string) => `/business-service/appointments/${userId}/date?date=${date}`,
    FIND_AVAILABLE_APPOINTMENT: (userId: string, date: string) => `/business-service/appointments/${userId}/available?date=${date}`,
    DELETE_APPOINTMENT: (id: string) => `/business-service/appointments/${id}`,
    UPDATE_APPOINTMENT: (id: string) => `/business-service/appointments/${id}`,
  },
} as const;