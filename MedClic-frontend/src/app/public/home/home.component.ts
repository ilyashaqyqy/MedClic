import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router) {}
  howItWorks = [
    { icon: 'fas fa-search', title: 'Search for a Doctor', description: 'Select based on specialization, location, and time.' },
    { icon: 'fas fa-calendar-alt', title: 'Schedule an Appointment', description: 'Choose a suitable time and date.' },
    { icon: 'fas fa-check-circle', title: 'Confirm Your Appointment', description: 'Receive a confirmation via email/SMS.' },
    { icon: 'fas fa-video', title: 'Consultation', description: 'Video or in-person consultations available.' }
  ];

  featuredDoctors = [
    { image: 'assets/doctor1.jpg', name: 'Dr. Jane Smith', specialization: 'Cardiologist' },
    { image: 'assets/doctor2.jpg', name: 'Dr. John Doe', specialization: 'Dermatologist' },
    { image: 'assets/doctor3.jpg', name: 'Dr. Emily Brown', specialization: 'Pediatrician' }
  ];

  testimonials = [
    { image: 'assets/patient1.jpg', name: 'Sarah M.', comment: 'MedClic made it so easy to find a great doctor in my area. Highly recommended!' },
    { image: 'assets/patient2.jpg', name: 'Mike T.', comment: 'I love how simple it is to schedule appointments. No more waiting on hold!' },
    { image: 'assets/patient3.jpg', name: 'Lisa R.', comment: 'The reminders feature is a lifesaver. I never miss an appointment now.' }
  ];

  benefits = [
    { icon: 'fas fa-clock', title: 'Easy Appointment Scheduling', description: 'Book appointments with just a few clicks.' },
    { icon: 'fas fa-map-marker-alt', title: 'Find Specialists Near You', description: 'Locate the best doctors in your area.' },
    { icon: 'fas fa-calendar-check', title: 'Manage Appointments Online', description: 'View and modify your appointments easily.' },
    { icon: 'fas fa-bell', title: 'Get Reminders', description: 'Never miss an appointment with our reminder system.' }
  ];

  categories = [
    { id: 1, name: 'Catégorie 1', description: 'Description de la catégorie 1' },
    { id: 2, name: 'Catégorie 2', description: 'Description de la catégorie 2' },
    { id: 3, name: 'Catégorie 3', description: 'Description de la catégorie 3' },
  ];

  navigateToFindDoctor() {
    console.log('Navigating to doctor search page');
    this.router.navigate(['/find-doctors']).then(success => {
      console.log('Navigation successful:', success);
    }).catch(err => {
      console.error('Navigation error:', err);
    });
  }

  signUp() {
    // Implement navigation to sign up page
    console.log('Navigating to sign up page');
  }
}
