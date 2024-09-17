import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { UserService } from '../../services/user.service';
import { Patient } from '../../models/patient.model';
import { User } from '../../models/user.model';

interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  sidebarOpen = true;
  showProfileMenu = false;
  user: User | null = null;
  patient: Patient | null = null;

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'My Appointments', route: '/appointments' },
    { label: 'Favourites', route: '/favourites' },
    { label: 'Messages', route: '/messages' },
    { label: 'Profile Settings', route: '/profile' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadUserAndPatientData();
  }

  loadUserAndPatientData(): void {
    const userId = localStorage.getItem('userId');
    
    if (userId) {
      const userIdNum = Number(userId);
      this.userService.getUser(userIdNum).subscribe(
        (user: User) => {
          this.user = user;
          console.log('User data:', user);
          this.loadPatientData(userIdNum);
        },
        (error) => {
          console.error('Failed to fetch user details:', error);
        }
      );
    } else {
      console.error('No user ID found in local storage');
    }
  }
  
  loadPatientData(userId: number): void {
    this.patientService.getPatient(userId).subscribe(
      (patient: Patient) => {
        this.patient = patient;
        console.log('Patient data:', patient);
      },
      (error) => {
        console.error('Failed to fetch patient details:', error);
      }
    );
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  toggleMessages(): void {
    // Implement message toggling logic here
  }

  toggleNotifications(): void {
    // Implement notification toggling logic here
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  findDoctors(): void {
    this.router.navigate(['/find-doctors']);
  }

}
