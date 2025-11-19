import Constants from 'expo-constants';

/**
 * 🔧 Configuração de API
 * 
 * Para usar no Expo Go:
 * 1. Descubra o IP da sua máquina (ipconfig/ifconfig)
 * 2. Defina em EXPO_PUBLIC_API_URL ou altere LOCAL_IP abaixo
 */
const LOCAL_IP = '192.168.2.101'; // 👈 ALTERE PARA SEU IP

export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? `http://${LOCAL_IP}:8080` 
    : 'https://sua-api-producao.com',
  TIMEOUT: 10000,
};

// Para debugging
if (__DEV__) {
  console.log(`🌐 API Base URL: ${API_CONFIG.BASE_URL}`);
  console.log(`📱 Platform: ${Constants.platform?.ios ? 'iOS' : 'Android'}`);
  console.log(`🏗️ App Ownership: ${Constants.appOwnership}`);
}