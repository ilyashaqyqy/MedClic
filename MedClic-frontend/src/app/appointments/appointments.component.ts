import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AppointmentService } from '../services/appointment.service';
import { DoctorService } from '../services/doctor.service';
import { AuthService } from '../services/auth.service';
import { Appointment } from '../models/appointment.model';
import { Doctor } from '../models/doctor.model';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  appointments: (Appointment & { doctorName?: string })[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    const userId = localStorage.getItem('userId');
    
    if (userId) {
      this.appointmentService.getAllAppointmentsByPatientId(Number(userId))
        .pipe(
          switchMap(appointments => {
            const doctorObservables = appointments.map(appointment => 
              this.doctorService.getDoctor(appointment.doctorId).pipe(
                map(doctor => ({
                  ...appointment,
                  doctorName: doctor.name
                }))
              )
            );
            return forkJoin(doctorObservables);
          })
        )
        .subscribe(
          (appointmentsWithDoctorNames) => {
            this.appointments = appointmentsWithDoctorNames;
          },
          (error) => {
            console.error('Failed to fetch appointments:', error);
          }
        );
    }
  }
}