import { createContext, useContext, useEffect, useState } from 'react';
import { router, useSegments } from 'expo-router';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'professional' | 'admin';
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();

  // Função para verificar se o usuário está autenticado
  const checkAuthState = async () => {
    try {
      // Aqui você verificaria o token salvo (AsyncStorage, SecureStore, etc.)
      // Por exemplo: const token = await SecureStore.getItemAsync('auth_token');
      // Se houver token válido, setar o usuário
      
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  // Navegação automática baseada no estado de autenticação
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (user && inAuthGroup) {
      // Usuário autenticado mas está nas telas de auth -> redirecionar para app
      router.replace('/(app)/(tabs)');
    } else if (!user && inAppGroup) {
      // Usuário não autenticado mas está nas telas do app -> redirecionar para auth
      router.replace('/(auth)/onboarding');
    }
  }, [user, segments, isLoading]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Aqui você faria a chamada para sua API de login
      // const response = await authAPI.signIn({ email, password });
      
      // Simular resposta da API
      const mockUser: User = {
        id: '1',
        email,
        name: 'Usuario Teste',
        role: 'professional',
      };
      
      // Salvar token no storage seguro
      // await SecureStore.setItemAsync('auth_token', response.token);
      
      setUser(mockUser);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Aqui você faria a chamada para sua API de cadastro
      // const response = await authAPI.signUp({ name, email, password });
      
      const mockUser: User = {
        id: '1',
        email,
        name,
        role: 'professional',
      };
      
      setUser(mockUser);
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Remover token do storage
      // await SecureStore.deleteItemAsync('auth_token');
      
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};