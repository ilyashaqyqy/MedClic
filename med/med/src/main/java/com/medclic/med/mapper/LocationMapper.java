package com.medclic.med.mapper;

import com.medclic.med.dto.LocationDTO;
import com.medclic.med.model.Location;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LocationMapper {

    @Mapping(target = "doctors", ignore = true)
    LocationDTO toDTO(Location location);

    @Mapping(target = "doctors", ignore = true)
    Location toEntity(LocationDTO locationDTO);
}