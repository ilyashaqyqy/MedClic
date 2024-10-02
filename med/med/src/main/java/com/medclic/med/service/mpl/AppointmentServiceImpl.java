package com.medclic.med.service.mpl;

import com.medclic.med.dto.AppointmentDTO;
import com.medclic.med.exception.AppointmentNotFoundException;
import com.medclic.med.exception.DoctorNotFoundException;
import com.medclic.med.exception.NoAvailableSlotException;
import com.medclic.med.exception.PatientNotFoundException;
import com.medclic.med.mapper.AppointmentMapper;
import com.medclic.med.model.Appointment;
import com.medclic.med.model.AppointmentStatus;
import com.medclic.med.repository.AppointmentRepository;
import com.medclic.med.repository.DoctorRepository;
import com.medclic.med.repository.PatientRepository;
import com.medclic.med.service.AppointmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.time.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AppointmentServiceImpl implements AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;


    public AppointmentServiceImpl(AppointmentRepository appointmentRepository, AppointmentMapper appointmentMapper) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentMapper = appointmentMapper;
    }

    @Override
    public AppointmentDTO getAppointmentById(Long appointmentId) {
        log.info("Fetching appointment with id: {}", appointmentId);
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException("Appointment not found with id: " + appointmentId));
        return appointmentMapper.toDTO(appointment);
    }

    @Override
    public AppointmentDTO createAppointment(AppointmentDTO appointmentDTO) {
        log.info("Creating new appointment for patient: {}", appointmentDTO.getPatientId());
        Appointment appointment = appointmentMapper.toEntity(appointmentDTO);
        appointment.setBookingDate(LocalDate.now());
        appointment.setBookingTime(LocalTime.now());
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return appointmentMapper.toDTO(savedAppointment);
    }

    @Override
    public AppointmentDTO updateAppointment(AppointmentDTO appointmentDTO) {
        log.info("Updating appointment with id: {}", appointmentDTO.getId());
        if (!appointmentRepository.existsById(appointmentDTO.getId())) {
            throw new AppointmentNotFoundException("Appointment not found with id: " + appointmentDTO.getId());
        }
        Appointment appointment = appointmentMapper.toEntity(appointmentDTO);
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return appointmentMapper.toDTO(updatedAppointment);
    }

    @Override
    public void cancelAppointment(Long appointmentId) {
        log.info("Cancelling appointment with id: {}", appointmentId);
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException("Appointment not found with id: " + appointmentId));
        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    @Override
    public List<AppointmentDTO> getAppointmentsByPatientId(Long patientId) {
        log.info("Fetching appointments for patient with id: {}", patientId);
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        return appointments.stream().map(appointmentMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDTO> getAppointmentsByDoctorId(Long doctorId) {
        log.info("Fetching appointments for doctor with id: {}", doctorId);
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        return appointments.stream().map(appointmentMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public void confirmAppointment(Long appointmentId) {
        log.info("Confirming appointment with id: {}", appointmentId);
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException("Appointment not found with id: " + appointmentId));
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        appointmentRepository.save(appointment);
    }

    @Override
    public AppointmentDTO rescheduleAppointment(Long id, AppointmentDTO appointmentDTO) {
        // Fetch the existing appointment
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);

        // Check if the appointment exists
        if (optionalAppointment.isPresent()) {
            Appointment existingAppointment = optionalAppointment.get();

            // Update only the date and time fields
            existingAppointment.setDate((Date) appointmentDTO.getDate());
            existingAppointment.setTime(appointmentDTO.getTime());

            // Save the updated appointment back to the database
            Appointment updatedAppointment = appointmentRepository.save(existingAppointment);

            // Convert back to DTO using your mapper
            return appointmentMapper.toDTO(updatedAppointment);
        }

        // Return null or handle the case when the appointment is not found
        return null; // Or you could return a default AppointmentDTO if needed
    }





    @Override
    public AppointmentDTO autoScheduleAppointmentWithGap(Long doctorId, Long patientId, String reason) {
        log.info("Auto-scheduling appointment for patient: {} with doctor: {}", patientId, doctorId);

        LocalDate appointmentDate = LocalDate.now();
        LocalTime nextAvailableTime;

        while (true) {
            // Skip weekends (Saturday and Sunday)
            if (appointmentDate.getDayOfWeek() == DayOfWeek.SATURDAY || appointmentDate.getDayOfWeek() == DayOfWeek.SUNDAY) {
                appointmentDate = appointmentDate.plusDays(1); // Move to the next day if weekend
                continue;
            }

            // Fetch the doctor's last appointment for the current date
            Appointment lastAppointment = appointmentRepository
                    .findTopByDoctorIdAndDateOrderByTimeDesc(doctorId, java.sql.Date.valueOf(appointmentDate));

            if (lastAppointment == null) {
                // No appointments for this day, start with 9 AM
                nextAvailableTime = LocalTime.of(9, 0);
            } else {
                // Calculate next available time
                nextAvailableTime = lastAppointment.getTime().toLocalTime().plusMinutes(30);
            }

            LocalTime endOfDay = LocalTime.of(17, 0);

            // If the next available time exceeds end of day, move to the next day
            if (nextAvailableTime.isAfter(endOfDay)) {
                appointmentDate = appointmentDate.plusDays(1);
                continue; // Check the next day's availability
            }

            break; // A valid time was found
        }

        // Create and save the appointment
        Appointment appointment = new Appointment();
        appointment.setPatient(patientRepository.findById(patientId)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found")));
        appointment.setDoctor(doctorRepository.findById(doctorId)
                .orElseThrow(() -> new DoctorNotFoundException("Doctor not found")));
        appointment.setDate(java.sql.Date.valueOf(appointmentDate));
        appointment.setTime(java.sql.Time.valueOf(nextAvailableTime));
        appointment.setBookingDate(LocalDate.now());
        appointment.setBookingTime(LocalTime.now());
        appointment.setAppointmentReason(reason);
        appointment.setStatus(AppointmentStatus.SCHEDULED);

        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Return the saved appointment as DTO
        return appointmentMapper.toDTO(savedAppointment);
    }


    @Override
    public List<LocalTime> checkDoctorAvailability(Long doctorId, LocalDate appointmentDate) {
        log.info("Checking availability for doctor: {} on date: {}", doctorId, appointmentDate);

        // Define the doctor's working hours (e.g., 9:00 AM to 5:00 PM)
        LocalTime startOfDay = LocalTime.of(9, 0);
        LocalTime endOfDay = LocalTime.of(17, 0);

        // Fetch all appointments for the doctor on the specified date
        List<Appointment> appointments = appointmentRepository
                .findByDoctorIdAndDate(doctorId, java.sql.Date.valueOf(appointmentDate));

        // Create a list of all possible time slots
        List<LocalTime> availableTimes = new ArrayList<>();
        LocalTime currentTime = startOfDay;

        // Loop to generate all available slots for the day
        while (currentTime.isBefore(endOfDay)) {
            final LocalTime timeSlot = currentTime; // Create a new effectively final variable for lambda expression

            // Check if any appointment exists at this time
            boolean isTimeSlotTaken = appointments.stream()
                    .anyMatch(appointment -> appointment.getTime().toLocalTime().equals(timeSlot));

            // If the time slot is not taken, add it to the available times
            if (!isTimeSlotTaken) {
                availableTimes.add(timeSlot);
            }

            // Increment the current time by 30 minutes
            currentTime = currentTime.plusMinutes(30);
        }

        return availableTimes;
    }

}














