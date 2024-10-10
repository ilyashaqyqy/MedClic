package com.medclic.med.controller;


import com.medclic.med.dto.AppointmentDTO;

import com.medclic.med.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;




    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDTO> getAppointmentById(@PathVariable Long id) {
        AppointmentDTO appointmentDTO = appointmentService.getAppointmentById(id);
        return new ResponseEntity<>(appointmentDTO, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('PATIENT')")
    @PostMapping
    public ResponseEntity<AppointmentDTO> createAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        AppointmentDTO createdAppointment = appointmentService.createAppointment(appointmentDTO);
        return new ResponseEntity<>(createdAppointment, HttpStatus.CREATED);
    }


    @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('DOCTOR')")
    @PutMapping("/{id}")
    public ResponseEntity<AppointmentDTO> updateAppointment(@PathVariable Long id, @RequestBody AppointmentDTO appointmentDTO) {
        appointmentDTO.setId(id);
        AppointmentDTO updatedAppointment = appointmentService.updateAppointment(appointmentDTO);
        return new ResponseEntity<>(updatedAppointment, HttpStatus.OK);
    }


    @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('DOCTOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelAppointment(@PathVariable Long id) {
        appointmentService.cancelAppointment(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('DOCTOR')")
    @GetMapping("/patients/{patientId}")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByPatientId(@PathVariable Long patientId) {
        List<AppointmentDTO> appointments = appointmentService.getAppointmentsByPatientId(patientId);
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    @GetMapping("/doctors/{doctorId}")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByDoctorId(@PathVariable Long doctorId) {
        List<AppointmentDTO> appointments = appointmentService.getAppointmentsByDoctorId(doctorId);
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }


    @PreAuthorize("hasAuthority('DOCTOR')")
    @PostMapping("/{id}/confirm")
    public ResponseEntity<Void> confirmAppointment(@PathVariable Long id) {
        appointmentService.confirmAppointment(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    @PreAuthorize("hasAuthority('DOCTOR') or hasAuthority('PATIENT')")
    @PutMapping("/{id}/reschedule")
    public ResponseEntity<AppointmentDTO> rescheduleAppointment(@PathVariable Long id, @RequestBody AppointmentDTO appointmentDTO) {
        // Use the service to handle rescheduling
        AppointmentDTO updatedAppointment = appointmentService.rescheduleAppointment(id, appointmentDTO);
        return new ResponseEntity<>(updatedAppointment, HttpStatus.OK);
    }


    @PreAuthorize("hasAuthority('PATIENT')")
    @PostMapping("/auto-schedule")
    public ResponseEntity<AppointmentDTO> autoScheduleAppointment(
            @RequestParam Long doctorId,
            @RequestParam Long patientId,
            @RequestParam String reason) {
        AppointmentDTO appointmentDTO = appointmentService.autoScheduleAppointmentWithGap(doctorId, patientId, reason);
        return ResponseEntity.ok(appointmentDTO);
    }




    @GetMapping("/doctor/{doctorId}/first-available")
    public ResponseEntity<List<LocalTime>> findFirstAvailableSlots(@PathVariable Long doctorId) {
        List<LocalTime> availableSlots = appointmentService.findFirstAvailableSlots(doctorId);

        if (availableSlots.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(availableSlots);
    }





    @GetMapping("/available-slots")
    public ResponseEntity<Map<LocalDate, List<LocalTime>>> getAvailableSlots(
            @RequestParam Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(defaultValue = "7") int daysToCheck) {

        Map<LocalDate, List<LocalTime>> availableSlots =
                appointmentService.findAvailableSlotsFromDate(doctorId, startDate, daysToCheck);

        if (availableSlots.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(availableSlots);
    }





}
