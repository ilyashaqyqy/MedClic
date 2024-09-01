package com.medclic.med.repository;

import com.medclic.med.model.Doctor;
import com.medclic.med.model.Location;
import com.medclic.med.model.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecializationsContaining(Specialization specialization);
    List<Doctor> findByLocation(Location location);
}

