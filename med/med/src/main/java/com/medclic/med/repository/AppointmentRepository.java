package com.medclic.med.repository;

import com.medclic.med.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByStatus(Appointment status);

    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId AND a.status = :status")
    List<Appointment> findByPatientIdAndStatus(@Param("patientId") Long patientId, @Param("status") Appointment status);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.date BETWEEN :startDate AND :endDate")
    List<Appointment> findByDoctorIdAndDateBetween(@Param("doctorId") Long doctorId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);



    Appointment findTopByDoctorIdAndDateOrderByTimeDesc(Long doctorId, java.sql.Date date);

    List<Appointment> findByDoctorIdAndDate(Long doctorId, java.sql.Date appointmentDate);

}