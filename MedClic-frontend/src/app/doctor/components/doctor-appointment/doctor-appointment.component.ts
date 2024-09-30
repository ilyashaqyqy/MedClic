import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';  // Import MatDialog
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AppointmentService } from '../../../services/appointment.service';
import { PatientService } from '../../../services/patient.service';
import { Appointment } from '../../../models/appointment.model';
import { RescheduleAppointmentDialogComponent } from 'src/app/appointment/reschedule-appointment-dialog/reschedule-appointment-dialog.component';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faTimes, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-doctor-appointment',
  templateUrl: './doctor-appointment.component.html',
  styleUrls: ['./doctor-appointment.component.css']
})
export class DoctorAppointmentComponent implements OnInit {
  appointments: (Appointment & { patientName?: string })[] = [];
  filteredAppointments: (Appointment & { patientName?: string })[] = [];
  searchTerm: string = '';


  faCheck: IconDefinition = faCheck;
  faTimes: IconDefinition = faTimes;
  faCalendarAlt: IconDefinition = faCalendarAlt;

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private dialog: MatDialog // Inject MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.appointmentService.getAllAppointmentsByDoctorId(Number(userId))
        .pipe(
          switchMap(appointments => {
            const observables = appointments.map(appointment => {
              return this.patientService.getPatient(appointment.patientId).pipe(
                map(patient => ({
                  ...appointment,
                  patientName: patient?.name || 'Unknown'
                }))
              );
            });
            return forkJoin(observables);
          })
        )
        .subscribe(
          (appointmentsWithPatientNames) => {
            this.appointments = appointmentsWithPatientNames;
            this.filteredAppointments = appointmentsWithPatientNames;
          },
          (error) => {
            console.error('Failed to fetch appointments:', error);
          }
        );
    }
  }

  searchAppointments(): void {
    if (this.searchTerm) {
      this.filteredAppointments = this.appointments.filter(appointment =>
        appointment.patientName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        appointment.appointmentType.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        appointment.appointmentReason.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredAppointments = this.appointments;
    }
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key in 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW']: string } = {
      'SCHEDULED': 'bg-blue-100 text-blue-800',
      'CONFIRMED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'COMPLETED': 'bg-purple-100 text-purple-800',
      'NO_SHOW': 'bg-yellow-100 text-yellow-800'
    };
    
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
  }

  confirmAppointment(appointmentId: number): void {
    this.appointmentService.confirmAppointment(appointmentId).subscribe(
      () => {
        this.loadAppointments(); // Refresh the list after confirmation
      },
      (error) => {
        console.error('Failed to confirm appointment:', error);
      }
    );
  }

  cancelAppointment(appointmentId: number): void {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      this.appointmentService.cancelAppointment(appointmentId).subscribe(
        () => {
          this.loadAppointments(); // Refresh the list after cancellation
        },
        (error) => {
          console.error('Failed to cancel appointment:', error);
        }
      );
    }
  }

  openRescheduleDialog(appointment: Appointment): void {
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
            this.loadAppointments(); // Refresh the appointments list
          },
          (error) => {
            console.error('Failed to reschedule appointment:', error);
          }
        );
      }
    });
  }
    }


  

