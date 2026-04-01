# Career Recommendation System API

This is a FastAPI-based web API for career recommendations using machine learning and personality tests.

## Features

- **Personality Test**: RIASEC model-based aptitude test with career recommendations and visualization data.
- **ML-based Course Prediction**: Predict suitable courses based on user interests.

## Endpoints

### GET /
Returns a welcome message.

### GET /personality_questions
Returns the questions for the personality test grouped by personality type (R, I, A, S, E, C).

### POST /personality_test
Submit answers to the personality test.

**Request Body:**
```json
{
  "answers": {
    "R": [4, 3, 5],
    "I": [2, 4, 3],
    ...
  }
}
```

Each list has 3 integers (0-4) for the 3 questions per type.

**Response:**
```json
{
  "dominant_type": "Realistic",
  "description": "...",
  "careers": ["Carpenter", ...],
  "scores": {"R": 25.0, "I": 20.0, ...}
}
```

### POST /predict_course
Predict a course based on interests.

**Request Body:**
```json
{
  "interests": {
    "Drawing": 1,
    "Coding": 0,
    ...
  }
}
```

All features from the list, 0 or 1.

**Response:**
```json
{
  "predicted_course": "B.Tech.-Computer Science and Engineering"
}
```

## Installation

1. Create virtual environment: `python -m venv venv`
2. Activate: `venv\Scripts\activate` (Windows)
3. Install dependencies: `pip install -r requirements.txt`

## Running

`python main.py`

Or `uvicorn main:app --reload`

API will be available at http://localhost:8000

Interactive docs at http://localhost:8000/docs