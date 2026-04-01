package com.edu.backend.services;

import com.edu.backend.models.Comments;
import com.edu.backend.models.Notifications;
import com.edu.backend.models.Posts;
import com.edu.backend.models.Users;
import com.edu.backend.repositories.CommentRepository;
import com.edu.backend.repositories.NotificationRepository;
import com.edu.backend.repositories.PostRepository;
import com.edu.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private CommentRepository commentRepository;

    public List<Notifications> viewNotifications(String email){
        Users user = userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User Not Found:view notification"));
        return notificationRepository.findAllByRecieverid(user.getId());
    }
    public Comments viewComment(Long id,String email){
        Comments comment = commentRepository.findById(id).orElseThrow(()->new RuntimeException("Commment not found:view comment"));
        Users users = userRepository.findById(comment.getPost().getUid()).orElseThrow(()->new RuntimeException("User not found:view commment"));
        if(users.getEmail().equalsIgnoreCase(email)){
            return comment;
        }
        return new Comments();
    }
}
