package com.medclic.med.service.mpl;

import com.medclic.med.dto.LocationDTO;
import com.medclic.med.exception.LocationNotFoundException;
import com.medclic.med.mapper.LocationMapper;
import com.medclic.med.model.Location;
import com.medclic.med.repository.LocationRepository;
import com.medclic.med.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationServiceImpl implements LocationService {
    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private LocationMapper locationMapper;

    @Override
    public LocationDTO getLocationById(Long locationId) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new LocationNotFoundException("Location not found"));
        return locationMapper.toDTO(location);
    }

    @Override
    public LocationDTO createLocation(LocationDTO locationDTO) {
        Location location = locationMapper.toEntity(locationDTO);
        Location savedLocation = locationRepository.save(location);
        return locationMapper.toDTO(savedLocation);
    }

    @Override
    public LocationDTO updateLocation(LocationDTO locationDTO) {
        Location location = locationMapper.toEntity(locationDTO);
        Location updatedLocation = locationRepository.save(location);
        return locationMapper.toDTO(updatedLocation);
    }

    @Override
    public void deleteLocation(Long locationId) {
        locationRepository.deleteById(locationId);
    }

    @Override
    public List<LocationDTO> getAllLocations() {
        return locationRepository.findAll().stream()
                .map(locationMapper::toDTO)
                .collect(Collectors.toList());
    }
}

