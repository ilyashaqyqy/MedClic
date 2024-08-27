package com.medclic.med.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;


@Getter
@Setter
@Entity
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date reminderTime;

    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;


}

