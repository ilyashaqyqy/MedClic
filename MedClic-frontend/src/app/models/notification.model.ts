import { User } from './user.model';

export interface Notification {
  id: number;
  message: string;
  timestamp: Date;
  isRead: boolean;
  type: string;
  user: User;
}
