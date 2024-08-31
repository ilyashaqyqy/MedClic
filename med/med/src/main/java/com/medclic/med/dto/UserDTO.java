package com.medclic.med.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String role;
    private Set<NotificationDTO> notifications;
    private Set<MessageDTO> sentMessages;
    private Set<MessageDTO> receivedMessages;


}

