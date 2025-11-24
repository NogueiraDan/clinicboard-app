import axios from "axios";
import Constants from "expo-constants";

import { API_CONFIG } from "@/constants/config";
import { fetchHeaders } from "@/utils/fetch-header";
import type { InternalAxiosRequestConfig } from "axios";

const getBaseURL = () => {
  // ⚠️ IMPORTANTE: Substitua pelo IP da sua máquina
  const LOCAL_IP = "192.168.2.102"; // 👈 ALTERE AQUI PARA O SEU IP

  // Desenvolvimento - Emulador Android
  if (
    __DEV__ &&
    Constants.platform?.android &&
    Constants.appOwnership === "expo"
  ) {
    return `http://${LOCAL_IP}:8080`;
  }

  // Desenvolvimento - Simulador iOS
  if (__DEV__ && Constants.platform?.ios && Constants.appOwnership === "expo") {
    return `http://${LOCAL_IP}:8080`;
  }

  // Desenvolvimento - Build Local (APK Debug)
  if (__DEV__) {
    return `http://${LOCAL_IP}:8080`;
  }

  // Produção
  return "https://sua-api-producao.com";
};

const api = axios.create({
  // baseURL: getBaseURL(),
  baseURL: API_CONFIG.BASE_URL, // Para device fisico
  timeout: API_CONFIG.TIMEOUT,
});

// Interceptor para logging (REMOVER EM PRODUÇÃO)
api.interceptors.request.use(
  (config) => {
    const timestamp = new Date().toISOString();
    console.log(
      `📡 [${timestamp}] API Request: ${config.method?.toUpperCase()} ${config.baseURL}${
      config.url
      }`
    );
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    const timestamp = new Date().toISOString();
      console.log(
        `✅ [${timestamp}] API Response: ${response.status} ${response.config.url}`
      );
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", error.message);
    if (error.code === "ECONNABORTED") {
      console.error("⏱️ Request timeout - Backend pode estar offline");
    }
    return Promise.reject(error);
  }
);

// Interceptor de autenticação
const authTokenInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  const headers = await fetchHeaders();
  if (config.headers) {
    Object.assign(config.headers, headers);
  }
  return config;
};

api.interceptors.request.use(authTokenInterceptor, (error) =>
  Promise.reject(error)
);

export default api;
