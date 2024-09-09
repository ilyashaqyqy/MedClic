import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { DoctorService } from '../../../services/doctor.service';
import { faTachometerAlt, faUserMd, faCalendarAlt, faUsers, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  // FontAwesome Icons
  faTachometerAlt = faTachometerAlt;
  faUserMd = faUserMd;
  faCalendarAlt = faCalendarAlt;
  faUsers = faUsers;
  faSignOutAlt = faSignOutAlt;
  
  isMobileMenuOpen = false;

  // Dashboard Sections
  currentSection: string = 'dashboard';
  menuItems = [
    { section: 'dashboard', label: 'Dashboard', icon: faTachometerAlt },
    { section: 'doctors', label: 'Doctors', icon: faUserMd },
    { section: 'appointments', label: 'Appointments', icon: faCalendarAlt },
    { section: 'patients', label: 'Patients', icon: faUsers }
  ];

  // Dashboard Cards (summary data)
  dashboardCards = [
    { title: 'Total Doctors', value: '0', link: 'doctors', linkText: 'Manage Doctors', icon: faUserMd },
    { title: 'Total Appointments', value: '120', link: 'appointments', linkText: 'Manage Appointments', icon: faCalendarAlt },
    { title: 'Total Patients', value: '300', link: 'patients', linkText: 'Manage Patients', icon: faUsers }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.loadDoctorCount();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  loadContent(section: string) {
    this.currentSection = section;
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  loadDoctorCount(): void {
    this.doctorService.getDoctorCount().subscribe(
      (count: number) => this.dashboardCards[0].value = count.toString(),
      error => console.error('Error fetching doctor count', error)
    );
  }
}
