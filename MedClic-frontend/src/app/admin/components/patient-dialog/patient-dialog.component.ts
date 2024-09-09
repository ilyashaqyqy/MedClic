import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../models/patient.model';

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrls: ['./patient-dialog.component.css']
})
export class PatientDialogComponent {
  patient: Patient;

  constructor(
    public dialogRef: MatDialogRef<PatientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { patient: Patient },
    private patientService: PatientService
  ) {
    this.patient = data.patient;
  }

  onSave(): void {
    if (this.patient.id) {
      this.patientService.updatePatient(this.patient).subscribe(
        () => this.dialogRef.close(true),
        error => console.error('Error updating patient', error)
      );
    } else {
      this.patientService.createPatient(this.patient).subscribe(
        () => this.dialogRef.close(true),
        error => console.error('Error creating patient', error)
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
