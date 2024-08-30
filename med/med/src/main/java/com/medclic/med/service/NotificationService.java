package com.medclic.med.service;

import com.medclic.med.dto.NotificationDTO;

import java.util.List;

public interface NotificationService {
    void sendNotification(NotificationDTO notificationDTO);
    List<NotificationDTO> getNotificationsByUserId(Long userId);
}

