import { Patient } from './patient.model';
import { Doctor } from './doctor.model';
import { Reminder } from './reminder.model';
import { AppointmentStatus } from './appointment-status';



  export interface Appointment {
    id: number;
    date: Date;
    time: string; // Could use Date for both date and time if needed
    status: AppointmentStatus;
    notes: string;
    appointmentType: string;
    appointmentReason: string;
    patient: Patient;
    doctor: Doctor;
    reminders: Reminder[];
}
