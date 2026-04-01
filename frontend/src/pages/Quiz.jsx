import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Clock, CheckCircle, XCircle, Trophy, RotateCcw, Home } from "lucide-react";

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizQuestions, examType, topic } = location.state || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (!quizQuestions || quizQuestions.length === 0) {
      //navigate("/prepare");
      return;
    }

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizQuestions, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    setQuizCompleted(true);
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correct++;
      }
    });
    return correct;
  };

  const getScorePercentage = () => {
    return Math.round((calculateScore() / quizQuestions.length) * 100);
  };

  const getScoreColor = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return "from-green-500 to-emerald-600";
    if (percentage >= 60) return "from-yellow-500 to-orange-600";
    return "from-red-500 to-pink-600";
  };

  if (!quizQuestions || quizQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md">
          <XCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Quiz Questions</h2>
          <p className="text-gray-600 mb-6">Please complete the practice session first.</p>
          <button
            onClick={() => navigate("/prepare")}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
          >
            Go to Preparation
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = getScorePercentage();

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Results Header */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 text-center">
            <div className={`w-24 h-24 bg-gradient-to-r ${getScoreBgColor()} rounded-full flex items-center justify-center mx-auto mb-6`}>
              <Trophy className="text-white" size={40} />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Quiz Completed!</h1>
            <div className="text-6xl font-bold mb-2">
              <span className={getScoreColor()}>{score}</span>
              <span className="text-gray-400">/{quizQuestions.length}</span>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor()} mb-6`}>
              {percentage}% Score
            </div>
            <p className="text-gray-600 text-lg">
              {examType?.replace("_", " ")} - {topic}
            </p>
          </div>

          {/* Detailed Results */}
          <div className="space-y-6">
            {quizQuestions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correct_answer;

              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      isCorrect ? "bg-green-500" : "bg-red-500"
                    }`}>
                      {isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-3">
                        Question {index + 1}: {question.question}
                      </h3>

                      <div className="space-y-2 mb-4">
                        {question.options.map((option, optIndex) => {
                          const optionLetter = String.fromCharCode(65 + optIndex); // A, B, C, D
                          let optionClass = "border-gray-200";

                          if (option === question.correct_answer) {
                            optionClass = "border-green-500 bg-green-50 text-green-800";
                          } else if (option === userAnswer && !isCorrect) {
                            optionClass = "border-red-500 bg-red-50 text-red-800";
                          }

                          return (
                            <div key={optIndex} className={`p-3 rounded-lg border-2 ${optionClass}`}>
                              <span className="font-medium">{optionLetter}.</span> {option}
                            </div>
                          );
                        })}
                      </div>

                      {!isCorrect && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-bold text-blue-800 mb-2">Solution:</h4>
                          <p className="text-blue-700">{question.solution}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={() => navigate("/prepare")}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <RotateCcw size={18} />
              Practice Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Home size={18} />
              Home
            </button>
          </div>

        </div>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {examType?.replace("_", " ")} Quiz
              </h1>
              <p className="text-gray-600">Topic: {topic}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Clock size={18} />
                <span className="font-medium">{formatTime(timeLeft)}</span>
              </div>
              <div className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Question {currentQuestionIndex + 1}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {currentQuestion.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
              const isSelected = selectedAnswers[currentQuestionIndex] === option;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      isSelected
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      {optionLetter}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 rounded-xl font-medium border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentQuestionIndex === quizQuestions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Next
              </button>
            )}
          </div>

        </div>

        {/* Question Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Question Navigation</h3>
          <div className="grid grid-cols-10 gap-2">
            {quizQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                  index === currentQuestionIndex
                    ? "bg-indigo-500 text-white"
                    : selectedAnswers[index]
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Quiz;
