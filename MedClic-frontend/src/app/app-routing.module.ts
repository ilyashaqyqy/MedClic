import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DoctorDashboardComponent } from './doctor/components/doctor-dashboard/doctor-dashboard.component';
import { AdminDashboardComponent } from './admin/components/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './user/components/user-dashboard/user-dashboard.component';
import { ManageDoctorsComponent } from './admin/components/manage-doctors/manage-doctors.component';
import { ManagePatientComponent } from './admin/components/manage-patient/manage-patient.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'doctor-dashboard' , component: DoctorDashboardComponent },
  { path: 'user-dashboard' , component: UserDashboardComponent},

  // Admin routes
  { path: 'admin-dashboard' , component: AdminDashboardComponent , canActivate: [AuthGuard, AdminGuard]},
  {path: 'manage-doctors' , component: ManageDoctorsComponent , canActivate: [AuthGuard, AdminGuard]},
  {path: 'manage-patients' , component: ManagePatientComponent , canActivate: [AuthGuard, AdminGuard]},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
