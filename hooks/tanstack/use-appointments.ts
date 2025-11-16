import { useAuth } from "@/providers/auth-provider";
import { businessService } from "@/service/bussiness-service";
import { Appointment } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useAppointments(date: string) {
  const { user } = useAuth();

  const { data, isFetching, refetch } = useQuery<Appointment[] | undefined>({
    queryKey: ["appointments", date, user?.id],
    queryFn: async () => {
      const response = await businessService.findAppointmentByDate(
        user?.id ?? "",
        date
      );
      return response;
    },
    enabled: !!date && !!user?.id,
  });

  return {
    appointments: data ?? [],
    isFetching,
    refetchAppointments: refetch,
  };
}
