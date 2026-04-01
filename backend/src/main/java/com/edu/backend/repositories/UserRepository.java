package com.edu.backend.repositories;


import java.util.Optional;

import com.edu.backend.models.Users;
import org.springframework.data.jpa.repository.JpaRepository;



public interface UserRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByEmail(String email);
}

