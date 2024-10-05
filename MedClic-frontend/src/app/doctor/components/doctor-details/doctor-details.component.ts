import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { AppointmentService } from '../../../services/appointment.service';
import { Doctor } from '../../../models/doctor.model';
import { Appointment } from '../../../models/appointment.model';
import { AppointmentStatus } from 'src/app/models/appointment-status';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentDialogComponent } from '../../../patient/appointment-dialog/appointment-dialog.component';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.css']
})
export class DoctorDetailsComponent implements OnInit {
  doctor: Doctor | null = null;
  loading: boolean = true;
  error: string | null = null;
  successMessage: string | null = null;
  fadeOut: boolean = false; // For fade-out effect
  availableSlots: { [date: string]: string[] } = {}; // Initialize as an empty object

  selectedDate: string | null = null;

  slotsLoading: boolean = false;
  displayedDays: number = 3;
  displayedSlots: number = 4;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private dialog: MatDialog,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    const doctorId = this.route.snapshot.paramMap.get('id');
    if (doctorId) {
      this.loadDoctorDetails(+doctorId);
      this.fetchAvailableSlots(+doctorId);
    } else {
      this.error = 'Doctor ID not provided';
      this.loading = false;
    }
  }

  loadDoctorDetails(id: number): void {
    this.doctorService.getDoctor(id).subscribe(
      (doctor: Doctor) => {
        this.doctor = doctor;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching doctor details:', error);
        this.error = 'Failed to load doctor details. Please try again.';
        this.loading = false;
      }
    );
  }

  openAppointmentDialog(): void {
    const userId = localStorage.getItem('userId');
    if (!userId || !this.doctor) {
      console.error('User ID or doctor data not found.');
      return;
    }

    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      width: '400px',
      data: { 
        doctorId: this.doctor.id,
        patientId: +userId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scheduleAppointment(result);
      }
    });
  }

  scheduleAppointment(appointmentData: any): void {
    const userId = localStorage.getItem('userId');
    if (!userId || !this.doctor) {
      console.error('User ID or doctor data not found.');
      return;
    }

    const appointmentDetails: Appointment = {
      date: appointmentData.appointmentDate,
      time: appointmentData.appointmentTime + ':00',
      status: AppointmentStatus.SCHEDULED,
      notes: appointmentData.notes || '',
      appointmentType: appointmentData.appointmentType,
      appointmentReason: appointmentData.appointmentReason,
      patientId: +userId,
      doctorId: this.doctor.id,
      reminders: [],
      bookingDate: '',
      bookingTime: ''
    };

    console.log('Appointment Details to be sent to the server:', appointmentDetails);
    this.appointmentService.createAppointment(appointmentDetails).subscribe(
      (response) => {
        console.log('Appointment created successfully:', response);
        this.successMessage = 'Appointment scheduled successfully!';
        this.startFadeOut(); // Call to start the fade-out effect
        this.router.navigate(['/doctor-details', this.doctor?.id]);
      },
      (error) => {
        console.error('Error creating appointment:', error);
      }
    );
  }

  startFadeOut(): void {
    setTimeout(() => {
      this.fadeOut = true; // Start fade-out effect
      this.hideSuccessMessage(); // Clear message after fading out
    }, 4000); // Fade out after 4 seconds
  }

  hideSuccessMessage(): void {
    setTimeout(() => {
      this.successMessage = null; // Clear the success message
      this.fadeOut = false; // Reset fade-out state
    }, 500); // Allow fade-out effect time
  }

  fetchAvailableSlots(doctorId: number): void {
    this.slotsLoading = true;
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const daysToCheck = 30;

    this.appointmentService.getAvailableSlots(doctorId, startDate, daysToCheck).subscribe(
      (response) => {
        console.log('Response from API:', response);
        if (response && typeof response === 'object') {
          this.availableSlots = response;
        } else {
          console.error('Unexpected response structure:', response);
          this.availableSlots = {};
        }
        console.log('Available Slots:', this.availableSlots);
        this.slotsLoading = false;
      },
      (error) => {
        console.error('Error fetching available slots:', error);
        this.slotsLoading = false;
      }
    );
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  showMoreDays(): void {
    this.displayedDays += 3;
  }

  showMoreSlots(date: string): void {
    this.displayedSlots += 4;
  }

  onSlotClick(date: string, time: string): void {
    console.log(`Slot selected: ${date} at ${time}`);
    // Here you can add any logic you want to handle the slot selection
    // For example, you might want to highlight the selected slot or store the selection
  }
}
