import { authService } from "@/service/auth-service";
import { LoginRequest, LoginResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";

export function useLogin() {
  const handleSuccess = () => {
    Alert.alert("Login successful");
  };

  const handleError = (error: any) => {
    Alert.alert("Login failed", `Erro: ${error?.message || 'Erro desconhecido'}`);
  };

  const { mutateAsync } = useMutation({
    mutationFn: async (body: LoginRequest): Promise<LoginResponse> => {
      const data = await authService.login(body);
      return data;
    },
    onSuccess: handleSuccess,
    onError: (error) => handleError(error),
  });

  return {
    login: mutateAsync,
  };
}
