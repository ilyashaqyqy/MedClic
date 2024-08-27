package com.medclic.med.dto;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MessageDTO {
    private Long id;
    private String content;
    private LocalDateTime timestamp;
    private Boolean isRead;
    private Long senderId;
    private Long receiverId;


}

