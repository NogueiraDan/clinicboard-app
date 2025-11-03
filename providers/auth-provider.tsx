import { useLogin } from "@/hooks/tanstack/use-login";
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
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { login } = useLogin();

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

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
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
