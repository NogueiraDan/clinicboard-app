
import { useAuth } from "@/providers/auth-provider";
import { businessService } from "@/service/bussiness-service";
import { Patient } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function usePatients() {
  const { user } = useAuth();

  const { data, isFetching, error } = useQuery<Patient[] | undefined>({
    queryKey: ["patients", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log("usePatients: user.id não disponível");
        return [];
      }
      console.log("usePatients: buscando pacientes para user_id:", user.id);
      const response = await businessService.findByUserId(user.id);
      console.log("usePatients: resposta da API:", response);
      return response;
    },
    enabled: !!user?.id,
  });

  return {
    patients: data ?? [],
    isFetching,
    error,
  };
}
