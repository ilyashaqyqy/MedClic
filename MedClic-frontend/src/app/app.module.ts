import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 



import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar'; 
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';




import { AuthInterceptor } from './interceptors/auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AdminDashboardComponent } from './admin/components/admin-dashboard/admin-dashboard.component';
import { ManageUsersComponent } from './admin/components/manage-users/manage-users.component';
import { ManageDoctorsComponent } from './admin/components/manage-doctors/manage-doctors.component';
import { DoctorDashboardComponent } from './doctor/components/doctor-dashboard/doctor-dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DoctorDialogComponent } from './admin/components/doctor-dialog/doctor-dialog.component';
import { ManagePatientComponent } from './admin/components/manage-patient/manage-patient.component';
import { PatientDialogComponent } from './admin/components/patient-dialog/patient-dialog.component';
import { PatientDashboardComponent } from './patient/patient-dashboard/patient-dashboard.component';
import { FindDoctorsComponent } from './patient/find-doctors/find-doctors.component';
import { DoctorDetailsComponent } from './doctor/components/doctor-details/doctor-details.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent,
    ManageUsersComponent,
    ManageDoctorsComponent,
    LoginComponent,
    RegisterComponent,
    DoctorDashboardComponent,
    DoctorDialogComponent,
    ManagePatientComponent,
    PatientDialogComponent,
    PatientDashboardComponent,
    FindDoctorsComponent,
    DoctorDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,


    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,

    FontAwesomeModule

 
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }