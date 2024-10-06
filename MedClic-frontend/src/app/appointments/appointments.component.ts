import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { map, switchMap } from 'rxjs/operators';
import { AppointmentService } from '../services/appointment.service';
import { DoctorService } from '../services/doctor.service';
import { AuthService } from '../services/auth.service';
import { Appointment } from '../models/appointment.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RescheduleAppointmentDialogComponent } from '../appointment/reschedule-appointment-dialog/reschedule-appointment-dialog.component';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  appointments: (Appointment & { doctorName?: string })[] = [];
  filteredAppointments: (Appointment & { doctorName?: string })[] = [];
  searchQuery: string = '';
  selectedStatus: string = ''; // Added property for selected status
  statuses: string[] = [
    'SCHEDULED', 
    'CONFIRMED', 
    'CANCELLED', 
    'COMPLETED', 
    'NO_SHOW', 
    'RESCHEDULED'
  ]; // Example statuses

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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
                  doctorName: doctor.name,
                  doctorSpecialization: doctor.specialization // Add specialization here
                }))
              )
            );
            return forkJoin(doctorObservables);
          })
        )
        .subscribe(
          (appointmentsWithDoctorNames) => {
            this.appointments = appointmentsWithDoctorNames;
            this.filteredAppointments = appointmentsWithDoctorNames; // Initialize filtered appointments
            this.sortAppointments(); // Sort appointments by recent date
          },
          (error) => {
            console.error('Failed to fetch appointments:', error);
          }
        );
    }
  }

  // Method to sort appointments by date
  sortAppointments(): void {
    this.filteredAppointments.sort((a, b) => {
      return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime(); // Sort by most recent booking date
    });
  }

  // Method to filter appointments based on doctor name and status
  filterAppointments(): void {
    this.filteredAppointments = this.appointments.filter(appointment => {
      const matchesDoctor = !this.searchQuery || appointment.doctorName?.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = !this.selectedStatus || appointment.status === this.selectedStatus; // Check status match
      return matchesDoctor && matchesStatus; // Filter based on both conditions
    });

    this.sortAppointments(); // Re-sort after filtering
  }

  // Call this method when status changes
  onStatusChange(): void {
    this.filterAppointments(); // Reapply filters
  }

  cancelAppointment(appointmentId: number): void {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      this.appointmentService.cancelAppointment(appointmentId).subscribe(
        () => {
          this.loadAppointments();
        },
        (error) => {
          console.error('Failed to cancel appointment:', error);
        }
      );
    }
  }

  openRescheduleDialog(appointment: Appointment): void {
    if (confirm("Are you sure you want to reschedule this appointment?")) {
      const dialogRef = this.dialog.open(RescheduleAppointmentDialogComponent, {
        data: { appointmentDate: appointment.date, appointmentTime: appointment.time },
        width: '400px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const updatedAppointment: Appointment = {
            ...appointment,
            date: result.appointmentDate,
            time: result.appointmentTime
          };

          this.appointmentService.rescheduleAppointment(appointment.id!, updatedAppointment).subscribe(
            () => {
              this.loadAppointments();
            },
            (error) => {
              console.error('Failed to reschedule appointment:', error);
              if (error.status === 409) {
                this.snackBar.open('This date and time are already booked. Please choose another.', 'Close', {
                  duration: 5000,
                  panelClass: ['mat-toolbar', 'mat-warn']
                });
              }
            }
          );
        }
      });
    }
  }

  trackById(index: number, appointment: Appointment): number {
    return appointment.id!; // or appointment.id!
  }
}
