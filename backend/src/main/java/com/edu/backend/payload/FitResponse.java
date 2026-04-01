package com.edu.backend.payload;

import java.util.List;
import java.util.Map;

public class FitResponse {

    private PredictionDTO prediction;

    private double match_score;

    private List<String> resume_skills;

    private List<String> job_skills;

    private List<String> matched_skills;

    private List<String> missing_skills;

    private Map<String, String> learning_resources;

    private String project_ideas;


    public PredictionDTO getPrediction() {
        return prediction;
    }

    public void setPrediction(PredictionDTO prediction) {
        this.prediction = prediction;
    }


    public double getMatch_score() {
        return match_score;
    }

    public void setMatch_score(double match_score) {
        this.match_score = match_score;
    }


    public List<String> getResume_skills() {
        return resume_skills;
    }

    public void setResume_skills(List<String> resume_skills) {
        this.resume_skills = resume_skills;
    }


    public List<String> getJob_skills() {
        return job_skills;
    }

    public void setJob_skills(List<String> job_skills) {
        this.job_skills = job_skills;
    }


    public List<String> getMatched_skills() {
        return matched_skills;
    }

    public void setMatched_skills(List<String> matched_skills) {
        this.matched_skills = matched_skills;
    }


    public List<String> getMissing_skills() {
        return missing_skills;
    }

    public void setMissing_skills(List<String> missing_skills) {
        this.missing_skills = missing_skills;
    }


    public Map<String, String> getLearning_resources() {
        return learning_resources;
    }

    public void setLearning_resources(Map<String, String> learning_resources) {
        this.learning_resources = learning_resources;
    }


    public String getProject_ideas() {
        return project_ideas;
    }

    public void setProject_ideas(String project_ideas) {
        this.project_ideas = project_ideas;
    }

}
