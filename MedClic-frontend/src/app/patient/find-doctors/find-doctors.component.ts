import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';
import { AuthService } from '../../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-find-doctors',
  templateUrl: './find-doctors.component.html',
  styleUrls: ['./find-doctors.component.css']
})
export class FindDoctorsComponent implements OnInit {
  searchQuery: string = '';
  selectedLocation: string = ''; 
  selectedSpecialization: string = ''; 
  specializations: string[] = [];
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  locations: string[] = [];
  isLoggedIn: boolean = false; // Property to track login status

  constructor(
    private doctorService: DoctorService,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) { }

  ngOnInit(): void {
    this.loadDoctors();
    this.isLoggedIn = this.authService.isLoggedIn(); // Check if user is logged in
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe(
      (doctors: Doctor[]) => {
        this.doctors = doctors;
        this.extractLocations();
        this.extractSpecializations();
        this.filterDoctors();
      },
      (error) => {
        console.error('Failed to fetch doctors:', error);
      }
    );
  }

  extractSpecializations(): void {
    this.specializations = Array.from(new Set(this.doctors.map(doctor => doctor.specialization).filter(Boolean)));
  }

  extractLocations(): void {
    this.locations = Array.from(new Set(this.doctors.map(doctor => doctor.location?.name).filter(Boolean)));
  }

  filterDoctors(): void {
    this.filteredDoctors = this.doctors.filter(doctor =>
      (doctor.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
      (!this.selectedLocation || doctor.location?.name === this.selectedLocation) &&
      (!this.selectedSpecialization || doctor.specialization === this.selectedSpecialization)
    );
  }

  navigateToDoctorProfile(doctorId: number): void {
    this.router.navigate(['/doctor-details', doctorId]);
  }
}
