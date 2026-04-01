package com.edu.backend.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateProfileRequest {
    public String name;
    private String email;
    public String education;
    private String role;
    public Long mobile;
    public double ssc;
    public double inter;
    public String stream;
}

