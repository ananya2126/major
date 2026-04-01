package com.edu.backend.repositories;

import com.edu.backend.models.Posts;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Posts,Long> {
    List<Posts> findAllByUid(Long uid);
    boolean existsByIdAndUid(Long id, Long uid);

}
