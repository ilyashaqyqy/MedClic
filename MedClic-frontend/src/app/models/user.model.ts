import { Message } from "./message.model";
import { Role } from "./role";

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: Role;
    notifications: Notification[];
    sentMessages: Message[];
    receivedMessages: Message[];
  }
  