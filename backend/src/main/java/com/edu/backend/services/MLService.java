package com.edu.backend.services;


import com.edu.backend.helper.MultipartInputStreamFileResource;
import com.edu.backend.payload.FitResponse;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
public class MLService {

    private final String FASTAPI_URL =
            "http://localhost:5000/full-analysis";


    public FitResponse predictFitFromFiles(
            MultipartFile resume,
            MultipartFile job
    ) throws Exception {

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.MULTIPART_FORM_DATA);


        MultiValueMap<String, Object> body =
                new LinkedMultiValueMap<>();


        body.add(
                "resume",
                new MultipartInputStreamFileResource(
                        resume.getInputStream(),
                        resume.getOriginalFilename()
                )
        );


        body.add(
                "job_description",
                new MultipartInputStreamFileResource(
                        job.getInputStream(),
                        job.getOriginalFilename()
                )
        );


        HttpEntity<MultiValueMap<String, Object>> requestEntity =
                new HttpEntity<>(body, headers);


        ResponseEntity<FitResponse> response =
                restTemplate.exchange(
                        FASTAPI_URL,
                        HttpMethod.POST,
                        requestEntity,
                        FitResponse.class
                );


        return response.getBody();

    }

}
