import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { Doctor } from '../../../models/doctor.model';

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
    private doctorService: DoctorService
  ) { }

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
    // Implement appointment scheduling logic here
    // For now, we'll just log a message
    console.log('Scheduling appointment with', this.doctor?.name);
    // You could navigate to an appointment scheduling page like this:
    // this.router.navigate(['/schedule-appointment', this.doctor?.id]);
  }
}