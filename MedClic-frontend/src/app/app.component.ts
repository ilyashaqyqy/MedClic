import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Medclic';
  
    constructor(private authService: AuthService, private router: Router) {}
  
    isLoggedIn(): boolean {
      return this.authService.isLoggedIn();
    }
  
    // Check if the current route is home, admin dashboard, or doctor dashboard
    shouldShowNavbar(): boolean {
      const currentRoute = this.router.url;
      return !(
        currentRoute === '/home' ||
        currentRoute.startsWith('/admin-dashboard') || 
        currentRoute.startsWith('/doctor-dashboard') ||  
        currentRoute.startsWith('/patient-dashboard')
      );
    }
  }
