package com.medclic.med.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class LocationDTO {
    private Long id;
    private String name;
    private String address;
    private Set<DoctorDTO> doctors;

}
