package com.medclic.med.mapper;

import com.medclic.med.dto.DoctorDTO;
import com.medclic.med.model.Doctor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface DoctorMapper {
    @Mapping(target = "appointments", ignore = true)
    DoctorDTO toDTO(Doctor doctor);

    @Mapping(target = "appointments", ignore = true)
    Doctor toEntity(DoctorDTO doctorDTO);
}