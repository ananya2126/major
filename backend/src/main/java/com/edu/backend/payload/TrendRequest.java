package com.edu.backend.payload;
public class TrendRequest {
    private String course;

    public TrendRequest() {
    }

    public TrendRequest(String course) {
        this.course = course;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }
}

