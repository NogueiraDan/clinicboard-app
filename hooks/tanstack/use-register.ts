import { authService } from "@/service/auth-service";
import { User } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";

export function useRegister() {
  const handleSuccess = () => {
    Alert.alert("Registration successful");
  };

  const handleError = (error: any) => {
    Alert.alert("Registration failed", `Erro: ${error?.message || 'Erro desconhecido'}`);
  };

  const { mutateAsync } = useMutation({
    mutationFn: async (body: User): Promise<User> => {
      const data = await authService.register(body);
      return data;
    },
    onSuccess: handleSuccess,
    onError: (error) => handleError(error),
  });

  return {
    register: mutateAsync,
  };
}
