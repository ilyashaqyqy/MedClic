package com.medclic.med.mapper;

import com.medclic.med.dto.SpecializationDTO;
import com.medclic.med.model.Specialization;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SpecializationMapper {
    @Mapping(source = "name", target = "name")
    SpecializationDTO toDTO(Specialization specialization);

    @Mapping(source = "name", target = "name")
    Specialization toEntity(SpecializationDTO specializationDTO);
}
