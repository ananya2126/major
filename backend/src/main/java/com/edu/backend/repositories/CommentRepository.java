package com.edu.backend.repositories;

import com.edu.backend.models.Comments;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comments, Long> {
    List<Comments> findByPostId(Long postId);
}

