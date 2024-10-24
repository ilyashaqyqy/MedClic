import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:8080/api/patients';
  private apiapointmentUrl = 'http://localhost:8080/api/appointments';

  constructor(private http: HttpClient) {}


  getPatientCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl);
  }

  getPatient(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  createPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient);
  }

  updatePatient(patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${patient.id}`, patient);
  }

  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  //////////////////////////////////////////////////::::

  getAppointments(userId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiapointmentUrl}/patients/${userId}`);
  }


  getAppointmentCount(patientId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${patientId}/appointment-count`);
  }

  // getPatientByUserId(userId: number): Observable<Patient> {
  //   return this.http.get<Patient>(`${this.apiUrl}/users/${userId}`);
  // }



  
}
