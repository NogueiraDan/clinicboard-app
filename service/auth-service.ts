import { API_ENDPOINTS } from "@/constants/endpoints";
import { LoginRequest, LoginResponse, User } from "@/types";
import api from "./api";

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>(
      API_ENDPOINTS.USER_SERVICE.LOGIN,
      credentials
    );
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post(API_ENDPOINTS.USER_SERVICE.LOGOUT);
  },

  register: async (user: User): Promise<User> => {
    const { data } = await api.post<User>(
      API_ENDPOINTS.USER_SERVICE.REGISTER,
      user
    );
    return data;
  },
};
