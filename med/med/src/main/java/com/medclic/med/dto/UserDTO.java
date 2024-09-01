package com.medclic.med.dto;

import com.medclic.med.model.Role;
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
    private Role role;
    private String password;
    private Set<NotificationDTO> notifications;
    private Set<MessageDTO> sentMessages;
    private Set<MessageDTO> receivedMessages;


}

