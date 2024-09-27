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

  errorMessage: string | null = null; //login errors

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const { email, password } = form.value;
    // console.log('Email:', email);
    // console.log('Password:', password);
    this.authService.login(email, password).subscribe(
      (response: { token: string; userId: number; }) => {
        this.authService.saveToken(response.token);
        const role = this.authService.getRole();
        console.log('Role after login:', role);
        if (role === 'ADMIN') {
          console.log('Navigating to admin dashboard');
          this.router.navigate(['/admin-dashboard']);
        } else if (role === 'DOCTOR') {
          console.log('Navigating to doctor dashboard');
          this.router.navigate(['/doctor-dashboard']);
        } else {
          console.log('Navigating to User Patient Dashboard');
          this.router.navigate(['/patient-dashboard']);
        }
      },
      (error: any) => {
        console.error('Login failed', error);
        this.errorMessage = 'Login failed. Please check your username and password.';
      }
    );
  }
}
