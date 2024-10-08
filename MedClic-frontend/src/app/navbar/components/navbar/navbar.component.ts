import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {


  constructor(private authService: AuthService, private router: Router) {}

  isMobileMenuOpen: boolean = false;
  isScrolled = false; // Track the scroll state



    // Listen for scroll events
    @HostListener('window:scroll', [])
    onWindowScroll() {
      this.isScrolled = window.scrollY > 50; // Change 50 to the desired scroll threshold
    }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    console.log('Logout clicked');
  }
}
