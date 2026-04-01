package com.edu.backend.services;

import com.edu.backend.payload.ExamQuestionRequest;
import com.edu.backend.payload.TrendRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AiService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${ai.url}")
    private String AI_URL;

    public String askAI(String userId, String message) {

        Map<String, String> request = new HashMap<>();
        request.put("username", userId);
        request.put("message", message);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(AI_URL+"/ask", request, Map.class);

        return response.getBody().get("reply").toString();
    }
    public String chatAI(String userId, String message) {

        Map<String, String> request = new HashMap<>();
        request.put("username", userId);
        request.put("message", message);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(AI_URL+"/chat", request, Map.class);

        return response.getBody().get("reply").toString();
    }
    public String generateQuestions(ExamQuestionRequest request) {

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<ExamQuestionRequest> entity =
                new HttpEntity<>(request, headers);

        ResponseEntity<String> response =
                restTemplate.exchange(
                        AI_URL+"/generate-questions",
                        HttpMethod.POST,
                        entity,
                        String.class
                );

        return response.getBody();
    }
    public String getLatestTrends(TrendRequest request) {

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<TrendRequest> entity =
                new HttpEntity<>(request, headers);

        ResponseEntity<String> response =
                restTemplate.exchange(
                        AI_URL + "/latest-trends",
                        HttpMethod.POST,
                        entity,
                        String.class
                );

        return response.getBody();
    }


}

