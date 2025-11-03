import axios from "axios";
import Constants from 'expo-constants';

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

export default api;