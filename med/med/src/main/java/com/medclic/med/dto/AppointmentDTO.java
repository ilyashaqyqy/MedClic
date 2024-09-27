package com.medclic.med.dto;


import com.medclic.med.model.AppointmentStatus;
import lombok.Getter;
import lombok.Setter;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;

@Getter
@Setter
public class AppointmentDTO {
    private Long id;
    private Long patientId;
    private Long doctorId;
    private Date date;
    private Time time;
    private AppointmentStatus status;
    private String notes;
    private String appointmentType;
    private String appointmentReason;
    private LocalDate bookingDate;
    private LocalTime bookingTime;

}
