package com.medclic.med.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
@Embeddable
public class TimeSlot {

    private LocalTime startTime;
    private LocalTime endTime;


}

