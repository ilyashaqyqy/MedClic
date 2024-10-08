package com.medclic.med.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class DoctorDTO extends UserDTO {
    private String specialization;
    private int yearsOfExperience;
    private double consultationFee;
    private String profilePhoto;
    private String bio;
    private String education;
    private String certifications;
    private Set<AppointmentDTO> appointments;
    private LocationDTO location;
    private Set<SpecializationDTO> specializations;


}
