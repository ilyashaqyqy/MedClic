import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorService } from '../../../services/doctor.service';
import { AppointmentService } from '../../../services/appointment.service';
import { Doctor } from '../../../models/doctor.model';
import { Appointment } from '../../../models/appointment.model';
import { Patient } from 'src/app/models/patient.model';
import { AppointmentStatus } from 'src/app/models/appointment-status';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.css']
})
export class DoctorDetailsComponent implements OnInit {
  doctor: Doctor | null = null;
  loading: boolean = true;
  error: string | null = null;
  scheduleForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private fb: FormBuilder
  ) {
    this.scheduleForm = this.fb.group({
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required],
      appointmentType: ['', Validators.required],
      appointmentReason: ['', Validators.required],
      comments: ['']
    });
  }

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

  scheduleAppointment(): void {
    if (this.scheduleForm.invalid || !this.doctor) {
      console.log('Form is invalid or doctor is not loaded:', this.scheduleForm.errors);
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in local storage. Please log in.');
      return;
    }

    const { appointmentDate, appointmentTime, appointmentType, appointmentReason, comments } = this.scheduleForm.value;

    const appointmentData = {
      date: appointmentDate,
      time: `${appointmentTime}:00`,
      status: AppointmentStatus.SCHEDULED,
      notes: comments,
      appointmentType: appointmentType,
      appointmentReason: appointmentReason,
      patientId: +userId,
      doctorId: this.doctor.id
    };

    this.appointmentService.createAppointment(appointmentData).subscribe(
      (response) => {
        console.log('Appointment created successfully:', response);
        this.router.navigate(['/find-doctors']);
      },
      (error) => {
        console.error('Error creating appointment:', error);
        if (error.error) {
          console.error('Error details:', error.error);
        }
      }
    );
  }

  appointmentTypes = [
    'Initial Consultation',
    'Follow-up Appointment',
    'Telemedicine Consultation',
    'Routine Check-up',
    'Specialist Consultation',
    'Emergency Appointment',
    'Pre-Operative Consultation',
    'Post-Operative Follow-up',
    'Medication Review',
    'Vaccination Appointment'
  ];

  appointmentReasons = [
    'General Health Check',
    'Chronic Condition Management',
    'Mental Health Evaluation',
    'Routine Screening',
    'Injury or Pain',
    'Follow-up on Previous Issue',
    'Medication Prescription/Refill',
    'Physical Exam',
    'Blood Test Results Discussion',
    'Referral to a Specialist'
  ];
}