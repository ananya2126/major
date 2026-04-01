package com.edu.backend.controllers;

import com.edu.backend.models.Users;
import com.edu.backend.payload.LoginRequest;
import com.edu.backend.repositories.UserRepository;
import com.edu.backend.services.AuthService;
import com.edu.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.edu.backend.payload.SignUpRequest;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;



    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignUpRequest req) {
        return ResponseEntity.ok(authService.signup(req));
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest req) {
        System.out.println("Login hited"+req.email);
        String token = authService.login(req);

        return Map.of("token", token);
    }


}
