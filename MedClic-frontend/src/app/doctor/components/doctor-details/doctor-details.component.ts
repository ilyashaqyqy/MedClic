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

    console.log('Appointment details to be sent:', appointmentDetails);

    this.appointmentService.createAppointment(appointmentDetails).subscribe(
      (response) => {
        console.log('Appointment created successfully:', response);
        this.router.navigate(['/find-doctors']);
      },
      (error) => {
        console.error('Error creating appointment:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        // Handle error (show message to user, etc.)
      }
    );
  }
}