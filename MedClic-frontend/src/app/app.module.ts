import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminDashboardComponent } from './admin/components/admin-dashboard/admin-dashboard.component';
import { ManageUsersComponent } from './admin/components/manage-users/manage-users.component';
import { ManageDoctorsComponent } from './admin/components/manage-doctors/manage-doctors.component';
import { UserDashboardComponent } from './user/components/user-dashboard/user-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent,
    ManageUsersComponent,
    ManageDoctorsComponent,
    UserDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
