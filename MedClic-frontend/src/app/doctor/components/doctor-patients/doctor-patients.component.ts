import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AppointmentService } from 'src/app/services/appointment.service';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient.model';

@Component({
  selector: 'app-doctor-patients',
  templateUrl: './doctor-patients.component.html',
  styleUrls: ['./doctor-patients.component.css']
})
export class DoctorPatientsComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];

  constructor(private appointmentService: AppointmentService, private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients(); // Call to load patients on initialization
  }

  loadPatients(): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.appointmentService.getAllAppointmentsByDoctorId(Number(userId))
        .pipe(
          switchMap(appointments => {
            const patientObservables = appointments.map(appointment =>
              this.patientService.getPatient(appointment.patientId)
            );

            // Use forkJoin to wait for all patient observables to complete
            return forkJoin(patientObservables);
          }),
          map(patients => {
            // Use a Set to track unique patients
            const uniquePatientsMap = new Map<number, Patient>();

            patients.forEach(patient => {
              if (patient && patient.id && !uniquePatientsMap.has(patient.id)) {
                uniquePatientsMap.set(patient.id, patient); // Add to Map if not already present
              }
            });

            // Convert Map values to an array
            return Array.from(uniquePatientsMap.values());
          })
        )
        .subscribe(
          (uniquePatients) => {
            this.patients = uniquePatients; // Set unique patients
            this.filteredPatients = uniquePatients; // Optionally set filteredPatients as well
          },
          (error) => {
            console.error('Failed to fetch patients:', error);
          }
        );
    }
  }
}
