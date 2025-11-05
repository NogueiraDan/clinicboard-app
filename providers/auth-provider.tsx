import { useLogin } from "@/hooks/tanstack/use-login";
import { useRegister } from "@/hooks/tanstack/use-register";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../types";
interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: User) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { login } = useLogin();
  const { register } = useRegister();

  // Checa token salvo e carrega usuário
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const token = await SecureStore.getItemAsync("auth_token");
        if (token) {
          // Opcional: buscar dados do usuário com o token
          // const user = await fetchUserProfile(token);
          // setUser(user);
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const user = await login({
          email,
          password,
        });
        await SecureStore.setItemAsync("auth_token", user.access_token);
        setUser(user);
        // Redireciona para o dashboard e desmonta a pilha de auth
        router.replace("/(app)/(tabs)");
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await SecureStore.deleteItemAsync("auth_token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(
    async (data: User) => {
      setIsLoading(true);
      try {
        await register(data);
        const loginResponse = await login({
          email: data.email,
          password: data.password ?? "",
        });
        await SecureStore.setItemAsync(
          "auth_token",
          loginResponse.access_token
        );
        setUser(loginResponse);
        // Redireciona para o dashboard e desmonta a pilha de auth
        router.replace("/(app)/(tabs)");
      } finally {
        setIsLoading(false);
      }
    },
    [login, register]
  );

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};
