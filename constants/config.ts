import Constants from 'expo-constants';

/**
 * 🔧 Configuração de API
 *
 * As variáveis de ambiente são carregadas automaticamente do arquivo .env
 * usando o prefixo EXPO_PUBLIC_
 *
 * @see .env.example para o template de configuração
 * 
 * Para usar no Expo Go:
 * 1. Descubra o IP da sua máquina (ipconfig no Windows / ifconfig no Linux/Mac)
 * 2. Defina EXPO_PUBLIC_API_LOCAL_IP no arquivo .env
 */

/**
 * Mapeamento estático de variáveis de ambiente
 * Expo exige acesso estático às variáveis process.env
 */
const ENV_VARS = {
  EXPO_PUBLIC_API_LOCAL_IP: process.env.EXPO_PUBLIC_API_LOCAL_IP,
  EXPO_PUBLIC_API_PORT: process.env.EXPO_PUBLIC_API_PORT,
  EXPO_PUBLIC_API_PRODUCTION_URL: process.env.EXPO_PUBLIC_API_PRODUCTION_URL,
  EXPO_PUBLIC_API_TIMEOUT: process.env.EXPO_PUBLIC_API_TIMEOUT,
} as const;

type EnvKey = keyof typeof ENV_VARS;

const getEnvVar = (key: EnvKey, fallback: string): string => {
  const value = ENV_VARS[key];
  if (!value && __DEV__) {
    console.warn(
      `⚠️ Variável de ambiente ${key} não definida. Usando fallback: ${fallback}`
    );
  }
  return value || fallback;
};

const LOCAL_IP = getEnvVar('EXPO_PUBLIC_API_LOCAL_IP', '192.168.2.101');
const API_PORT = getEnvVar('EXPO_PUBLIC_API_PORT', '8080');

export const API_CONFIG = {
  BASE_URL: __DEV__
    ? `http://${LOCAL_IP}:${API_PORT}`
    : getEnvVar('EXPO_PUBLIC_API_PRODUCTION_URL', 'https://sua-api-producao.com'),
  TIMEOUT: Number(getEnvVar('EXPO_PUBLIC_API_TIMEOUT', '10000')),
} as const;

// Debugging em desenvolvimento
if (__DEV__) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🌐 API Base URL: ${API_CONFIG.BASE_URL}`);
  console.log(`[${timestamp}] ⏱️ Timeout: ${API_CONFIG.TIMEOUT}ms`);
  console.log(
    `[${timestamp}] 📱 Platform: ${Constants.platform?.ios ? 'iOS' : 'Android'}`
  );
  console.log(`[${timestamp}] 🏗️ App Ownership: ${Constants.appOwnership}`);
}