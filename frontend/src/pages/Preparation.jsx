import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Brain, GraduationCap, BookOpen, Play, CheckCircle, XCircle, ArrowRight, Target, Clock } from "lucide-react";

const Preparation = () => {
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState(null);
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState(false);

  const exams = [
    { name: "EAMCET", icon: <BookOpen size={24} />, description: "Engineering, Agriculture & Medical Common Entrance Test" },
    { name: "JEE_MAINS", icon: <Brain size={24} />, description: "Joint Entrance Examination - Main" },
    { name: "JEE_ADVANCED", icon: <GraduationCap size={24} />, description: "Joint Entrance Examination - Advanced" },
    { name: "GATE", icon: <BookOpen size={24} />, description: "Gate Examinations" },
  ];

  const topics = {
    EAMCET: ["Physics", "Chemistry", "Mathematics", "Biology"],
    JEE_MAINS: ["Physics", "Chemistry", "Mathematics"],
    JEE_ADVANCED: ["Physics", "Chemistry", "Mathematics"],
    GATE: ["Computer Science", "Mechanical", "Electrical", "Civil", "Chemical"]
  };

  const handleStartPractice = async () => {
    if (!selectedExam || !topic) {
      alert("Please select exam type and topic");
      return;
    }

    // Combine topic and subtopic for the backend
    const finalTopic = subtopic ? `${topic} - ${subtopic}` : topic;

    setLoading(true);
    try {
      const response = await api.post("/ai/generate-questions", {
        exam_type: selectedExam,
        topic: finalTopic,
        num_questions: numQuestions,
        difficulty: difficulty
      });

      console.log("API Response:", response.data);

      // Parse the response - it comes as a string that needs to be parsed
      let data;
      try {
        data = JSON.parse(response.data.questions);
        console.log("Parsed data:", data);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        alert("Failed to parse questions. Please try again.");
        return;
      }

      // Validate the response structure
      if (!data.practice_questions || !Array.isArray(data.practice_questions) || data.practice_questions.length === 0) {
        alert("No practice questions received. Please try again.");
        return;
      }

      if (!data.quiz_questions || !Array.isArray(data.quiz_questions) || data.quiz_questions.length === 0) {
        alert("No quiz questions received. Please try again.");
        return;
      }

      setQuestions(data);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowAnswer(false);
      setPracticeCompleted(false);
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Failed to generate questions. Please check your connection and try again.");
    }
    setLoading(false);
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.practice_questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      setPracticeCompleted(true);
    }
  };

  const handleTakeQuiz = () => {
    navigate("/quiz", {
      state: {
        quizQuestions: questions.quiz_questions,
        examType: selectedExam,
        topic: topic
      }
    });
  };

  const currentQuestion = questions?.practice_questions?.[currentQuestionIndex];

  if (practiceCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-white" size={40} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Practice Completed!</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Great job! You've completed all practice questions. Now test your knowledge with the quiz.
            </p>
            <button
              onClick={handleTakeQuiz}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
            >
              <Target size={20} />
              Take Quiz Now
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions && currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Practice Mode - {selectedExam.replace("_", " ")}
              </h2>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={18} />
                <span className="font-medium">
                  Question {currentQuestionIndex + 1} of {questions.practice_questions.length}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / questions.practice_questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {currentQuestion.question}
              </h3>
            </div>

            {/* Answer Section */}
            <div className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-gray-600 font-medium">Select your answer:</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options?.map((option, index) => {
                  const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                  return (
                    <button
                      key={optionLetter}
                      onClick={() => !showAnswer && handleAnswerSelect(optionLetter)}
                      disabled={showAnswer}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        showAnswer
                          ? optionLetter === currentQuestion.correct_answer
                            ? "border-green-500 bg-green-50 text-green-800"
                            : selectedAnswer === optionLetter && optionLetter !== currentQuestion.correct_answer
                            ? "border-red-500 bg-red-50 text-red-800"
                            : "border-gray-200 bg-gray-50"
                          : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          showAnswer
                            ? optionLetter === currentQuestion.correct_answer
                              ? "bg-green-500 text-white"
                              : selectedAnswer === optionLetter && optionLetter !== currentQuestion.correct_answer
                              ? "bg-red-500 text-white"
                              : "bg-gray-400 text-white"
                            : "bg-indigo-100 text-indigo-600"
                        }`}>
                          {optionLetter}
                        </div>
                        <span className="font-medium">{option}</span>
                        {showAnswer && optionLetter === currentQuestion.correct_answer && (
                          <CheckCircle className="text-green-500 ml-auto" size={20} />
                        )}
                        {showAnswer && selectedAnswer === optionLetter && optionLetter !== currentQuestion.correct_answer && (
                          <XCircle className="text-red-500 ml-auto" size={20} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Solution */}
            {showAnswer && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <BookOpen size={18} />
                  Solution:
                </h4>
                <p className="text-gray-700 leading-relaxed">{currentQuestion.solution}</p>
              </div>
            )}

            {/* Next Button */}
            {showAnswer && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleNextQuestion}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
                >
                  {currentQuestionIndex < questions.practice_questions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight size={18} />
                    </>
                  ) : (
                    <>
                      Complete Practice
                      <CheckCircle size={18} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Exam Preparation
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose your exam type and practice with interactive questions. Master concepts before taking the quiz!
          </p>
        </div>

        {/* Exam Selection */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {exams.map((exam) => (
            <div
              key={exam.name}
              onClick={() => setSelectedExam(exam.name)}
              className={`bg-white p-6 rounded-3xl shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-200 ${
                selectedExam === exam.name
                  ? "ring-2 ring-indigo-500 shadow-xl"
                  : "hover:shadow-xl"
              }`}
            >
              <div className={`p-4 rounded-2xl mb-4 ${
                selectedExam === exam.name
                  ? "bg-indigo-500 text-white"
                  : "bg-indigo-100 text-indigo-600"
              }`}>
                {exam.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {exam.name.replace("_", " ")}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {exam.description}
              </p>
            </div>
          ))}
        </div>

        {/* Configuration Form */}
        {selectedExam && (
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Configure Your Practice Session
            </h2>

            <div className="space-y-6">
              {/* Topic Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Topic
                </label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {topics[selectedExam]?.map((topicOption) => (
                    <button
                      key={topicOption}
                      onClick={() => {
                        setTopic(topicOption);
                        setSubtopic(""); // Reset subtopic when changing topic
                      }}
                      className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                        topic === topicOption
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                      }`}
                    >
                      {topicOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtopic Input */}
              {topic && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Sub Topic (Optional) - Be specific for better questions
                  </label>
                  <input
                    type="text"
                    value={subtopic}
                    onChange={(e) => setSubtopic(e.target.value)}
                    placeholder={`e.g., For ${topic}: Newton's Laws, Electromagnetism, Organic Compounds, etc.`}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
                  />
                  {subtopic && (
                    <p className="text-sm text-gray-600 mt-2">
                      📚 Generating questions for: <span className="font-semibold text-indigo-600">{topic} - {subtopic}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Number of Questions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Number of Practice Questions
                </label>
                <div className="flex gap-3">
                  {[5,10,20,50].map((num) => (
                    <button
                      key={num}
                      onClick={() => setNumQuestions(num)}
                      className={`px-4 py-2 rounded-xl border-2 transition-all duration-200 ${
                        numQuestions === num
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Difficulty Level
                </label>
                <div className="flex gap-3">
                  {["easy", "medium", "hard"].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`px-4 py-2 rounded-xl border-2 capitalize transition-all duration-200 ${
                        difficulty === diff
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartPractice}
                disabled={loading || !topic}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    Start Practice
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Preparation;
