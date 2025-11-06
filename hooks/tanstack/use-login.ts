import { authService } from "@/service/auth-service";
import { LoginRequest, LoginResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { ToastAndroid } from "react-native";

export function useLogin() {
  const handleSuccess = () => {
    ToastAndroid.show("Login realizado com sucesso", ToastAndroid.SHORT);
  };

  const handleError = (error: any) => {
    ToastAndroid.show(`Falha no login: ${error?.message || 'Erro desconhecido'}`, ToastAndroid.LONG);
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
