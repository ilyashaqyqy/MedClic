package com.medclic.med.controller;



import com.medclic.med.dto.LocationDTO;
import com.medclic.med.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @GetMapping("/{id}")
    public ResponseEntity<LocationDTO> getLocationById(@PathVariable Long id) {
        LocationDTO locationDTO = locationService.getLocationById(id);
        return new ResponseEntity<>(locationDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<LocationDTO> createLocation(@RequestBody LocationDTO locationDTO) {
        LocationDTO createdLocation = locationService.createLocation(locationDTO);
        return new ResponseEntity<>(createdLocation, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LocationDTO> updateLocation(@PathVariable Long id, @RequestBody LocationDTO locationDTO) {
        locationDTO.setId(id);
        LocationDTO updatedLocation = locationService.updateLocation(locationDTO);
        return new ResponseEntity<>(updatedLocation, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {
        locationService.deleteLocation(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public ResponseEntity<List<LocationDTO>> getAllLocations() {
        List<LocationDTO> locations = locationService.getAllLocations();
        return new ResponseEntity<>(locations, HttpStatus.OK);
    }
}
