package com.medclic.med.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;
import java.util.Date;
import java.util.List;


@Getter
@Setter
@Entity
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    private Map<Date, TimeSlot> availability;



    public void addAvailability(Date date, TimeSlot timeSlot) {
        // Implementation here
    }

    public void removeAvailability(Date date, TimeSlot timeSlot) {
        // Implementation here
    }
}
