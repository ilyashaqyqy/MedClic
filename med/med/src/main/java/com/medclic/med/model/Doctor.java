package com.medclic.med.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Setter
@Getter
@Entity
public class Doctor extends User {

    private String specialization;

    private int yearsOfExperience;

    private double consultationFee;

    private String profilePhoto;

    private String bio;

    private String education;

    private String certifications;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Appointment> appointments;

    @ManyToMany
    @JoinTable(
            name = "doctor_specialization",
            joinColumns = @JoinColumn(name = "doctor_id"),
            inverseJoinColumns = @JoinColumn(name = "specialization_id")
    )
    private Set<Specialization> specializations;

}

