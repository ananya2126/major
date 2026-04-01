import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Zap, Star, TrendingUp } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/feed');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20 animate-pulse"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Hero Section */}
      <div className="relative container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-bounce">
            <Star size={16} />
            Welcome to the Future of Learning
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">
            Welcome to <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">EduPortal</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Your comprehensive education platform for learning, collaboration, and growth.
            Connect with peers, access AI-powered tools, and track your academic journey with cutting-edge technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
            >
              Get Started
              <ArrowRight size={24} />
            </button>
            <button
              onClick={() => navigate('/about')}
              className="inline-flex items-center gap-3 bg-white text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl"
            >
              Learn More
              <BookOpen size={24} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">10K+</div>
              <div className="text-slate-600">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-slate-600">Study Resources</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">24/7</div>
              <div className="text-slate-600">AI Support</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="group text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50">
            <div className="inline-flex p-4 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
              <BookOpen size={32} className="text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Learn & Grow</h3>
            <p className="text-slate-600 leading-relaxed">Access comprehensive study materials and track your progress with our intelligent dashboard powered by advanced analytics.</p>
          </div>

          <div className="group text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50">
            <div className="inline-flex p-4 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
              <Users size={32} className="text-cyan-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Connect & Collaborate</h3>
            <p className="text-slate-600 leading-relaxed">Share knowledge, discuss topics, and build your network with fellow learners in our interactive community.</p>
          </div>

          <div className="group text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50">
            <div className="inline-flex p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
              <Zap size={32} className="text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">AI-Powered Tools</h3>
            <p className="text-slate-600 leading-relaxed">Leverage cutting-edge AI for personalized learning recommendations, instant answers, and smart insights.</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-2 text-slate-600 mb-6">
            <TrendingUp size={20} />
            <span>Join thousands of students already learning smarter</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors text-lg"
          >
            Sign in to your account
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Landing;