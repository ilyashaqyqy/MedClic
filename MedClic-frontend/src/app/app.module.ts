import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminDashboardComponent } from './admin/components/admin-dashboard/admin-dashboard.component';
import { ManageUsersComponent } from './admin/components/manage-users/manage-users.component';
import { ManageDoctorsComponent } from './admin/components/manage-doctors/manage-doctors.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent,
    ManageUsersComponent,
    ManageDoctorsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
