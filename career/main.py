from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, List
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib
import os
import numpy as np

app = FastAPI(title="Career Recommendation System", description="API for career recommendations using ML and personality tests")
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Personality test data
holland_questions = {
    "R": [
        "I enjoy working with machines and tools.",
        "I like to work with numbers and solve mathematical problems.",
        "I prefer practical tasks over abstract ones."
    ],
    "I": [
        "I enjoy solving puzzles and brain teasers.",
        "I like conducting experiments and exploring new ideas.",
        "I enjoy analyzing data to find patterns and trends."
    ],
    "A": [
        "I enjoy drawing, painting, or creating visual art.",
        "I like expressing myself through music or dance.",
        "I like writing poetry or stories."
    ],
    "S": [
        "I enjoy helping people solve their problems.",
        "I like volunteering and contributing to my community.",
        "I enjoy teaching and educating others."
    ],
    "E": [
        "I enjoy taking on leadership roles and responsibilities.",
        "I like persuading and convincing others.",
        "I like organizing events and gatherings."
    ],
    "C": [
        "I prefer working with numbers and data.",
        "I like creating and following organized systems.",
        "I enjoy record-keeping and data analysis."
    ]
}

personality_info = {
    "R": {
        "name": "Realistic",
        "description": "Realistic individuals are practical, hands-on, and enjoy working with tools and machines.",
        "careers": [
            "Carpenter",
            "Electrician",
            "Mechanic",
            "Plumber",
            "Welder"
        ]
    },
    "I": {
        "name": "Investigative",
        "description": "Investigative individuals are analytical and enjoy solving complex problems.",
        "careers": [
            "Scientist",
            "Engineer",
            "Researcher",
            "Computer Programmer",
            "Mathematician"
        ]
    },
    "A": {
        "name": "Artistic",
        "description": "Artistic individuals are creative and enjoy expressing themselves through art and design.",
        "careers": [
            "Artist",
            "Graphic Designer",
            "Writer",
            "Interior Designer",
            "Photographer"
        ]
    },
    "S": {
        "name": "Social",
        "description": "Social individuals are compassionate and enjoy helping and caring for others.",
        "careers": [
            "Teacher",
            "Social Worker",
            "Nurse",
            "Counselor",
            "Psychologist"
        ]
    },
    "E": {
        "name": "Enterprising",
        "description": "Enterprising individuals are ambitious and enjoy leadership roles and entrepreneurship.",
        "careers": [
            "Entrepreneur",
            "Sales Manager",
            "Marketing Manager",
            "Business Consultant",
            "Politician"
        ]
    },
    "C": {
        "name": "Conventional",
        "description": "Conventional individuals are detail-oriented and enjoy organizing and managing tasks and data.",
        "careers": [
            "Accountant",
            "Financial Analyst",
            "Data Analyst",
            "Office Manager",
            "Banker"
        ]
    }
}

# ML model setup
MODEL_PATH = 'model.pkl'
FEATURE_NAMES = ['Drawing','Dancing','Singing','Sports','Video Game','Acting','Travelling','Gardening','Animals','Photography','Teaching','Exercise','Coding','Electricity Components','Mechanic Parts','Computer Parts','Researching','Architecture','Historic Collection','Botany','Zoology','Physics','Accounting','Economics','Sociology','Geography','Psycology','History','Science','Bussiness Education','Chemistry','Mathematics','Biology','Makeup','Designing','Content writing','Crafting','Literature','Reading','Cartooning','Debating','Asrtology','Hindi','French','English','Urdu','Other Language','Solving Puzzles','Gymnastics','Yoga','Engeeniering','Doctor','Pharmisist','Cycling','Knitting','Director','Journalism','Bussiness','Listening Music']

