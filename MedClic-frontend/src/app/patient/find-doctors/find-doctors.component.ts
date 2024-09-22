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
  selectedLocation: string = ''; 
  selectedSpecialization: string = ''; 

  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];

  specializations: string[] = []; // Available specializations
  locations: string[] = []; // Available locations

  constructor(
    private doctorService: DoctorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDoctors();
  }

  // Load doctors and extract locations and specializations
  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe(
      (doctors: Doctor[]) => {
        this.doctors = doctors;
        this.extractLocations(); // Extract unique locations
        this.extractSpecializations(); // Extract unique specializations
        this.filterDoctors();
      },
      (error) => {
        console.error('Failed to fetch doctors:', error);
      }
    );
  }

  // Extract unique specializations from doctors
  extractSpecializations(): void {
    this.specializations = Array.from(new Set(this.doctors.map(doctor => doctor.specialization).filter(Boolean)));
  }

  // Extract unique locations from doctors
  extractLocations(): void {
    this.locations = Array.from(new Set(this.doctors.map(doctor => doctor.location?.name).filter(Boolean)));
  }

  // Filter doctors based on search query, location, and specialization
  filterDoctors(): void {
    this.filteredDoctors = this.doctors.filter(doctor =>
      (doctor.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
      (!this.selectedLocation || doctor.location?.name === this.selectedLocation) &&
      (!this.selectedSpecialization || doctor.specialization === this.selectedSpecialization)
    );
  }

  // Navigate to the doctor's profile
  navigateToDoctorProfile(doctorId: number): void {
    this.router.navigate(['/doctor-details', doctorId]);
  }
}
