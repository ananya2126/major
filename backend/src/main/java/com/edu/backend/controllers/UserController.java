package com.edu.backend.controllers;

import com.edu.backend.models.Comments;
import com.edu.backend.models.Notifications;
import com.edu.backend.models.Posts;
import com.edu.backend.models.Users;
import com.edu.backend.payload.PostDTO;
import com.edu.backend.payload.PostResponseDTO;
import com.edu.backend.payload.UpdateProfileRequest;
import com.edu.backend.services.AiService;
import com.edu.backend.services.NotificationService;
import com.edu.backend.services.PostService;
import com.edu.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private PostService postService;
    @Autowired
    private UserService service;
    @Autowired
    private NotificationService notificationService;

    @PutMapping("/update-profile")
    public ResponseEntity<Users> updateProfile(@RequestBody UpdateProfileRequest request,
                               Authentication authentication) {


        return ResponseEntity.ok(service.updateProfile(authentication.getName(), request));
    }
    @GetMapping("/profile")
    public ResponseEntity<Users> getProfile(Authentication authentication){
        return ResponseEntity.ok(service.getProfile(authentication.getName()));
    }
    @PostMapping("/create-post")
    public ResponseEntity<Posts> create(@RequestBody PostDTO postDTO,Authentication auth){

       return ResponseEntity.ok(postService.createPost(postDTO, auth.getName()));
    }

    //get all posts
    @GetMapping("/feed")
    public ResponseEntity<List<PostResponseDTO>> feed(){
        return ResponseEntity.ok(postService.feed());
    }
    //view my posts add a button on navbar
    @GetMapping("/posts")
    public  ResponseEntity<List<Posts>> viewMyPosts(Authentication auth){
        return ResponseEntity.ok(postService.myPosts(auth.getName()));
    }
    //for specific post
    @GetMapping("/view")
    public ResponseEntity<Posts> viewPost(@RequestParam Long id, Authentication auth){
        return ResponseEntity.ok(postService.getPostById(id));
    }
    //comment on some post
    @PostMapping("/comment")
    public ResponseEntity<Comments> comment(@RequestParam Long pid,@RequestParam String message,Authentication auth){
        return ResponseEntity.ok(postService.addComment(pid,message, auth.getName()));
    }
    //get specific comment by id from notifications
    @GetMapping("/view/comment")
    public ResponseEntity<Comments> getComment(@RequestParam Long cid,Authentication auth){
        return ResponseEntity.ok(notificationService.viewComment(cid,auth.getName()));
    }
    @GetMapping("/notifications")
    public ResponseEntity<List<Notifications>> getNotifications(Authentication auth){
        return ResponseEntity.ok(notificationService.viewNotifications(auth.getName()));
    }
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id, Authentication auth) {
        postService.deletePost(id, auth.getName());
        return ResponseEntity.ok("Deleted successfully");
    }
}
