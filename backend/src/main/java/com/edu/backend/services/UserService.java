package com.edu.backend.services;

import com.edu.backend.models.Users;
import com.edu.backend.payload.UpdateProfileRequest;
import com.edu.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;
    @Autowired
    private PasswordEncoder encoder;
    public Users updateProfile(String email, UpdateProfileRequest req) {

        Users user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (req.name != null) user.setName(req.name);
        if (req.education != null) user.setEducation(req.education);
        if (req.stream != null) user.setStream(req.stream);

        if (req.mobile != null) user.setMobile(req.mobile);

        if (req.ssc > 0) user.setSsc(req.ssc);
        if (req.inter > 0) user.setInter(req.inter);

        return repo.save(user);
    }
    public Users getProfile(String email){
        Users user = repo.findByEmail(email).orElseThrow(()->new RuntimeException("User not found:profile"));
        return user;
    }
}
