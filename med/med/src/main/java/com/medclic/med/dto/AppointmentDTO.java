package com.medclic.med.dto;


import lombok.Getter;
import lombok.Setter;

import java.sql.Time;
import java.util.Date;

@Getter
@Setter
public class AppointmentDTO {
    private Long id;
    private Long patientId;
    private Long doctorId;
    private Date date;
    private Time time;
    private String status;
    private String notes;
    private String appointmentType;
    private String appointmentReason;


}
