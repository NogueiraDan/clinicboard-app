import axios from "axios";
import Constants from 'expo-constants';

import { fetchHeaders } from "@/utils/fetch-header";
import type { InternalAxiosRequestConfig } from "axios";

const getBaseURL = () => {
  // Se está em desenvolvimento no emulator
  if (__DEV__ && Constants.platform?.android) {
    return 'http://10.0.2.2:8080';
  }
  
  // Se está em desenvolvimento no iOS simulator
  if (__DEV__ && Constants.platform?.ios) {
    return 'http://localhost:8080';
  }
  
  // Produção
  return 'https://sua-api-producao.com';
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// Interceptor nomeado para adicionar o token de autenticação
const authTokenInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  const headers = await fetchHeaders();
  if (config.headers) {
    Object.assign(config.headers, headers);
  }
  // Se não houver headers, não faz nada (Axios já inicializa corretamente)
  return config;
};

api.interceptors.request.use(authTokenInterceptor, (error) => Promise.reject(error));

export default api;