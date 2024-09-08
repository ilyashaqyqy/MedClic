import { Appointment } from './appointment.model';

export interface Reminder {
  id: number;
  reminderTime: Date;
  appointment: Appointment;
}
