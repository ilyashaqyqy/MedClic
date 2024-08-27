package com.medclic.med.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.Date;


@Getter
@Setter
public class PatientDTO extends UserDTO {
    private String medicalHistory;
    private Date dateOfBirth;
    private String insuranceInfo;
    private String address;

}
