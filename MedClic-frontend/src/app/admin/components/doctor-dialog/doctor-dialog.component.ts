import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DoctorService } from '../../../services/doctor.service';  
import { Doctor } from '../../../models/doctor.model'; 

@Component({
  selector: 'app-doctor-dialog',
  templateUrl: './doctor-dialog.component.html',
  styleUrls: ['./doctor-dialog.component.css']
})
export class DoctorDialogComponent {
  doctor: Doctor;

  constructor(
    public dialogRef: MatDialogRef<DoctorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { doctor: Doctor },
    private doctorService: DoctorService
  ) {
    this.doctor = data.doctor;
  }

  onSave(): void {
    if (this.doctor.id) {
      this.doctorService.updateDoctor(this.doctor).subscribe(
        () => this.dialogRef.close(true),
        error => console.error('Error updating doctor', error)
      );
    } else {
      this.doctorService.createDoctor(this.doctor).subscribe(
        () => this.dialogRef.close(true),
        error => console.error('Error creating doctor', error)
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}