package com.edu.backend.services;

import com.edu.backend.models.Users;
import com.edu.backend.payload.LoginRequest;
import com.edu.backend.payload.SignUpRequest;
import com.edu.backend.repositories.UserRepository;
import com.edu.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;


@Service
public class AuthService {
    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private UserRepository repo;
    @Autowired
    private AuthenticationManager authManager;
    @Autowired
    private JwtUtil jwtUtil;



    public String signup(SignUpRequest req) {
        Users user = new Users();
        user.setName(req.name);
        user.setUsername(req.username);
        user.setEmail(req.email);
        user.setPassword(encoder.encode(req.password));
        user.setRole(req.role);

        repo.save(user);
        return "Hey "+req.name+"! You have successfully Registered";
    }

    public String login(LoginRequest req) {

        System.out.println("Trying login for: " + req.email);

        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.email, req.password)
            );
            System.out.println("Authentication success");
        } catch (Exception e) {
            System.out.println("Authentication failed");
            e.printStackTrace();
            throw e;
        }

        return jwtUtil.generateToken(req.email);
    }


}
