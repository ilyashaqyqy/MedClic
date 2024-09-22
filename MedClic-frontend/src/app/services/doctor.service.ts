import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:8080/api/doctors'; 
  private authUrl = 'http://localhost:8080/api/v1/auth';

  constructor(private http: HttpClient) { }

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl);
  }

  getDoctor(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }

  registerDoctor(doctor: Doctor): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/register/doctor`, doctor, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  updateDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/${doctor.id}`, doctor, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  deleteDoctor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  getDoctorCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
    
  }
}
