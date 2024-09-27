import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-appointment-dialog',
  templateUrl: './appointment-dialog.component.html',
  styleUrls: ['./appointment-dialog.component.css']
})
export class AppointmentDialogComponent implements OnInit {
  scheduleForm: FormGroup;
  appointmentTypes = ['Initial Consultation', 'Follow-up Appointment', 'Routine Check-up'];
  appointmentReasons = ['General Health Check', 'Follow-up on Previous Issue', 'Injury or Pain'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { patientId: number; doctorId: number }
  ) {
    this.scheduleForm = this.fb.group({
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required],
      appointmentType: ['', Validators.required],
      appointmentReason: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    console.log('Dialog Data:', this.data);
  }

  scheduleAppointment(): void {
    if (this.scheduleForm.valid) {
      const formValue = this.scheduleForm.value;
      
      const appointmentData = {
        ...formValue,
        patientId: this.data.patientId,
        doctorId: this.data.doctorId
      };

      console.log('Appointment Data to be sent:', appointmentData);
      this.dialogRef.close(appointmentData);
    } else {
      console.log('Form is invalid. Errors:', this.scheduleForm.errors);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}