import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { UserService } from '../../services/user.service';
import { Patient } from '../../models/patient.model';
import { User } from '../../models/user.model';
import { Appointment } from '../../models/appointment.model';
import { faUser, faCalendarAlt, faHeart, faEnvelope, faExclamationTriangle, faLaptop, faTachometerAlt, faTicketAlt, faUsers , faSearch  , faAngleDown, faBell , faBars} from '@fortawesome/free-solid-svg-icons';

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
  appointments: Appointment[] = [];
  currentSection = 'dashboard';


  faEnvelope = faEnvelope; // Add this line
  faBell = faBell;         // Ensure you have this line too
  faTachometerAlt = faTachometerAlt;
  faCalendarAlt = faCalendarAlt;
  faUser = faUser;
  faBars = faBars ;



  menuItems = [
    { section: 'dashboard', label: 'Dashboard', icon: faTachometerAlt },
    { section: 'appointments', label: 'My Appointments', icon: faCalendarAlt },
    { section: 'favourites', label: 'Favourites', icon: faHeart },
    { section: 'messages', label: 'Messages', icon: faEnvelope },
    { section: 'profile', label: 'Profile Settings', icon: faUser }
  ];

  dashboardCards = [
    { title: 'Total Appointments', value: '10', link: '/appointments', linkText: 'View Appointments', icon: faCalendarAlt }
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

  loadContent(section: string): void {
    this.currentSection = section;
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
        this.loadAppointments(userId);
      },
      (error) => {
        console.error('Failed to fetch patient details:', error);
      }
    );
  }


  loadAppointments(userId: number): void {
    this.patientService.getAppointments(userId).subscribe(
      (appointments: Appointment[]) => {
        this.appointments = appointments;
        console.log('Appointments:', appointments);
      },
      (error) => {
        console.error('Failed to fetch appointments:', error);
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
