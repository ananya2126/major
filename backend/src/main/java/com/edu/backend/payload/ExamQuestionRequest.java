package com.edu.backend.payload;


public class ExamQuestionRequest {

    private String exam_type;
    private String topic;
    private int num_questions;
    private String difficulty;

    public ExamQuestionRequest() {
    }

    public ExamQuestionRequest(String exam_type, String topic, int num_questions, String difficulty) {
        this.exam_type = exam_type;
        this.topic = topic;
        this.num_questions = num_questions;
        this.difficulty = difficulty;
    }

    public String getExam_type() {
        return exam_type;
    }

    public void setExam_type(String exam_type) {
        this.exam_type = exam_type;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public int getNum_questions() {
        return num_questions;
    }

    public void setNum_questions(int num_questions) {
        this.num_questions = num_questions;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }
}

