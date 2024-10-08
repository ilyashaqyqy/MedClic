import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DoctorService } from '../../../services/doctor.service';
import { LocationService } from '../../../services/location.service';
import { Doctor } from '../../../models/doctor.model';
import { Location } from '../../../models/location.model';
import { Role } from 'src/app/models/role';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-doctor-dialog',
  templateUrl: './doctor-dialog.component.html',
  styleUrls: ['./doctor-dialog.component.css']
})
export class DoctorDialogComponent implements OnInit {
  @ViewChild('doctorForm') doctorForm!: NgForm;
  doctor: Doctor;
  locations: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<DoctorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { doctor: Doctor },
    private doctorService: DoctorService,
    private locationService: LocationService
  ) {
    this.doctor = { ...data.doctor }; 
  }

  ngOnInit(): void {
    this.loadLocations();
    if (this.doctor.id) {
      this.loadDoctorDetails();
    }
  }

  loadLocations(): void {
    this.locationService.getLocations().subscribe(
      (data: Location[]) => {
        // console.log('Loaded locations:', data);
        this.locations = data;
      },
      error => console.error('Error loading locations', error)
    );
  }

  loadDoctorDetails(): void {
    this.doctorService.getDoctor(this.doctor.id).subscribe(
      (doctorData: Doctor) => {
        this.doctor = { ...doctorData }; // Update the doctor object with fresh data
      },
      error => console.error('Error loading doctor details', error)
    );
  }

  onSave(): void {
    this.doctorForm.form.markAllAsTouched(); // Mark all fields as touched for validation feedback
    if (!this.doctorForm.valid) {
      return; // Prevent saving if the form is not valid
    }
    
    console.log('Form Valid:', this.doctorForm.valid);
    this.doctor.role = Role.DOCTOR;
    
    if (this.doctor.id) {
      this.doctorService.updateDoctor(this.doctor).subscribe(
        () => this.dialogRef.close(true),
        error => console.error('Error updating doctor', error)
      );
    } else {
      this.doctorService.registerDoctor(this.doctor).subscribe(
        () => this.dialogRef.close(true),
        error => console.error('Error creating doctor', error)
      );
    }
  }
  

  onCancel(): void {
    this.dialogRef.close(false);
  }
}