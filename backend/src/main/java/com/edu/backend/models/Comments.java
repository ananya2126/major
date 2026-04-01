package com.edu.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Comments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private Long uid;
    @ManyToOne
    @JoinColumn(name = "post_id")
    @JsonBackReference
    private Posts post;
    private String message;
    private LocalDateTime postedAt=LocalDateTime.now();

    public Comments() {
    }

    public Comments(Long id, String username, Long uid, Posts post, String message, LocalDateTime postedAt) {
        this.id = id;
        this.username = username;
        this.uid = uid;
        this.post = post;
        this.message = message;
        this.postedAt = postedAt;
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

    public Posts getPost() {
        return post;
    }

    public void setPost(Posts post) {
        this.post = post;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getUid() {
        return uid;
    }

    public void setUid(Long uid) {
        this.uid = uid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getPostedAt() {
        return postedAt;
    }

    public void setPostedAt(LocalDateTime postedAt) {
        this.postedAt = LocalDateTime.now();
    }
}

