import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { jwtDecode}  from 'jwt-decode';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';

  private userId: number | null = null;
  private username: string | null = null;
  private role: string[] | null = null;
  private currentUser: User | null = null;
  private email: null | undefined;

  constructor(private http: HttpClient, private router: Router) {}

  register(request: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, request);
  }


  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string; userId: number }>(`${this.apiUrl}/authenticate`, { email, password }).pipe(
      tap(response => {
        this.saveToken(response.token);
        this.userId = response.userId;
        localStorage.setItem('userId', this.userId.toString());
        localStorage.setItem('email', email);
        console.log('User ID stored:', this.userId);
    
      })
    );
  }
  

  setCurrentUser(user: User): void {
    this.currentUser = user;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }


  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.setUserDataFromToken(token);
  }


  setUserDataFromToken(token: string): void {
    const decodedToken: any = this.decodeToken(token);
    console.log('Decoded Token:', decodedToken);
    this.username = decodedToken.sub;
    this.role = decodedToken.roles;
    this.userId = decodedToken.idUser || null;
  }
  

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  decodeToken(token: string): any {
    return jwtDecode(token);
  }

  getUsername(): string | null {
    if (!this.username) {
      const token = this.getToken();
      if (token) {
        this.username = this.decodeToken(token).sub;
      }
    }
    return this.username;
  }

  getUserId(): number | null {
    if (!this.userId) {
      const token = this.getToken();
      if (token) {
        this.userId = this.decodeToken(token).idUser || null;
      }
    }
    return this.userId;
  }

  getRole(): string | null {
    const token = this.getToken(); // Assuming getToken() retrieves the JWT
    if (token) {
      const decodedToken = this.decodeToken(token); // Decode the token
      return decodedToken.roles || null; // Adjust based on your token structure
    }
    return null;
  }
  


  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId'); 
    localStorage.removeItem('email');  
    this.username = null;
    this.role = null;
    this.userId = null;
    this.router.navigate(['/login']);
  }
  



  // logout(): void {
  //   localStorage.removeItem('authToken');
  //   this.username = null;
  //   this.role = null;
  //   this.userId = null;
  //   this.router.navigate(['/login']);
  // }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  
}
