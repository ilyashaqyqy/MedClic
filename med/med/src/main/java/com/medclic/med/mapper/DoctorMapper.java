package com.medclic.med.mapper;

import com.medclic.med.dto.DoctorDTO;
import com.medclic.med.model.Doctor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class, LocationMapper.class, SpecializationMapper.class})
public interface DoctorMapper {

    @Mapping(target = "appointments", ignore = true)
    @Mapping(target = "password", source = "password")
    @Mapping(target = "location", source = "location")
    @Mapping(target = "specializations", source = "specializations")
    DoctorDTO toDTO(Doctor doctor);

    @Mapping(target = "appointments", ignore = true)
    @Mapping(target = "password", source = "password") //////
    @Mapping(target = "location", source = "location") /////
    @Mapping(target = "specializations", source = "specializations") /////
    Doctor toEntity(DoctorDTO doctorDTO);
}