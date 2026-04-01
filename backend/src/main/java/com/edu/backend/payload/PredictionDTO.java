package com.edu.backend.payload;


import java.util.Map;

public class PredictionDTO {

    private String prediction;

    private double confidence;

    private Map<String, Double> probabilities;


    public String getPrediction() {
        return prediction;
    }

    public void setPrediction(String prediction) {
        this.prediction = prediction;
    }


    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }


    public Map<String, Double> getProbabilities() {
        return probabilities;
    }

    public void setProbabilities(Map<String, Double> probabilities) {
        this.probabilities = probabilities;
    }

}

