package com.medclic.med.repository;

import com.medclic.med.model.Patient;
import com.medclic.med.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findById(Long id);
    Optional<Patient> findByEmail(String email);
}
