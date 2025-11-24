import { Notification } from "@/types";

// Mock de notificações
export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Novo Agendamento',
    message: 'Maria Silva Santos agendou uma consulta para amanhã às 14:00',
    type: 'appointment',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Lembrete',
    message: 'Você tem 3 consultas agendadas para hoje',
    type: 'reminder',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    title: 'Consulta Remarcada',
    message: 'João Silva remarcou a consulta de hoje para sexta-feira',
    type: 'appointment',
    isRead: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '4',
    title: 'Sistema',
    message: 'Atualização disponível para o ClinicBoard',
    type: 'system',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Simula busca de notificações (substituir por chamada real à API)
export const fetchNotifications = async (): Promise<Notification[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNotifications);
    }, 500);
  });
};

// Conta notificações não lidas
export const getUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter((n) => !n.isRead).length;
};
