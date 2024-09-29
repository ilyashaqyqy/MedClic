import { Patient } from './patient.model';
import { Doctor } from './doctor.model';
import { Reminder } from './reminder.model';
import { AppointmentStatus } from './appointment-status';



  export interface Appointment {
    id?: number;  
    date: string;
    time: string;
    status: string;
    notes: string;
    appointmentType: string;
    appointmentReason: string;
    patientId: number;
    doctorId: number;
    // patient: Patient;
    // doctor: Doctor;
    reminders: Reminder[];
    bookingDate: string;
    bookingTime: string;
    doctorSpecialization?: string;
}
