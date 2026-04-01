package com.edu.backend.controllers;

import com.edu.backend.payload.ExamQuestionRequest;
import com.edu.backend.payload.TrendRequest;
import com.edu.backend.services.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class LlmController {

    @Autowired
    private AiService aiService;

    @PostMapping("/chat")
    public ResponseEntity<String> chatAI(
            @RequestBody Map<String, String> request,
            Authentication auth) {

        String message = request.get("message");
        String reply = aiService.chatAI(auth.getName(), message);

        return ResponseEntity.ok(reply);
    }
    @PostMapping("/generate-questions")
    public String generateQuestions(
            @RequestBody ExamQuestionRequest request
    ) {

        return aiService.generateQuestions(request);

    }
    @PostMapping("/latest-trends")
    public String latestTrends(@RequestBody TrendRequest request) {
        return aiService.getLatestTrends(request);
    }

}

