package com.medclic.med.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;


@Getter
@Setter
@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    private Date timestamp;

    private Boolean isRead;

    private String type;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


}
