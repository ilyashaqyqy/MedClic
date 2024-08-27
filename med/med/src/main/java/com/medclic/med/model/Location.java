package com.medclic.med.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;


@Getter
@Setter
@Entity
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String address;

    @OneToMany(mappedBy = "location", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Doctor> doctors;


}

