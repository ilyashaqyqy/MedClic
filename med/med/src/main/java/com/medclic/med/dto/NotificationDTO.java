package com.medclic.med.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class NotificationDTO {
    private Long id;
    private String message;
    private Date timestamp;
    private Boolean isRead;
    private String type;
    private Long userId;

}
