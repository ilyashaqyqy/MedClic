package com.medclic.med.mapper;

import com.medclic.med.dto.DoctorDTO;
import com.medclic.med.model.Doctor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DoctorMapper {
    @Mapping(source = "specialty", target = "specialty")
    @Mapping(source = "location", target = "location")
    DoctorDTO toDTO(Doctor doctor);

    @Mapping(source = "specialty", target = "specialty")
    @Mapping(source = "location", target = "location")
    Doctor toEntity(DoctorDTO doctorDTO);
}

