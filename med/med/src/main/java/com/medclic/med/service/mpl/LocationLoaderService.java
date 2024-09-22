package com.medclic.med.service.mpl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medclic.med.model.Location;
import com.medclic.med.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class LocationLoaderService {

    @Autowired
    private LocationRepository locationRepository;

    @PostConstruct
    public void loadLocationsFromJson() {
        try {
            // Load the JSON file from resources
            InputStream inputStream = new ClassPathResource("locations.json").getInputStream();

            // Use ObjectMapper to convert JSON data to a list of Location objects
            ObjectMapper objectMapper = new ObjectMapper();
            List<Location> locations = objectMapper.readValue(inputStream, new TypeReference<List<Location>>() {});

            // Save all locations to the database
            locationRepository.saveAll(locations);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

