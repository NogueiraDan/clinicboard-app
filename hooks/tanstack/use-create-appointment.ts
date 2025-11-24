import { businessService } from "@/service/bussiness-service";
import { Appointment } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert, Platform, ToastAndroid } from "react-native";

interface AppointmentError {
  message: string;
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
}

interface UseCreateAppointmentReturn {
  createAppointment: (body: Appointment) => Promise<Appointment>;
  isPending: boolean;
  error: AppointmentError | null;
}

const extractErrorMessage = (error: AppointmentError): string => {
  const backendMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message;

  const errorMap: Record<string, string> = {
    "O paciente já possui um agendamento nesta data":
      "Este paciente já tem um agendamento marcado para esta data.",
    "Horário já reservado":
      "Este horário já foi reservado. Selecione outro horário disponível.",
    "Network Error":
      "Falha na conexão. Verifique sua internet e tente novamente.",
  };

  // Buscar mensagem amigável
  const friendlyMessage = Object.entries(errorMap).find(([key]) =>
    backendMessage?.includes(key)
  )?.[1];

  return (
    friendlyMessage ||
    backendMessage ||
    "Não foi possível realizar o agendamento."
  );
};

const showNativeAlert = (title: string, message: string): void => {
  Alert.alert(title, `❌ ${message}`, [{ text: "OK", style: "default" }]);
};

const showSuccessMessage = (): void => {
  const message = "✅ Agendamento realizado com sucesso!";

  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.LONG);
  } else {
    Alert.alert("Sucesso", message);
  }
};

export function useCreateAppointment(): UseCreateAppointmentReturn {
  const handleSuccess = (): void => {
    showSuccessMessage();
    router.replace("/(app)/(tabs)");
  };

  const handleError = (error: AppointmentError): void => {
    console.error("❌ Erro ao criar agendamento:", {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
    });

    const friendlyMessage = extractErrorMessage(error);
    showNativeAlert("Erro no Agendamento", friendlyMessage);
  };

  const { mutateAsync, isPending, error } = useMutation<
    Appointment,
    AppointmentError,
    Appointment
  >({
    mutationFn: async (body: Appointment): Promise<Appointment> => {
      console.log("📤 Criando agendamento:", body);
      const data = await businessService.createAppointment(body);
      console.log("✅ Agendamento criado:", data);
      return data;
    },
    onSuccess: handleSuccess,
    onError: handleError,
  });

  return {
    createAppointment: mutateAsync,
    isPending,
    error,
  };
}
