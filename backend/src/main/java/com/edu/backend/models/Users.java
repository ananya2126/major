package com.edu.backend.models;

import jakarta.persistence.*;

@Entity
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique = true)
    private String username;
    private String password;
    private String education;
    private String role;
    @Column(unique = true)
    private Long mobile;
    @Column(unique = true)
    private String email;
    private double ssc;
    private double inter;
    private String stream;

    public Users() {
    }

    public Users(Long id, String name,String username, String password, String education, String role, Long mobile, String email, double ssc, double inter, String stream) {
        this.id = id;
        this.name = name;
        this.username=username;
        this.password = password;
        this.education = education;
        this.role = role;
        this.mobile = mobile;
        this.email = email;
        this.ssc = ssc;
        this.inter = inter;
        this.stream = stream;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getMobile() {
        return mobile;
    }

    public void setMobile(Long mobile) {
        this.mobile = mobile;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public double getSsc() {
        return ssc;
    }

    public void setSsc(double ssc) {
        this.ssc = ssc;
    }

    public double getInter() {
        return inter;
    }

    public void setInter(double inter) {
        this.inter = inter;
    }

    public String getStream() {
        return stream;
    }

    public void setStream(String stream) {
        this.stream = stream;
    }
}
