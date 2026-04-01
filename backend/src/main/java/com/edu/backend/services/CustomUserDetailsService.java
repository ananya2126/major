package com.edu.backend.services;

import com.edu.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;



@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository repo;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        var user = repo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return User.withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole())
                .build();
    }
}

