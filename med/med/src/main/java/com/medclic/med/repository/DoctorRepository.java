package com.medclic.med.repository;

import com.medclic.med.model.Doctor;
import com.medclic.med.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecialization(String specialization);
    List<Doctor> findByLocation(Location location);
}

