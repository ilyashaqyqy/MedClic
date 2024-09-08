import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../../services/doctor.service';
import { Doctor } from '../../../models/doctor.model';
import { DoctorDialogComponent } from '../../../admin/components/doctor-dialog/doctor-dialog.component'; 
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-manage-doctors',
  templateUrl: './manage-doctors.component.html',
  styleUrls: ['./manage-doctors.component.css']
})
export class ManageDoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  errorMessage: string | null = null;

  constructor(private doctorService: DoctorService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe(
      (data: Doctor[]) => this.doctors = data,
      error => this.errorMessage = 'Error loading doctors'
    );
  }

  openDialog(doctor: Doctor | null = null): void {
    const dialogRef = this.dialog.open(DoctorDialogComponent, {
      width: '500px',
      data: { doctor: doctor || { id: 0, firstName: '', lastName: '', email: '', specialization: '', yearsOfExperience: 0, consultationFee: 0, profilePhoto: '', bio: '', education: '', certifications: '' } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDoctors();
      }
    });
  }

  deleteDoctor(id: number): void {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.doctorService.deleteDoctor(id).subscribe(
        () => this.loadDoctors(),
        error => this.errorMessage = 'Error deleting doctor'
      );
    }
  }
}