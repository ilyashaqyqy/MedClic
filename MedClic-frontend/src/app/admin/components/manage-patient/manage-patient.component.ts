import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PatientDialogComponent } from '../patient-dialog/patient-dialog.component';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../models/patient.model';

@Component({
  selector: 'app-manage-patient',
  templateUrl: './manage-patient.component.html',
  styleUrls: ['./manage-patient.component.css']
})
export class ManagePatientComponent {
  patients: Patient[] = [];
  searchTerm: string = '';

  constructor(private patientService: PatientService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe(
      (data: Patient[]) => {
        this.patients = data;
      },
      error => console.error('Error loading patients', error)
    );
  }

  openDialog(patient?: Patient): void {
    const dialogRef = this.dialog.open(PatientDialogComponent, {
      data: { patient: patient || { id: null, name: '', email: '', dateOfBirth: '', medicalHistory: '', insuranceInfo: '', address: '' } },
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPatients();
      }
    });
  }

  deletePatient(id: number): void {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.patientService.deletePatient(id).subscribe(
        () => this.loadPatients(),
        error => console.error('Error deleting patient', error)
      );
    }
  }

  filteredPatients(): Patient[] {
    return this.patients.filter(patient => 
      patient.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}

