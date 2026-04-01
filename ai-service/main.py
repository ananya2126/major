from fastapi import FastAPI, HTTPException,UploadFile,File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
from groq import Groq       
from dotenv import load_dotenv
from pdfminer.high_level import extract_text as pdf_extract_text
from docx import Document as DocxDocument
import os
import re
import io
import json
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib
import numpy as np

load_dotenv()

app = FastAPI(title="EduPortal AI Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
CSV_PATH   = os.path.join(os.path.dirname(__file__), "stud.csv")

FEATURE_NAMES = [
    'Drawing','Dancing','Singing','Sports','Video Game','Acting','Travelling',
    'Gardening','Animals','Photography','Teaching','Exercise','Coding',
    'Electricity Components','Mechanic Parts','Computer Parts','Researching',
    'Architecture','Historic Collection','Botany','Zoology','Physics',
    'Accounting','Economics','Sociology','Geography','Psycology','History',
    'Science','Bussiness Education','Chemistry','Mathematics','Biology',
    'Makeup','Designing','Content writing','Crafting','Literature','Reading',
    'Cartooning','Debating','Asrtology','Hindi','French','English','Urdu',
    'Other Language','Solving Puzzles','Gymnastics','Yoga','Engeeniering',
    'Doctor','Pharmisist','Cycling','Knitting','Director','Journalism',
    'Bussiness','Listening Music'
]

NUMERIC_TO_CATEGORY = {
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

# RIASEC Personality Test Data
HOLLAND_QUESTIONS = {
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

PERSONALITY_INFO = {
    "R": {
        "name": "Realistic",
        "description": "Practical, hands-on, and enjoy working with tools, machines, or physical activity.",
        "careers": ["Carpenter", "Electrician", "Mechanic", "Plumber", "Welder", "Engineer"]
    },
    "I": {
        "name": "Investigative",
        "description": "Analytical, intellectual, and enjoy solving complex problems through research.",
        "careers": ["Scientist", "Engineer", "Researcher", "Computer Programmer", "Mathematician", "Doctor"]
    },
    "A": {
        "name": "Artistic",
        "description": "Creative, expressive, and enjoy art, design, writing, and music.",
        "careers": ["Artist", "Graphic Designer", "Writer", "Interior Designer", "Photographer", "Architect"]
    },
    "S": {
        "name": "Social",
        "description": "Compassionate, cooperative, and enjoy helping and caring for others.",
        "careers": ["Teacher", "Social Worker", "Nurse", "Counselor", "Psychologist", "HR Manager"]
    },
    "E": {
        "name": "Enterprising",
        "description": "Ambitious, persuasive, and enjoy leadership roles and entrepreneurship.",
        "careers": ["Entrepreneur", "Sales Manager", "Marketing Manager", "Business Consultant", "Lawyer"]
    },
    "C": {
        "name": "Conventional",
        "description": "Detail-oriented, organized, and enjoy managing data, systems, and tasks.",
        "careers": ["Accountant", "Financial Analyst", "Data Analyst", "Office Manager", "Banker"]
    }
}

def _train_from_csv() -> object:
    """Train a fresh RandomForest model from stud.csv and persist it."""
    if not os.path.exists(CSV_PATH):
        print("❌ stud.csv not found. Career prediction disabled.")
        return None
    try:
        print("🔧 Training career recommendation model from stud.csv …")
        data = pd.read_csv(CSV_PATH)
        label_encoder = LabelEncoder()
        data["Courses_label"] = label_encoder.fit_transform(data["Courses"])
        for col in FEATURE_NAMES:
            if col in data.columns:
                le = LabelEncoder()
                data[col] = le.fit_transform(data[col].astype(str))
        dataab = data.drop(["Courses"], axis=1)
        X_df = dataab[FEATURE_NAMES]
        Y = dataab["Courses_label"]
        X_train, X_test, y_train, y_test = train_test_split(X_df, Y, test_size=0.2, random_state=42)
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        joblib.dump(model, MODEL_PATH)
        print("✅ Model trained and saved.")
        return model
    except Exception as e:
        print(f"❌ Failed to train model: {e}")
        return None


def load_or_train_model():
    """Load pre-trained model; retrain from CSV if pkl is missing or version-incompatible."""
    if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            # Validate the loaded model with a dummy prediction to catch sklearn
            # version mismatches (e.g. missing 'monotonic_cst' attribute).
            dummy = pd.DataFrame([{f: 0 for f in FEATURE_NAMES}])
            model.predict(dummy)
            print("✅ Career ML model loaded and validated successfully.")
            return model
        except AttributeError as e:
            print(f"⚠️  model.pkl is incompatible with current sklearn ({e}). Retraining …")
            try:
                os.remove(MODEL_PATH)
            except OSError:
                pass
        except Exception as e:
            print(f"⚠️  Could not load model.pkl: {e}. Retraining …")
            try:
                os.remove(MODEL_PATH)
            except OSError:
                pass

    return _train_from_csv()

career_model = load_or_train_model()

# ─────────────────────────────────────────────
# Pydantic Models
# ─────────────────────────────────────────────

class MessageRequest(BaseModel):
    username: str
    message: str
class ExamQuestionRequest(BaseModel):
    exam_type: str
    topic: str
    num_questions: int
    difficulty: str = "medium"   # optional: easy, medium, hard
class TrendRequest(BaseModel):
    course: str

@app.post("/ask")
async def ask_ai(request: MessageRequest):

    completion = client.chat.completions.create(
        model="groq/compound",
        messages = [
        {   
        "role": "system",
        "content": "You are a helpful assistant. Always respond in 2-3 simple bullet points or one short paragraph. Keep answers concise and easy to understand."
        },
        {
        "role": "user",
        "content": request.message
        }
        ]
        ,
        temperature=0.7,
        max_completion_tokens=1024,
        compound_custom={
            "tools": {
                "enabled_tools":["web_search","code_interpreter","visit_website"]
            }
        }
    )

    return {
        "reply": completion.choices[0].message.content
    }

@app.post("/chat")
async def chat_ai(request: MessageRequest):

    completion = client.chat.completions.create(
        model="groq/compound",
        messages = [
        {   
        "role": "system",
        "content": "You are a helpful assistant. Always respond in 6-7 simple bullet points . Keep answers concise and easy to understand."
        },
        {
        "role": "user",
        "content": request.message
        }
        ]
        ,
        temperature=0.7,
        max_completion_tokens=1024,
        compound_custom={
            "tools": {
                "enabled_tools":["web_search","code_interpreter","visit_website"]
            }
        }
    )

    return {
        "reply": completion.choices[0].message.content
    }
@app.post("/generate-questions")
async def generate_questions(request: ExamQuestionRequest):

    prompt = f"""
    Generate questions for the following exam:

    Exam Type: {request.exam_type}
    Topic: {request.topic}
    Number of Questions for practice: {request.num_questions}
    Difficulty: {request.difficulty}

    IMPORTANT: Respond ONLY with valid JSON. Do not include any markdown formatting, code blocks, or extra text.

    JSON structure:
    {{
        "practice_questions": [
            {{
                "question": "Question text here",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "A",
                "solution": "Detailed solution explanation"
            }}
        ],
        "quiz_questions": [
            {{
                "question": "Question text here",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "A",
                "solution": "Detailed solution explanation"
            }}
        ]
    }}

    Generate exactly {request.num_questions} practice questions and 10 quiz questions.
    Make questions relevant to {request.exam_type} exam pattern and {request.topic} topic.
    """

    completion = client.chat.completions.create(
        model="groq/compound",
        messages=[
            {
                "role": "system",
                "content": "You are an expert exam question generator. You must respond ONLY with valid JSON. No markdown, no code blocks, no explanations. Just pure JSON."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
        max_completion_tokens=2048,
        compound_custom={
            "tools": {
                "enabled_tools": ["web_search", "code_interpreter"]
            }
        }
    )

    raw_content = completion.choices[0].message.content.strip()
    
    # Clean up the response - remove markdown formatting if present
    if raw_content.startswith("```json"):
        raw_content = raw_content[7:]
    if raw_content.startswith("```"):
        raw_content = raw_content[3:]
    if raw_content.endswith("```"):
        raw_content = raw_content[:-3]
    
    raw_content = raw_content.strip()
    
    # Try to parse and validate the JSON
    try:
        parsed_data = json.loads(raw_content)
        
        # Validate structure
        if "practice_questions" not in parsed_data or "quiz_questions" not in parsed_data:
            raise ValueError("Missing required fields")
            
        # Ensure practice_questions has the right number
        if len(parsed_data["practice_questions"]) != request.num_questions:
            # Adjust if AI didn't follow the count
            parsed_data["practice_questions"] = parsed_data["practice_questions"][:request.num_questions]
            
        return {
            "exam_type": request.exam_type,
            "topic": request.topic,
            "questions": json.dumps(parsed_data)
        }
        
    except (json.JSONDecodeError, ValueError) as e:
        # Fallback: create a basic structure
        fallback_data = {
            "practice_questions": [
                {
                    "question": f"Sample question {i+1} for {request.topic}",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct_answer": "A",
                    "solution": f"Sample solution {i+1}"
                } for i in range(min(request.num_questions, 5))
            ],
            "quiz_questions": [
                {
                    "question": f"Quiz question {i+1} for {request.topic}",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct_answer": "A", 
                    "solution": f"Quiz solution {i+1}"
                } for i in range(10)
            ]
        }
        
        return {
            "exam_type": request.exam_type,
            "topic": request.topic,
            "questions": json.dumps(fallback_data)
        }
@app.post("/latest-trends")
async def latest_trends(request: TrendRequest):

    prompt = f"""
    User is studying {request.course}.

    IMPORTANT: Respond ONLY with valid JSON. Do not include any markdown formatting, code blocks, or extra text.

    Provide latest trends in this field including:
    1. Latest technologies in demand
    2. Trending domains
    3. Career opportunities
    4. Complete roadmap from beginner to advanced
    5. Tools and programming languages to learn
    6. Industry demand and future scope

    Respond ONLY with this JSON structure:
    {{
        "course": "{request.course}",
        "trending_domains": ["domain1", "domain2", "domain3"],
        "technologies": ["tech1", "tech2", "tech3"],
        "roadmap": [
            {{"step": "Step 1: Beginner", "description": "Foundations", "duration": "3-4 months"}}
        ],
        "tools": ["tool1", "tool2"],
        "career_roles": ["role1", "role2"],
        "future_scope": "details"
    }}
    """

    completion = client.chat.completions.create(
        model="groq/compound",
        messages=[
            {
                "role": "system",
                "content": "You are an expert career advisor. Respond ONLY with valid JSON. No markdown, no explanations."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
        max_completion_tokens=2048,
        compound_custom={
            "tools": {
                "enabled_tools": [
                    "web_search",
                    "visit_website",
                    "code_interpreter"
                ]
            }
        }
    )

    raw_content = completion.choices[0].message.content.strip()
    
    if raw_content.startswith("```json"):
        raw_content = raw_content[7:]
    if raw_content.startswith("```"):
        raw_content = raw_content[3:]
    if raw_content.endswith("```"):
        raw_content = raw_content[:-3]
    
    raw_content = raw_content.strip()
    
    try:
        parsed_data = json.loads(raw_content)
        if "course" not in parsed_data:
            parsed_data["course"] = request.course
        return {
            "course": request.course,
            "trends": json.dumps(parsed_data)
        }
    except (json.JSONDecodeError, ValueError):
        fallback_data = {
            "course": request.course,
            "trending_domains": ["AI & ML", "Cloud Computing", "Data Science", "DevOps", "Cybersecurity"],
            "technologies": ["Python", "Kubernetes", "Docker", "TensorFlow", "AWS"],
            "roadmap": [
                {"step": "Step 1: Beginner Foundations", "description": f"Learn basics of {request.course}", "duration": "3-4 months"},
                {"step": "Step 2: Intermediate Development", "description": f"Build projects in {request.course}", "duration": "3-4 months"},
                {"step": "Step 3: Advanced Specialization", "description": f"Master {request.course}", "duration": "3-4 months"},
                {"step": "Step 4: Expert Mastery", "description": f"Lead in {request.course}", "duration": "ongoing"}
            ],
            "tools": ["Git", "Docker", "VS Code", "Postman", "JIRA"],
            "career_roles": [f"{request.course} Developer", f"{request.course} Architect", "Technical Lead", "Manager"],
            "future_scope": f"{request.course} is in high demand with excellent career growth and competitive salaries globally."
        }
        return {
            "course": request.course,
            "trends": json.dumps(fallback_data)
        }
