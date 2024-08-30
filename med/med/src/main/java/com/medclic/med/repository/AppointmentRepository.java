package com.medclic.med.repository;

import com.medclic.med.model.Appointment;
import com.medclic.med.model.Doctor;
import com.medclic.med.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient(Patient patient);
    List<Appointment> findByDoctor(Doctor doctor);
    List<Appointment> findByStatus(String status);
}

