package com.medclic.med.service.mpl;

import com.medclic.med.dto.SpecializationDTO;
import com.medclic.med.exception.SpecializationNotFoundException;
import com.medclic.med.mapper.SpecializationMapper;
import com.medclic.med.model.Specialization;
import com.medclic.med.repository.SpecializationRepository;
import com.medclic.med.service.SpecializationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SpecializationServiceImpl implements SpecializationService {
    @Autowired
    private SpecializationRepository specializationRepository;

    @Autowired
    private SpecializationMapper specializationMapper;

    @Override
    public SpecializationDTO getSpecializationById(Long specializationId) {
        Specialization specialization = specializationRepository.findById(specializationId)
                .orElseThrow(() -> new SpecializationNotFoundException("Specialization not found"));
        return specializationMapper.toDTO(specialization);
    }

    @Override
    public SpecializationDTO createSpecialization(SpecializationDTO specializationDTO) {
        Specialization specialization = specializationMapper.toEntity(specializationDTO);
        Specialization savedSpecialization = specializationRepository.save(specialization);
        return specializationMapper.toDTO(savedSpecialization);
    }

    @Override
    public SpecializationDTO updateSpecialization(SpecializationDTO specializationDTO) {
        Specialization specialization = specializationMapper.toEntity(specializationDTO);
        Specialization updatedSpecialization = specializationRepository.save(specialization);
        return specializationMapper.toDTO(updatedSpecialization);
    }

    @Override
    public void deleteSpecialization(Long specializationId) {
        specializationRepository.deleteById(specializationId);
    }

    @Override
    public List<SpecializationDTO> getAllSpecializations() {
        return specializationRepository.findAll().stream()
                .map(specializationMapper::toDTO)
                .collect(Collectors.toList());
    }
}

