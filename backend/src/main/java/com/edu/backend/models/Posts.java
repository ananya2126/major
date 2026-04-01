package com.edu.backend.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Posts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long uid;
    private String username;
    private String content;
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Comments> comments = new ArrayList<>();
    @Column(columnDefinition = "TEXT")
    private String aiReply;
    private boolean mentions;
    private LocalDateTime postedAt=LocalDateTime.now();

    public Posts() {
    }

    public Posts(Long id, Long uid, String username, String content, List<Comments> comments, String aiReply, boolean mentions, LocalDateTime postedAt) {
        this.id = id;
        this.uid = uid;
        this.username = username;
        this.content = content;
        this.comments = comments;
        this.aiReply = aiReply;
        this.mentions = mentions;
        this.postedAt = postedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUid() {
        return uid;
    }

    public void setUid(Long uid) {
        this.uid = uid;
    }

    public String getAiReply() {
        return aiReply;
    }

    public void setAiReply(String aiReply) {
        this.aiReply = aiReply;
    }

    public boolean getMentions() {
        return mentions;
    }

    public void setMentions(boolean mentions) {
        this.mentions = mentions;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<Comments> getComments() {
        return comments;
    }

    public void setComments(List<Comments> comments) {
        this.comments = comments;
    }

    public LocalDateTime getPostedAt() {
        return postedAt;
    }

    public void setPostedAt(LocalDateTime postedAt) {
        this.postedAt = LocalDateTime.now();
    }
}
