import { Appointment } from './appointment.model';
import { User } from './user.model';

export interface Patient extends User {
  medicalHistory: string;
  dateOfBirth: Date;
  insuranceInfo: string;
  address: string;
  appointments: Appointment[];
}
