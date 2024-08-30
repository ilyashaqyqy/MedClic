package com.medclic.med.service;

import com.medclic.med.dto.LocationDTO;

import java.util.List;

public interface LocationService {
    LocationDTO getLocationById(Long locationId);
    LocationDTO createLocation(LocationDTO locationDTO);
    LocationDTO updateLocation(LocationDTO locationDTO);
    void deleteLocation(Long locationId);
    List<LocationDTO> getAllLocations();
}

