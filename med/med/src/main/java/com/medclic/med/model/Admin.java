package com.medclic.med.model;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.Entity;

@Setter
@Getter
@Entity
public class Admin extends User {

    private String accessLevel;

}

