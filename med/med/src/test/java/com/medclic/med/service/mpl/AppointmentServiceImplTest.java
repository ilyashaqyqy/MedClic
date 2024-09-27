package com.medclic.med.service.mpl;
import com.medclic.med.dto.AppointmentDTO;
import com.medclic.med.exception.AppointmentNotFoundException;
import com.medclic.med.mapper.AppointmentMapper;
import com.medclic.med.model.Appointment;
import com.medclic.med.model.AppointmentStatus;
import com.medclic.med.repository.AppointmentRepository;
import com.medclic.med.service.mpl.AppointmentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;
import java.util.List;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AppointmentServiceImplTest {

    @InjectMocks
    private AppointmentServiceImpl appointmentService;

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private AppointmentMapper appointmentMapper;

    private Appointment appointment;
    private AppointmentDTO appointmentDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);

        appointment = new Appointment();
        appointment.setId(1L);
        appointment.setStatus(AppointmentStatus.SCHEDULED);

        appointmentDTO = new AppointmentDTO();
        appointmentDTO.setId(1L);
        appointmentDTO.setStatus(AppointmentStatus.SCHEDULED);
    }

    @Test
    void testGetAppointmentById() {
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        when(appointmentMapper.toDTO(appointment)).thenReturn(appointmentDTO);

        AppointmentDTO result = appointmentService.getAppointmentById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(appointmentRepository, times(1)).findById(1L);
    }

    @Test
    void testGetAppointmentById_NotFound() {
        when(appointmentRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(AppointmentNotFoundException.class, () -> {
            appointmentService.getAppointmentById(1L);
        });

        String expectedMessage = "Appointment not found with id: 1";
        String actualMessage = exception.getMessage();

        assertTrue(actualMessage.contains(expectedMessage));
    }

    @Test
    void testCreateAppointment() {
        when(appointmentMapper.toEntity(appointmentDTO)).thenReturn(appointment);
        when(appointmentRepository.save(appointment)).thenReturn(appointment);
        when(appointmentMapper.toDTO(appointment)).thenReturn(appointmentDTO);

        AppointmentDTO result = appointmentService.createAppointment(appointmentDTO);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(appointmentRepository, times(1)).save(appointment);
    }

    @Test
    void testUpdateAppointment() {
        when(appointmentRepository.existsById(appointmentDTO.getId())).thenReturn(true);
        when(appointmentMapper.toEntity(appointmentDTO)).thenReturn(appointment);
        when(appointmentRepository.save(appointment)).thenReturn(appointment);
        when(appointmentMapper.toDTO(appointment)).thenReturn(appointmentDTO);

        AppointmentDTO result = appointmentService.updateAppointment(appointmentDTO);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(appointmentRepository, times(1)).save(appointment);
    }

    @Test
    void testUpdateAppointment_NotFound() {
        when(appointmentRepository.existsById(appointmentDTO.getId())).thenReturn(false);

        Exception exception = assertThrows(AppointmentNotFoundException.class, () -> {
            appointmentService.updateAppointment(appointmentDTO);
        });

        String expectedMessage = "Appointment not found with id: 1";
        String actualMessage = exception.getMessage();

        assertTrue(actualMessage.contains(expectedMessage));
    }

    @Test
    void testCancelAppointment() {
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));

        appointmentService.cancelAppointment(1L);

        verify(appointmentRepository, times(1)).save(appointment);
        assertEquals(AppointmentStatus.CANCELLED, appointment.getStatus());
    }

    @Test
    void testGetAppointmentsByPatientId() {
        List<Appointment> appointments = new ArrayList<>();
        appointments.add(appointment);

        when(appointmentRepository.findByPatientId(1L)).thenReturn(appointments);
        when(appointmentMapper.toDTO(appointment)).thenReturn(appointmentDTO);

        List<AppointmentDTO> result = appointmentService.getAppointmentsByPatientId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(appointmentRepository, times(1)).findByPatientId(1L);
    }

    @Test
    void testConfirmAppointment() {
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));

        appointmentService.confirmAppointment(1L);

        verify(appointmentRepository, times(1)).save(appointment);
        assertEquals(AppointmentStatus.CONFIRMED, appointment.getStatus());
    }
}
