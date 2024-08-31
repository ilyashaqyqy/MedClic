package com.medclic.med.controller;



import com.medclic.med.dto.SpecializationDTO;
import com.medclic.med.service.SpecializationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/specializations")
public class SpecializationController {

    @Autowired
    private SpecializationService specializationService;

    @GetMapping("/{id}")
    public ResponseEntity<SpecializationDTO> getSpecializationById(@PathVariable Long id) {
        SpecializationDTO specializationDTO = specializationService.getSpecializationById(id);
        return new ResponseEntity<>(specializationDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<SpecializationDTO> createSpecialization(@RequestBody SpecializationDTO specializationDTO) {
        SpecializationDTO createdSpecialization = specializationService.createSpecialization(specializationDTO);
        return new ResponseEntity<>(createdSpecialization, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SpecializationDTO> updateSpecialization(@PathVariable Long id, @RequestBody SpecializationDTO specializationDTO) {
        specializationDTO.setId(id);
        SpecializationDTO updatedSpecialization = specializationService.updateSpecialization(specializationDTO);
        return new ResponseEntity<>(updatedSpecialization, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpecialization(@PathVariable Long id) {
        specializationService.deleteSpecialization(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public ResponseEntity<List<SpecializationDTO>> getAllSpecializations() {
        List<SpecializationDTO> specializations = specializationService.getAllSpecializations();
        return new ResponseEntity<>(specializations, HttpStatus.OK);
    }
}

