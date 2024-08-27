package com.medclic.med.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class ReminderDTO {
    private Long id;
    private Date reminderTime;
    private Long appointmentId;


}

