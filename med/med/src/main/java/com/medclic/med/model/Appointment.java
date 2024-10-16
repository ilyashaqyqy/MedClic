package com.medclic.med.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.Set;


@Getter
@Setter
@Entity
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private Date date; //sheduele date
    private Time time; //sheduele time

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    private String notes;

    private String appointmentType;

    private String appointmentReason;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @Column(name = "booking_date")
    private LocalDate bookingDate;
    @Column(name = "booking_time")
    private LocalTime bookingTime;

    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Reminder> reminders;



}