import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AppointmentService } from '../../../services/appointment.service';
import { PatientService } from '../../../services/patient.service'; // Import PatientService
import { Appointment } from '../../../models/appointment.model';
import { Patient } from '../../../models/patient.model'; // Import Patient model

@Component({
  selector: 'app-doctor-appointment',
  templateUrl: './doctor-appointment.component.html',
  styleUrls: ['./doctor-appointment.component.css']
})
export class DoctorAppointmentComponent implements OnInit {
  appointments: (Appointment & { patientName?: string })[] = [];
  filteredAppointments: (Appointment & { patientName?: string })[] = [];
  searchTerm: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService // Inject PatientService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.appointmentService.getAllAppointmentsByDoctorId(Number(userId)) // Assuming you have this method
        .pipe(
          switchMap(appointments => {
            const observables = appointments.map(appointment => {
              // Fetch patient data based on patientId in appointment
              return this.patientService.getPatient(appointment.patientId).pipe(
                map(patient => ({
                  ...appointment,
                  patientName: patient?.name || 'Unknown' // Handle unknown patient
                }))
              );
            });

            return forkJoin(observables);
          })
        )
        .subscribe(
          (appointmentsWithPatientNames) => {
            this.appointments = appointmentsWithPatientNames;
            this.filteredAppointments = appointmentsWithPatientNames; // Initialize filtered appointments
          },
          (error) => {
            console.error('Failed to fetch appointments:', error);
          }
        );
    }
  }

  // Search method to filter appointments
  searchAppointments(): void {
    if (this.searchTerm) {
      this.filteredAppointments = this.appointments.filter(appointment =>
        appointment.patientName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        appointment.appointmentType.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        appointment.appointmentReason.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredAppointments = this.appointments; // Reset to all appointments
    }
  }
}
