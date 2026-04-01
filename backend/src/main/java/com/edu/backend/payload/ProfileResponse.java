package com.edu.backend.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProfileResponse {

    private String name;
    private String email;
    private String education;
    private String role;
    private Long mobile;
    private double ssc;
    private double inter;
    private String stream;
}
