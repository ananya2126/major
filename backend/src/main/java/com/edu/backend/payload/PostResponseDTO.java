package com.edu.backend.payload;

import com.edu.backend.models.Comments;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class PostResponseDTO {

    private Long id;
    private String username;
    private String content;
    private LocalDateTime postedAt;
    private List<CommentDTO> comments;
    private String aiReply;
    public Long getId() {
        return id;
    }

    public String getAiReply() {
        return aiReply;
    }

    public void setAireply(String aiReply) {
        this.aiReply = aiReply;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getPostedAt() {
        return postedAt;
    }

    public void setPostedAt(LocalDateTime postedAt) {
        this.postedAt = postedAt;
    }

    public List<CommentDTO> getComments() {
        return comments;
    }

    public void setComments(List<CommentDTO> comments) {
        this.comments = comments;
    }


}
