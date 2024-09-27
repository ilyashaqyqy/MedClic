package com.medclic.med.service.mpl;

import com.medclic.med.dto.AppointmentDTO;
import com.medclic.med.exception.AppointmentNotFoundException;
import com.medclic.med.mapper.AppointmentMapper;
import com.medclic.med.model.Appointment;
import com.medclic.med.model.AppointmentStatus;
import com.medclic.med.repository.AppointmentRepository;
import com.medclic.med.service.AppointmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AppointmentServiceImpl implements AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;

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
}
