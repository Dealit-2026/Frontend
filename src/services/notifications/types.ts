export type NotificationType =
  | "TRADE"
  | "PRODUCT"
  | "AUCTION"
  | "WALLET"
  | "SYSTEM";

export type NotificationResponse = {
  notificationId: number;
  type: NotificationType;
  title: string;
  content: string;
  read: boolean;
  targetType: string | null;
  targetId: number | null;
  targetUrl: string | null;
  createdAt: string | null;
  readAt: string | null;
};

export type NotificationListResponse = {
  content: NotificationResponse[];
  page: number;
  size: number;
  totalElements: number;
  hasNext: boolean;
};

export type UnreadNotificationCountResponse = {
  count: number;
};

export type UnreadNotificationTypeCountResponse = {
  type: NotificationType;
  count: number;
};

export type MarkNotificationReadResponse = {
  notificationId: number;
  read: boolean;
};

export type MarkAllNotificationsReadResponse = {
  updatedCount: number;
};

export type DeleteNotificationResponse = {
  notificationId: number;
  deleted: boolean;
};
