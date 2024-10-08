import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { Doctor } from '../../../models/doctor.model';
import { Appointment } from '../../../models/appointment.model';
import { faUser, faCalendarAlt, faClipboard, faEnvelope, faBell, faBars, faStethoscope , faComments } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent implements OnInit {
toggleNotificationMenu() {
throw new Error('Method not implemented.');
}
toggleChatMenu() {
throw new Error('Method not implemented.');
}
  user: Doctor | null = null;
  doctor: Doctor | null = null;
  appointments: Appointment[] = [];

  faEnvelope = faEnvelope;
  faBell = faBell;
  faCalendarAlt = faCalendarAlt;
  faClipboard = faClipboard;
  faUser = faUser;
  faStethoscope = faStethoscope;
  faBars = faBars;
  faComments = faComments;
 

  showProfileMenu: boolean = false;
  isSidebarOpen: boolean = false; // Controls the burger menu for mobile
  currentSection: string = 'dashboard';
  currentSectionLabel: string = 'Dashboard';
  patientCount: number = 0;

  menuItems = [
    { section: 'dashboard', label: 'Dashboard', icon: faStethoscope },
    { section: 'appointments', label: 'My Appointments', icon: faCalendarAlt },
    { section: 'patient', label: 'Patient', icon: faClipboard },
    { section: 'profile', label: 'Profile Settings', icon: faUser }
  ];

  dashboardCards = [
    { title: 'Upcoming Appointments', value: '5', link: 'appointments', icon: faCalendarAlt },
    { title: 'Total Patients', value: this.patientCount.toString(), link: 'patient-records', icon: faClipboard }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.loadDoctorData();
  }

  loadDoctorData(): void {
    const doctorId = localStorage.getItem('userId');
    if (doctorId) {
      const doctorIdNum = Number(doctorId);
      this.doctorService.getDoctor(doctorIdNum).subscribe(
        (doctor: Doctor) => {
          this.doctor = doctor;
          this.user = doctor;
          this.getPatientCount(doctorIdNum);
        },
        (error) => {
          console.error('Failed to fetch doctor details:', error);
        }
      );
    } else {
      console.error('No doctor ID found in local storage');
    }
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  handleMenuClick(section: string): void {
    this.currentSection = section;
    const item = this.menuItems.find((menu) => menu.section === section);
    if (item) {
      this.currentSectionLabel = item.label;
    }
    this.isSidebarOpen = false; // Close the sidebar after clicking in mobile
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getPatientCount(id: number): void {
    this.doctorService.getPatientCountForDoctor(id).subscribe({
      next: (count) => {
        this.patientCount = count; // Store the retrieved patient count
        this.updateDashboardCards(); // Call a method to update the card value
      },
      error: (error) => {
        console.error('Error fetching patient count:', error); // Log any errors
      }
    });
  }
  
  updateDashboardCards(): void {
    this.dashboardCards[1].value = this.patientCount.toString(); // Assuming the second card is for patient count
  }
}
