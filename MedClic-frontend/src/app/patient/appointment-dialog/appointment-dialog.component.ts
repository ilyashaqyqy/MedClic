import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { dateValidator } from 'src/app/appointment/date-validator/date-validator';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Appointment } from 'src/app/models/appointment.model';

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
    @Inject(MAT_DIALOG_DATA) public data: { patientId: number; doctorId: number },
    private appointmentService: AppointmentService 
  ) {
    this.scheduleForm = this.fb.group({
     appointmentDate: ['', [Validators.required, dateValidator]],
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

  autoScheduleAppointment(): void {
    const { doctorId, patientId } = this.data;

    const reason = this.scheduleForm.get('appointmentReason')?.value || ''; // Retrieve reason from the form

    this.appointmentService.autoScheduleAppointment(doctorId, patientId, reason).subscribe(
        (appointment: Appointment) => {
            console.log('Auto-scheduled appointment:', appointment);
            this.dialogRef.close(appointment); // Close dialog and return appointment data
        },
        (error: any) => {
            console.error('Error auto-scheduling appointment:', error);
        }
    );
}

}