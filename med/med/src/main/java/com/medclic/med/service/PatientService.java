package com.medclic.med.service;

import com.medclic.med.dto.PatientDTO;

import java.util.List;

public interface PatientService {
    PatientDTO getPatientById(Long patientId);
    PatientDTO createPatient(PatientDTO patientDTO);
    PatientDTO updatePatient(PatientDTO patientDTO);
    void deletePatient(Long patientId);
    List<PatientDTO> getAllPatients();
    Long findPatientIdByEmail(String email);

}

