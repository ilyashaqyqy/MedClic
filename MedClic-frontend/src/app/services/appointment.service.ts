import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8080/api/appointments';

  constructor(private http: HttpClient) {}

  createAppointment(appointmentData: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointmentData);
  }

  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  getAllAppointmentsByDoctorId(userId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/doctors/${userId}`);
  }


  getAllAppointmentsByPatientId(userId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/patients/${userId}`);
  }

  confirmAppointment(appointmentId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${appointmentId}/confirm`, {});
  }

  cancelAppointment(appointmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${appointmentId}`);
  }

  updateAppointment(appointment: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${appointment.id}`, appointment);
  }

  // appointment.service.ts
rescheduleAppointment(id: number, appointmentDTO: Appointment): Observable<Appointment> {
  return this.http.put<Appointment>(`${this.apiUrl}/${id}/reschedule`, appointmentDTO);
}


}