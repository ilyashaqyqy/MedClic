package com.medclic.med.controller;



import com.medclic.med.dto.PatientDTO;

import com.medclic.med.service.PatientService;
import com.medclic.med.service.mpl.PatientServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;
    @Autowired
    private PatientServiceImpl patientServiceImpl;

    @GetMapping("/{id}")
    public ResponseEntity<PatientDTO> getPatientById(@PathVariable Long id) {
        PatientDTO patientDTO = patientService.getPatientById(id);
        return new ResponseEntity<>(patientDTO, HttpStatus.OK);
    }


    @PreAuthorize("hasAuthority('PATIENT') or hasAuthority('PATIENT')")
    @PostMapping
    public ResponseEntity<PatientDTO> createPatient(@RequestBody PatientDTO patientDTO) {
        PatientDTO createdPatient = patientService.createPatient(patientDTO);
        return new ResponseEntity<>(createdPatient, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('PATIENT')")
    @PutMapping("/{id}")
    public ResponseEntity<PatientDTO> updatePatient(@PathVariable Long id, @RequestBody PatientDTO patientDTO) {
        patientDTO.setId(id);
        PatientDTO updatedPatient = patientService.updatePatient(patientDTO);
        return new ResponseEntity<>(updatedPatient, HttpStatus.OK);
    }


    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public ResponseEntity<List<PatientDTO>> getAllPatients() {
        List<PatientDTO> patients = patientService.getAllPatients();
        return new ResponseEntity<>(patients, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/count")
    public ResponseEntity<Long> getPatientCount() {
        long count = patientServiceImpl.countPtient();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }



    @GetMapping("/email/{email}/id")
    public ResponseEntity<Long> getPatientIdByEmail(@PathVariable String email) {
        Long patientId = patientService.findPatientIdByEmail(email);
        if (patientId != null) {
            return ResponseEntity.ok(patientId);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/appointment-count")
    public Long getAppointmentCount(@PathVariable Long id) {
        return patientService.countAppointmentsForPatient(id);
    }

}

