package com.medclic.med.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class SpecializationDTO {
    private Long id;
    private String name;
    private Set<DoctorDTO> doctors;

}

