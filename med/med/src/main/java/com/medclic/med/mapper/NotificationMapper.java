package com.medclic.med.mapper;

import com.medclic.med.dto.NotificationDTO;
import com.medclic.med.model.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface NotificationMapper {

    @Mapping(source = "user.id", target = "userId")
    NotificationDTO toDTO(Notification notification);

    @Mapping(source = "userId", target = "user.id")
    Notification toEntity(NotificationDTO notificationDTO);
}