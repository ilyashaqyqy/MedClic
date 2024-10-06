import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  filterDate: string = ''; // Holds the selected date in "dd/MM/yyyy" format
  selectedStatus: string = ''; // Holds the selected status for filtering

  faCheck: IconDefinition = faCheck;
  faTimes: IconDefinition = faTimes;
  faCalendarAlt: IconDefinition = faCalendarAlt;

/*************  ✨ Codeium Command ⭐  *************/
  /**
   * Constructor for DoctorAppointmentComponent.
   * 
   * @param appointmentService The AppointmentService to use for loading and manipulating appointments.
   * @param patientService The PatientService to use for loading patient names.
   * @param dialog The MatDialog to use for opening the reschedule appointment dialog.
   */
/******  b265f747-35c0-4f26-9b6b-36bcce702fab  *******/  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private dialog: MatDialog
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
    this.filteredAppointments = this.appointments.filter(appointment => {
      const matchesName = appointment.patientName?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesDate = this.filterDate ? this.isSameDate(appointment.date, this.filterDate) : true;
      const matchesStatus = this.selectedStatus ? appointment.status === this.selectedStatus : true; // New status filter

      return matchesName && matchesDate && matchesStatus; // Include status in the filter
    });
  }

  // Check if two dates are the same
  isSameDate(appointmentDate: string, filterDate: string): boolean {
    const appointmentDateObj = new Date(appointmentDate); // Convert appointment date string to Date
    const [day, month, year] = filterDate.split('/').map(Number); // Parse the filter date
    const filterDateObj = new Date(year, month - 1, day); // Create a Date object from filter date

    return appointmentDateObj.toDateString() === filterDateObj.toDateString(); // Compare the date strings
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key in 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW' | 'RESCHEDULED']: string } = {
      'SCHEDULED': 'bg-blue-100 text-blue-800',
      'CONFIRMED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'COMPLETED': 'bg-gray-100 text-gray-800',
      'NO_SHOW': 'bg-yellow-100 text-yellow-800',
      'RESCHEDULED': 'bg-purple-100 text-purple-800'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
  }

  confirmAppointment(appointmentId: number): void {
    if (confirm("Are you sure you want to confirm this appointment?")) {
      this.appointmentService.confirmAppointment(appointmentId).subscribe(
        () => {
          this.loadAppointments();
        },
        (error) => {
          console.error('Failed to confirm appointment:', error);
        }
      );
    }
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
            }
          );
        }
      });
    }
    }
    
}
