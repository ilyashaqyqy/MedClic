package com.medclic.med.service;

import com.medclic.med.dto.AppointmentDTO;

import java.util.List;

public interface AppointmentService {
    AppointmentDTO getAppointmentById(Long appointmentId);
    AppointmentDTO createAppointment(AppointmentDTO appointmentDTO);
    AppointmentDTO updateAppointment(AppointmentDTO appointmentDTO);
    void cancelAppointment(Long appointmentId);
    List<AppointmentDTO> getAppointmentsByPatientId(Long patientId);
    List<AppointmentDTO> getAppointmentsByDoctorId(Long doctorId);
    void confirmAppointment(Long appointmentId);
}

