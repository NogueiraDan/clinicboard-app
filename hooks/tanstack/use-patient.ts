import { businessService } from "@/service/bussiness-service";
import { Patient } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function usePatient(patientId: string) {
  const { data, isFetching, refetch, error } = useQuery<Patient | undefined>({
    queryKey: ["schedules", patientId],
    queryFn: async () => {
      const response = await businessService.findById(patientId);
      return response;
    },
    enabled: !!patientId,
  });

  return {
    patient: data,
    isFetching,
    refetch,
    error: error as Error | null,
  };
}
