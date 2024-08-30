package com.medclic.med.mapper;

import com.medclic.med.dto.SpecializationDTO;
import com.medclic.med.model.Specialization;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SpecializationMapper {

    @Mapping(target = "doctors", ignore = true)
    SpecializationDTO toDTO(Specialization specialization);

    @Mapping(target = "doctors", ignore = true)
    Specialization toEntity(SpecializationDTO specializationDTO);
}