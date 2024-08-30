package com.medclic.med.service;

import com.medclic.med.dto.SpecializationDTO;

import java.util.List;

public interface SpecializationService {
    SpecializationDTO getSpecializationById(Long specializationId);
    SpecializationDTO createSpecialization(SpecializationDTO specializationDTO);
    SpecializationDTO updateSpecialization(SpecializationDTO specializationDTO);
    void deleteSpecialization(Long specializationId);
    List<SpecializationDTO> getAllSpecializations();
}

