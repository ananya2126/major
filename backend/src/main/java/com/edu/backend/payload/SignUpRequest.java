package com.edu.backend.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SignUpRequest {
    public String name;
    public String username;
    public String email;
    public String password;
    public String role;
}
