package com.medclic.med.service;

import com.medclic.med.dto.DoctorDTO;

import java.util.List;

public interface DoctorService {
    DoctorDTO getDoctorById(Long doctorId);
    DoctorDTO createDoctor(DoctorDTO doctorDTO);
    DoctorDTO updateDoctor(DoctorDTO doctorDTO);
    void deleteDoctor(Long doctorId);
    List<DoctorDTO> getAllDoctors();


    Long getPatientCountForDoctor(Long doctorId);
    Long getAppointmentCountForDoctor(Long doctorId);
}

