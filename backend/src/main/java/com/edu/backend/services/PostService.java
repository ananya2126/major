package com.edu.backend.services;

import com.edu.backend.models.Comments;
import com.edu.backend.models.Notifications;
import com.edu.backend.models.Posts;
import com.edu.backend.models.Users;
import com.edu.backend.payload.CommentDTO;
import com.edu.backend.payload.PostDTO;
import com.edu.backend.payload.PostResponseDTO;
import com.edu.backend.repositories.CommentRepository;
import com.edu.backend.repositories.NotificationRepository;
import com.edu.backend.repositories.PostRepository;
import com.edu.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private AiService aiService;
    public Posts createPost(PostDTO post, String email){

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Posts posts = new Posts();
        posts.setUid(user.getId());
        posts.setUsername(user.getUsername());
        posts.setContent(post.content);
        posts.setMentions(post.mentions);

        Posts savedPost = postRepository.save(posts);

        if(post.mentions){

            generateAiReplyAsync(savedPost, email);
        }

        return savedPost;
    }

    @Async
    public void generateAiReplyAsync(Posts savedPost, String user){

        String aiReply = aiService.askAI(user, savedPost.getContent());

        savedPost.setAiReply(aiReply);
        postRepository.save(savedPost);
    }
    public void deletePost(Long postId, String email) {

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Posts post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUid().equals(user.getId())) {
            throw new RuntimeException("Not allowed");
        }

        postRepository.delete(post);
    }




    public List<Posts> myPosts(String email){
        Users user = userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User not found : myposts"));
        List<Posts> myPosts = postRepository.findAllByUid(user.getId());
        return myPosts;
    }
    public Comments addComment(Long postId, String message, String email) {

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Posts post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found!"));


        Comments comment = new Comments();
        comment.setMessage(message);
        comment.setUid(user.getId());
        comment.setUsername(user.getUsername());
        comment.setPost(post);

        Comments savedComment = commentRepository.save(comment);
        System.out.println(comment.getUsername()+"   "+user.getUsername());
        if(!post.getUsername().equalsIgnoreCase(user.getUsername())){
            saveNotification(savedComment);
        }

        return savedComment;
    }

    private void saveNotification(Comments comment){
        Notifications notification = new Notifications();
        notification.setSenderid(comment.getUid());
        notification.setSender(comment.getUsername());
        notification.setRecieverid(comment.getPost().getUid());
        notification.setMessage(comment.getUsername()+" commented on your post");
        notification.setCid(comment.getId());
        notification.setPid(comment.getPost().getId());
        notification.setSeen(false);
        notificationRepository.save(notification);
    }
    public Posts getPostById(Long id){
        Posts post = postRepository.findById(id).orElseThrow(()->new RuntimeException("Post Not Found:getpostByid"));
        return post;
    }
    public List<PostResponseDTO> feed() {

        List<Posts> posts = postRepository.findAll();

        return posts.stream().map(post -> {

            PostResponseDTO dto = new PostResponseDTO();
            dto.setId(post.getId());
            dto.setUsername(post.getUsername());
            dto.setContent(post.getContent());
            dto.setPostedAt(post.getPostedAt());
            dto.setAireply(post.getAiReply());
            List<CommentDTO> commentDTOs =
                    post.getComments().stream().map(comment -> {

                        CommentDTO cdto =
                                new CommentDTO();

                        cdto.setId(comment.getId());
                        cdto.setUsername(comment.getUsername());
                        cdto.setMessage(comment.getMessage());
                        cdto.setPostedAt(comment.getPostedAt());

                        return cdto;

                    }).toList();

            dto.setComments(commentDTOs);

            return dto;

        }).toList();
    }

}
