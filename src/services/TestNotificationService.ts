import { SimulatedNotification } from '../types';

const NOTIFICATIONS_STORAGE_KEY = 'codebau_simulated_notifications_v1';

export class TestNotificationService {
  public static logNotification(params: {
    orderId: string;
    orderNumber: string;
    channel: 'sms' | 'email' | 'whatsapp';
    recipient: string;
    template: string;
    content: string;
  }): SimulatedNotification {
    const maskedRecipient = TestNotificationService.maskRecipient(params.recipient, params.channel);
    
    const notification: SimulatedNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      orderId: params.orderId,
      orderNumber: params.orderNumber,
      channel: params.channel,
      recipient: maskedRecipient,
      template: params.template,
      content: params.content,
      status: 'simulated_sent',
      createdAt: new Date().toISOString()
    };

    try {
      const existingStr = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      const existing: SimulatedNotification[] = existingStr ? JSON.parse(existingStr) : [];
      existing.unshift(notification);
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(existing.slice(0, 50)));
    } catch (e) {
      console.warn('Could not save test notification:', e);
    }

    return notification;
  }

  public static getNotificationsForOrder(orderIdOrNumber: string): SimulatedNotification[] {
    try {
      const existingStr = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      const existing: SimulatedNotification[] = existingStr ? JSON.parse(existingStr) : [];
      return existing.filter(n => n.orderId === orderIdOrNumber || n.orderNumber === orderIdOrNumber);
    } catch {
      return [];
    }
  }

  public static getAllNotifications(): SimulatedNotification[] {
    try {
      const existingStr = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      return existingStr ? JSON.parse(existingStr) : [];
    } catch {
      return [];
    }
  }

  private static maskRecipient(recipient: string, channel: 'sms' | 'email' | 'whatsapp'): string {
    if (channel === 'email') {
      const [user, domain] = recipient.split('@');
      if (!domain) return recipient;
      const maskedUser = user.length > 2 ? `${user.substring(0, 2)}***` : `${user}***`;
      return `${maskedUser}@${domain}`;
    } else {
      // SMS / WhatsApp phone
      if (recipient.length > 6) {
        return `${recipient.substring(0, 5)}****${recipient.substring(recipient.length - 2)}`;
      }
      return recipient;
    }
  }
}
