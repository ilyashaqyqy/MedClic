import { Appointment } from './appointment.model';
import { User } from './user.model';

export interface Patient extends User {
  has(id: number): unknown;
  medicalHistory: string;
  dateOfBirth: Date;
  insuranceInfo: string;
  address: string;
  appointments: Appointment[];
  profilePhoto: string;



}
