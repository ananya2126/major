package com.edu.backend.controllers;



import com.edu.backend.payload.FitResponse;
import com.edu.backend.services.MLService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ml")
@CrossOrigin("*")
public class MLController {

    @Autowired
    private MLService mlService;


    @PostMapping(
            value = "/predict-fit-file",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public FitResponse predictFitFile(
            @RequestParam("resume") MultipartFile resume,
            @RequestParam("job_description") MultipartFile job
    ) throws Exception {

        return mlService.predictFitFromFiles(resume, job);

    }

}
