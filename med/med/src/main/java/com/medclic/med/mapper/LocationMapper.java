package com.medclic.med.mapper;

import com.medclic.med.dto.LocationDTO;
import com.medclic.med.model.Location;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LocationMapper {
    @Mapping(source = "address", target = "address")
    LocationDTO toDTO(Location location);

    @Mapping(source = "address", target = "address")
    Location toEntity(LocationDTO locationDTO);
}
