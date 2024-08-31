package com.medclic.med.service.mpl;

import com.medclic.med.dto.NotificationDTO;
import com.medclic.med.mapper.NotificationMapper;
import com.medclic.med.model.Notification;
import com.medclic.med.repository.NotificationRepository;
import com.medclic.med.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationMapper notificationMapper;

    @Override
    public void sendNotification(NotificationDTO notificationDTO) {
        Notification notification = notificationMapper.toEntity(notificationDTO);
        notificationRepository.save(notification);
        // Implement sending logic (e.g., email or SMS)
    }

    @Override
    public List<NotificationDTO> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserId(userId).stream()
                .map(notificationMapper::toDTO)
                .collect(Collectors.toList());
    }
}

