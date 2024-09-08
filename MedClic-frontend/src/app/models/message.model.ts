import { User } from './user.model';

export interface Message {
  id: number;
  content: string;
  timestamp: Date; // Angular uses `Date` for date-time
  isRead: boolean;
  sender: User;
  receiver: User;
}
