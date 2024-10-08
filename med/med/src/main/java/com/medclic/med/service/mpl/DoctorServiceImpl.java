package com.medclic.med.service.mpl;

import com.medclic.med.dto.DoctorDTO;
import com.medclic.med.exception.DoctorNotFoundException;
import com.medclic.med.mapper.DoctorMapper;
import com.medclic.med.model.Doctor;
import com.medclic.med.model.Role;
import com.medclic.med.repository.AppointmentRepository;
import com.medclic.med.repository.DoctorRepository;
import com.medclic.med.repository.PatientRepository;
import com.medclic.med.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {
    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorMapper doctorMapper;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;



    @Override
    public DoctorDTO getDoctorById(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new DoctorNotFoundException("Doctor not found"));
        return doctorMapper.toDTO(doctor);
    }

    @Override
    public DoctorDTO createDoctor(DoctorDTO doctorDTO) {
        doctorDTO.setRole(Role.DOCTOR); // Set the role explicitly
        Doctor doctor = doctorMapper.toEntity(doctorDTO);
        Doctor savedDoctor = doctorRepository.save(doctor);
        return doctorMapper.toDTO(savedDoctor);
    }

    @Override
    public DoctorDTO updateDoctor(DoctorDTO doctorDTO) {
        if (!doctorRepository.existsById(doctorDTO.getId())) {
            throw new DoctorNotFoundException("Doctor not found");
        }
        doctorDTO.setRole(Role.DOCTOR); // Ensure the role is set correctly
        Doctor doctor = doctorMapper.toEntity(doctorDTO);
        Doctor updatedDoctor = doctorRepository.save(doctor);
        return doctorMapper.toDTO(updatedDoctor);
    }

    @Override
    public void deleteDoctor(Long doctorId) {
        doctorRepository.deleteById(doctorId);
    }

    @Override
    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(doctorMapper::toDTO)
                .collect(Collectors.toList());
    }

    public long countDoctors() {
        return doctorRepository.count();
    }


    @Override
    public Long getPatientCountForDoctor(Long doctorId) {
        return appointmentRepository.countDistinctPatientsByDoctorId(doctorId);
    }

    @Override
    public Long getAppointmentCountForDoctor(Long doctorId) {

        if (!doctorRepository.existsById(doctorId)) {
            throw new DoctorNotFoundException("Doctor not found with ID: " + doctorId);
        }
        return appointmentRepository.countByDoctorId(doctorId);
    }

}

