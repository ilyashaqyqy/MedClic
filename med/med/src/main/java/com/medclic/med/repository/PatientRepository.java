package com.medclic.med.repository;

import com.medclic.med.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findById(Long id);
    Optional<Patient> findByEmail(String email);



    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.patient.id = :patientId")
    Long countAppointmentsByPatientId(@Param("patientId") Long patientId);


}
