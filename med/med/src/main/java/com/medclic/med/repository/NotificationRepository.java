package com.medclic.med.repository;

import com.medclic.med.model.Notification;
import com.medclic.med.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUser(User user);
}

