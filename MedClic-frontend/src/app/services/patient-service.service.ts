import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:8080/api/patients';

  constructor(private http: HttpClient) {}

  // Method to get patient count
  getPatientCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  // Other methods related to patients can go here
}
