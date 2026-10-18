export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  emailOrPhone: string;
  email?: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export type PaymentOrderStatus = 'pending' | 'approved' | 'rejected';

export interface SubscriptionOrder {
  id: string;
  userId: string;
  userName: string;
  userEmailOrPhone: string;
  planId: string;
  planNameBn: string;
  planNameEn: string;
  amountBdt: number;
  gatewayId: string;
  gatewayName: string;
  senderNumber: string;
  trxId: string;
  status: PaymentOrderStatus;
  createdAt: string;
  approvedAt?: string;
  expiresAt?: string;
  credentials?: {
    serverUrl: string;
    username: string;
    password: string;
    m3uUrl: string;
    epgUrl: string;
    activeScreens: number;
  };
  adminNote?: string;
}
