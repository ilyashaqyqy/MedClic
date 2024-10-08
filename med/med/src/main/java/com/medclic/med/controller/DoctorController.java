package com.medclic.med.controller;


import com.medclic.med.dto.DoctorDTO;

import com.medclic.med.service.DoctorService;
import com.medclic.med.service.mpl.DoctorServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;
    @Autowired
    private DoctorServiceImpl doctorServiceImpl;

    @GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long id) {
        DoctorDTO doctorDTO = doctorService.getDoctorById(id);
        return new ResponseEntity<>(doctorDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<DoctorDTO> createDoctor(@RequestBody DoctorDTO doctorDTO) {
        DoctorDTO createdDoctor = doctorService.createDoctor(doctorDTO);
        return new ResponseEntity<>(createdDoctor, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DoctorDTO> updateDoctor(@PathVariable Long id, @RequestBody DoctorDTO doctorDTO) {
        doctorDTO.setId(id);
        DoctorDTO updatedDoctor = doctorService.updateDoctor(doctorDTO);
        return new ResponseEntity<>(updatedDoctor, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        List<DoctorDTO> doctors = doctorService.getAllDoctors();
        return new ResponseEntity<>(doctors, HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getDoctorCount() {
        long count = doctorServiceImpl.countDoctors();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/{doctorId}/patient-count")
    public ResponseEntity<Long> getPatientCount(@PathVariable Long doctorId) {
        Long patientCount = doctorService.getPatientCountForDoctor(doctorId);
        return ResponseEntity.ok(patientCount);
    }

}