numeric_to_category = {
    0: 'Animation, Graphics and Multimedia',
    1: 'B.Arch- Bachelor of Architecture',
    2: 'B.Com- Bachelor of Commerce',
    3: 'B.Ed.',
    4: 'B.Sc- Applied Geology',
    5: 'B.Sc- Nursing',
    6: 'B.Sc. Chemistry',
    7: 'B.Sc. Mathematics',
    8: 'B.Sc.- Information Technology',
    9: 'B.Sc.- Physics',
    10: 'B.Tech.-Civil Engineering',
    11: 'B.Tech.-Computer Science and Engineering',
    12: 'B.Tech.-Electrical and Electronics Engineering',
    13: 'B.Tech.-Electronics and Communication Engineering',
    14: 'B.Tech.-Mechanical Engineering',
    15: 'BA in Economics',
    16: 'BA in English',
    17: 'BA in Hindi',
    18: 'BA in History',
    19: 'BBA- Bachelor of Business Administration',
    20: 'BBS- Bachelor of Business Studies',
    21: 'BCA- Bachelor of Computer Applications',
    22: 'BDS- Bachelor of Dental Surgery',
    23: 'BEM- Bachelor of Event Management',
    24: 'BFD- Bachelor of Fashion Designing',
    25: 'BJMC- Bachelor of Journalism and Mass Communication',
    26: 'BPharma- Bachelor of Pharmacy',
    27: 'BTTM- Bachelor of Travel and Tourism Management',
    28: 'BVA- Bachelor of Visual Arts',
    29: 'CA- Chartered Accountancy',
    30: 'CS- Company Secretary',
    31: 'Civil Services',
    32: 'Diploma in Dramatic Arts',
    33: 'Integrated Law Course- BA + LL.B',
    34: 'MBBS'
}

def load_or_train_model():
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print("Model loaded from file.")
    else:
        print("Training model...")
        data = pd.read_csv("stud.csv")
        
        # Label encoding for courses
        label_encoder = LabelEncoder()
        data['Courses_label'] = label_encoder.fit_transform(data['Courses'])
        y = data['Courses_label']
        
        # Label encoding for categorical columns (though they are 0/1)
        categorical_columns = FEATURE_NAMES
        for col in categorical_columns:
            le = LabelEncoder()
            data[col] = le.fit_transform(data[col])
        
        # Drop original Courses column
        dataab = data.drop(['Courses'], axis=1)
        
        X_df = dataab[FEATURE_NAMES]
        Y = dataab['Courses_label']
        
        # Train test split
        X_train, X_test, y_train, y_test = train_test_split(X_df, Y, test_size=0.2, random_state=42)
        
        # Train model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        # Save model
        joblib.dump(model, MODEL_PATH)
        print("Model trained and saved.")
    
    return model

model = load_or_train_model()

# Pydantic models
class PersonalityAnswers(BaseModel):
    answers: Dict[str, List[int]]  # e.g., {"R": [4,3,5], "I": [2,4,3], ...}

class Interests(BaseModel):
    interests: Dict[str, int]  # e.g., {"Drawing": 1, "Coding": 0, ...}

class PersonalityResult(BaseModel):
    dominant_type: str
    description: str
    careers: List[str]
    scores: Dict[str, float]  # for chart

class CoursePrediction(BaseModel):
    predicted_course: str

@app.get("/")
def read_root():
    return {"message": "Welcome to Career Recommendation System API"}

@app.get("/personality_questions")
def get_personality_questions():
    return holland_questions

@app.post("/personality_test", response_model=PersonalityResult)
def submit_personality_test(answers: PersonalityAnswers):
    cumulative_scores = {}
    for ptype, ans_list in answers.answers.items():
        if ptype not in holland_questions:
            raise HTTPException(status_code=400, detail=f"Invalid personality type: {ptype}")
        if len(ans_list) != len(holland_questions[ptype]):
            raise HTTPException(status_code=400, detail=f"Wrong number of answers for {ptype}")
        score = sum(ans_list)
        cumulative_scores[ptype] = score
    
    dominant_personality = max(cumulative_scores, key=cumulative_scores.get)
    
    # Calculate percentages for chart
    total_score = sum(cumulative_scores.values())
    percentages = {ptype: (score / total_score) * 100 for ptype, score in cumulative_scores.items()}
    
    result = PersonalityResult(
        dominant_type=personality_info[dominant_personality]['name'],
        description=personality_info[dominant_personality]['description'],
        careers=personality_info[dominant_personality]['careers'],
        scores=percentages
    )
    return result

@app.post("/predict_course", response_model=CoursePrediction)
def predict_course(interests: Interests):
    user_input = {}
    for feature in FEATURE_NAMES:
        user_input[feature] = interests.interests.get(feature, 0)
    
    user_data = pd.DataFrame([user_input])
    
    prediction = model.predict(user_data)
    numeric_prediction = int(prediction[0])
    
    if numeric_prediction in numeric_to_category:
        categorical_prediction = numeric_to_category[numeric_prediction]
    else:
        categorical_prediction = "Unknown"
    
    return CoursePrediction(predicted_course=categorical_prediction)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)