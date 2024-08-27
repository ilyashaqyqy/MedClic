package com.medclic.med.mapper;

import com.medclic.med.dto.NotificationDTO;
import com.medclic.med.model.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    @Mapping(source = "message", target = "message")
    NotificationDTO toDTO(Notification notification);

    @Mapping(source = "message", target = "message")
    Notification toEntity(NotificationDTO notificationDTO);
}
