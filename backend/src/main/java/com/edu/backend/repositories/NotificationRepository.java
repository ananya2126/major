package com.edu.backend.repositories;

import com.edu.backend.models.Notifications;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notifications,Long> {
    List<Notifications> findAllByRecieverid(Long recieverid);
}
