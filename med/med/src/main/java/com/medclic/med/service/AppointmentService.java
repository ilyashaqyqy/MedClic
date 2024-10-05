package com.medclic.med.service;

import com.medclic.med.dto.AppointmentDTO;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

public interface AppointmentService {
    AppointmentDTO getAppointmentById(Long appointmentId);
    AppointmentDTO createAppointment(AppointmentDTO appointmentDTO);
    AppointmentDTO updateAppointment(AppointmentDTO appointmentDTO);
    void cancelAppointment(Long appointmentId);
    List<AppointmentDTO> getAppointmentsByPatientId(Long patientId);
    List<AppointmentDTO> getAppointmentsByDoctorId(Long doctorId);
    void confirmAppointment(Long appointmentId);
    AppointmentDTO rescheduleAppointment(Long id, AppointmentDTO appointmentDTO);


    AppointmentDTO autoScheduleAppointmentWithGap(Long doctorId, Long patientId, String reason);

    List<LocalTime> findFirstAvailableSlots(Long doctorId);

    Map<LocalDate, List<LocalTime>> findAvailableSlotsFromDate(Long doctorId, LocalDate startDate, int daysToCheck);

}

