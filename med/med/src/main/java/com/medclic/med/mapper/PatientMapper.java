package com.medclic.med.mapper;

import com.medclic.med.dto.PatientDTO;
import com.medclic.med.model.Patient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PatientMapper {
    @Mapping(source = "address", target = "address")
    PatientDTO toDTO(Patient patient);

    @Mapping(source = "address", target = "address")
    Patient toEntity(PatientDTO patientDTO);
}
