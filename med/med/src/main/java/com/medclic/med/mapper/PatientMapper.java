package com.medclic.med.mapper;

import com.medclic.med.dto.PatientDTO;
import com.medclic.med.model.Patient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface PatientMapper {

    @Mapping(target = "appointments", ignore = true)
    @Mapping(target = "password", source = "password") /////////////////
    PatientDTO toDTO(Patient patient);

    @Mapping(target = "appointments", ignore = true)
    @Mapping(target = "password", source = "password") /////////////////
    Patient toEntity(PatientDTO patientDTO);
}