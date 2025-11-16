import { businessService } from "@/service/bussiness-service";
import { Patient } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { ToastAndroid } from "react-native";

export function useCreatePatient() {
  const handleSuccess = () => {
    ToastAndroid.show("Paciente cadastrado com sucesso!", ToastAndroid.LONG);
    router.replace("/(app)/(tabs)");
  };

  const handleError = (error: any) => {
    ToastAndroid.show(
      `Falha no cadastro: ${error?.message || "Erro desconhecido"}`,
      ToastAndroid.LONG
    );
  };

  const { mutateAsync } = useMutation({
    mutationFn: async (body: Patient): Promise<Patient> => {
      const data = await businessService.createPatient(body);
      return data;
    },
    onSuccess: handleSuccess,
    onError: (error) => handleError(error),
  });

  return {
    createPatient: mutateAsync,

  };
}
