import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  errorMessage: string | null = null; // login errors

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(form: NgForm): void {
    this.errorMessage = null; // Reset error message on new attempt

    if (form.invalid) {
      return;
    }

    const { email, password } = form.value;
    
    this.authService.login(email, password).subscribe(
      (response: { token: string; userId: number; }) => {
        this.authService.saveToken(response.token);
        const role = this.authService.getRole();
        if (role === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else if (role === 'DOCTOR') {
          this.router.navigate(['/doctor-dashboard']);
        } else {
          this.router.navigate(['/find-doctors']);
        }
      },
      (error: any) => {
        console.error('Login failed', error);
        this.errorMessage = 'Login failed. Please check your email and password.'; // Update error message
      }
    );
  }
}
