import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Doctor } from 'src/app/models/doctor.model';
import { AppointmentService } from 'src/app/services/appointment.service';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-doctor-availability',
  templateUrl: './doctor-availability.component.html',
  styleUrls: ['./doctor-availability.component.css']
})
export class DoctorAvailabilityComponent {
  doctorId: number | undefined;
  doctor: Doctor | undefined;

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    // Fetching the doctor ID from the route parameters
    this.route.paramMap.subscribe(params => {
      this.doctorId = Number(params.get('id'));
      if (this.doctorId) {
        this.fetchDoctorDetails(this.doctorId);  // Using the doctor ID to fetch details
      }
    });
  }

  fetchDoctorDetails(id: number): void {
    this.doctorService.getDoctor(id).subscribe(
      (doctor: Doctor) => {
        this.doctor = doctor;
        // Perform any actions related to availability or other info
      },
      error => {
        console.error('Error fetching doctor:', error);
      }
    );
  }
}