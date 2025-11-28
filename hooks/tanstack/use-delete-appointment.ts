import { businessService } from "@/service/bussiness-service";
import { useMutation } from "@tanstack/react-query";
import { ToastAndroid } from "react-native";

export function useDeleteAppointment() {
  const handleSuccess = () => {
    ToastAndroid.show("Agendamento deletado com sucesso!", ToastAndroid.LONG);
  };

  const handleError = (error: any) => {
    ToastAndroid.show(
      `Falha na exclusão: ${error?.message || "Erro desconhecido"}`,
      ToastAndroid.LONG
    );
  };

  const { mutateAsync } = useMutation({
    mutationFn: async (appointmentId: string): Promise<void> => {
      const data = await businessService.deleteAppointment(appointmentId);
      return data;
    },
    onSuccess: handleSuccess,
    onError: (error) => handleError(error),
  });

  return {
    deleteAppointment: mutateAsync,
  };
}
