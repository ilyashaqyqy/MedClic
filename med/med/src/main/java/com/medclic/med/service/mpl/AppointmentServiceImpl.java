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
import java.util.*;
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

        // Check if the requested date and time are available
        List<Time> bookedSlots = appointmentRepository.findBookedSlotsByDoctorAndDate(
                appointmentDTO.getDoctorId(), appointmentDTO.getDate());

        // If the requested time is already booked, throw an exception or handle it accordingly
        if (bookedSlots.contains(appointmentDTO.getTime())) {
            throw new NoAvailableSlotException("The selected time slot is already booked.");
        }

        // Proceed to create the appointment
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
            existingAppointment.setDate(appointmentDTO.getDate());
            existingAppointment.setTime(appointmentDTO.getTime());

            existingAppointment.setStatus(AppointmentStatus.RESCHEDULED);


            Appointment updatedAppointment = appointmentRepository.save(existingAppointment);


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
    public List<LocalTime> findFirstAvailableSlots(Long doctorId) {
        // Define your working hours
        LocalTime startTime = LocalTime.of(9, 0); // Start time
        LocalTime endTime = LocalTime.of(17, 0); // End time

        LocalDate today = LocalDate.now();
        LocalDate currentDate = today;

        while (true) {
            // Fetch booked slots for the current date
            List<LocalTime> bookedSlots = appointmentRepository.findBookedSlotsByDoctorAndDate(doctorId, currentDate);

            // Initialize a list for available time slots
            List<LocalTime> availableSlots = new ArrayList<>();

            // Fill the availableSlots list with times from startTime to endTime
            for (LocalTime time = startTime; time.isBefore(endTime); time = time.plusHours(1)) {
                // If the time slot is not booked, add it to available slots
                if (!bookedSlots.contains(time)) {
                    availableSlots.add(time);
                }
            }

            // If we found available slots, return them
            if (!availableSlots.isEmpty()) {
                return availableSlots;
            }

            // Move to the next date
            currentDate = currentDate.plusDays(1);
        }
    }



    @Override
    public Map<LocalDate, List<LocalTime>> findAvailableSlotsFromDate(Long doctorId, LocalDate startDate, int daysToCheck) {
        Map<LocalDate, List<LocalTime>> availableSlots = new LinkedHashMap<>();
        LocalTime startTime = LocalTime.of(9, 0);
        LocalTime endTime = LocalTime.of(17, 0);
        Duration slotDuration = Duration.ofMinutes(30);

        for (int i = 0; i < daysToCheck; i++) {
            LocalDate currentDate = startDate.plusDays(i);

            if (currentDate.getDayOfWeek() == DayOfWeek.SATURDAY || currentDate.getDayOfWeek() == DayOfWeek.SUNDAY) {
                continue; // Skip weekends
            }

            // Convert LocalDate to java.util.Date for the repository method
            Date sqlDate = java.sql.Date.valueOf(currentDate);
            List<Time> bookedSlots = appointmentRepository.findBookedSlotsByDoctorAndDate(doctorId, sqlDate);

//            // Log the booked slots retrieved from the database
//            System.out.println("Booked slots for " + currentDate + ": " + bookedSlots);

            List<LocalTime> availableSlotsForDay = new ArrayList<>();

            // Generate available slots within working hours
            for (LocalTime time = startTime; !time.isAfter(endTime.minus(slotDuration)); time = time.plus(slotDuration)) {
                Time sqlTime = Time.valueOf(time);

                // Convert booked slots to LocalTime for comparison
                List<LocalTime> bookedLocalTimes = bookedSlots.stream()
                        .map(Time::toLocalTime)
                        .collect(Collectors.toList());

//                // Log the current time being checked against booked slots
//                System.out.println("Checking availability for time: " + time + ", Booked times: " + bookedLocalTimes);

                // Check if the current time is not booked
                if (!bookedLocalTimes.contains(time)) {
                    availableSlotsForDay.add(time);
                }
            }

//            // Log available slots for the day
//            System.out.println("Available slots for " + currentDate + ": " + availableSlotsForDay);

            if (!availableSlotsForDay.isEmpty()) {
                availableSlots.put(currentDate, availableSlotsForDay);
            }
        }

        return availableSlots;
    }

    public List<Time> checkAvailability(Long doctorId, LocalDate date) {
        List<Time> bookedTimes = appointmentRepository.findBookedTimes(doctorId, date);
        List<Time> availableSlots = generateSlots( doctorId,  date); // Assuming you have a method to generate the slots

        // Filter out booked times from available slots
        availableSlots.removeAll(bookedTimes);

        return availableSlots;
    }

    public List<Time> generateSlots(Long doctorId, LocalDate date) {
        List<Time> bookedTimes = appointmentRepository.findBookedTimes(doctorId, date);
        List<Time> availableSlots = new ArrayList<>();

        // Define your working hours, for example, 9 AM to 5 PM
        Time startTime = Time.valueOf("09:00:00");
        Time endTime = Time.valueOf("17:00:00");
        long slotDurationInMinutes = 30; // Slot duration

        // Generate slots for the working hours
        for (Time time = startTime; time.before(endTime); time = new Time(time.getTime() + slotDurationInMinutes * 60 * 1000)) {
            if (!bookedTimes.contains(time)) {
                availableSlots.add(time);
            }
        }
        return availableSlots;
    }



}






