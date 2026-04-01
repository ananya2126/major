package com.edu.backend.payload;


public class FitRequest {

    private String resume_text;
    private String job_description;

    public FitRequest() {
    }

    public FitRequest(String resume_text, String job_description) {
        this.resume_text = resume_text;
        this.job_description = job_description;
    }

    public String getResume_text() {
        return resume_text;
    }

    public void setResume_text(String resume_text) {
        this.resume_text = resume_text;
    }

    public String getJob_description() {
        return job_description;
    }

    public void setJob_description(String job_description) {
        this.job_description = job_description;
    }
}

