import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';

@Component({
  selector: 'app-find-doctors',
  templateUrl: './find-doctors.component.html',
  styleUrls: ['./find-doctors.component.css']
})
export class FindDoctorsComponent implements OnInit {
  searchQuery: string = '';
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];

  constructor(
    private doctorService: DoctorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe(
      (doctors: Doctor[]) => {
        this.doctors = doctors;
        this.filterDoctors();
      },
      (error) => {
        console.error('Failed to fetch doctors:', error);
      }
    );
  }

  filterDoctors(): void {
    this.filteredDoctors = this.doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  navigateToDoctorProfile(doctorId: number): void {
    this.router.navigate(['/doctor-details', doctorId]);
  }
}