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

    const { username, password } = form.value;
    this.authService.login(username, password).subscribe(
      (response: { token: string; userId: number; }) => {
        this.authService.saveToken(response.token);
        const role = this.authService.getRole();
        console.log('Role after login:', role);
        if (role === 'ROLE_ADMIN') {
          console.log('Navigating to dashboard');
          this.router.navigate(['/dashboard']);
        } else if (role === 'ROLE_TECHNICIEN') {
          console.log('Navigating to technician dashboard');
          this.router.navigate(['/technician-dashboard']);
        } else {
          console.log('Navigating to home');
          this.router.navigate(['/create-ticket']);
        }
      },
      (error: any) => {
        console.error('Login failed', error);
        this.errorMessage = 'Login failed. Please check your username and password.';
      }
    );
  }
}
