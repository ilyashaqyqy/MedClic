import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-reschedule-appointment-dialog',
  templateUrl: './reschedule-appointment-dialog.component.html',
  styleUrls: ['./reschedule-appointment-dialog.component.css']
})
export class RescheduleAppointmentDialogComponent implements OnInit {
  rescheduleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RescheduleAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { appointmentDate: string; appointmentTime: string }
  ) {
    this.rescheduleForm = this.fb.group({
      appointmentDate: [this.data.appointmentDate, Validators.required],
      appointmentTime: [this.data.appointmentTime, Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('Rescheduling Appointment Data:', this.data);
  }

  rescheduleAppointment(): void {
    if (this.rescheduleForm.valid) {
      const formValue = this.rescheduleForm.value;
      const rescheduleData = {
        ...formValue,
      };

      console.log('Reschedule Data to be sent:', rescheduleData);
      this.dialogRef.close(rescheduleData);
    } else {
      console.log('Form is invalid. Errors:', this.rescheduleForm.errors);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
