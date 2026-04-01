import React from "react";
import { Sparkles, Brain, TrendingUp, Users, Target } from "lucide-react";

const About = () => {
  return (
    <div className="max-w-5xl mx-auto py-16 px-6">

      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">
          About <span className="text-indigo-600">EduPortal</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          EduPortal is an AI-powered collaborative learning platform designed to help
          students explore career paths, share knowledge, stay updated with trends,
          and make smarter academic and professional decisions.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Target className="text-indigo-600" />
            Our Mission
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Our mission is to bridge the gap between education and industry by
            providing students with real-time insights, AI-driven guidance, and
            a collaborative community platform where knowledge flows freely.
          </p>
          <p className="text-slate-600 mt-4 leading-relaxed">
            We aim to empower students to confidently choose career paths,
            improve technical skills, and make data-driven decisions about their future.
          </p>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-3xl shadow">
          <h3 className="font-semibold text-lg mb-3 text-indigo-600">
            Why EduPortal?
          </h3>
          <ul className="space-y-3 text-slate-700">
            <li>✔ AI-powered intelligent replies</li>
            <li>✔ Career scope prediction model (ML-based)</li>
            <li>✔ Community-driven learning feed</li>
            <li>✔ Real-time trend awareness</li>
            <li>✔ Clean, scalable SaaS architecture</li>
          </ul>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-10 text-center">
          Core Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <Brain className="text-indigo-600 mb-4" size={32} />
            <h3 className="font-semibold text-lg mb-2">
              AI Interaction
            </h3>
            <p className="text-slate-600 text-sm">
              Ask questions directly in posts and receive intelligent AI-generated
              responses to guide your learning journey.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <TrendingUp className="text-indigo-600 mb-4" size={32} />
            <h3 className="font-semibold text-lg mb-2">
              Latest Trends
            </h3>
            <p className="text-slate-600 text-sm">
              Stay updated with emerging technologies, career paths, and
              industry demands to remain competitive.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <Users className="text-indigo-600 mb-4" size={32} />
            <h3 className="font-semibold text-lg mb-2">
              Community Learning
            </h3>
            <p className="text-slate-600 text-sm">
              Share insights, post ideas, comment, and collaborate with
              like-minded learners in an interactive feed.
            </p>
          </div>

        </div>
      </div>

      {/* Vision Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl p-12 text-center shadow-lg">
        <Sparkles size={36} className="mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">
          Our Vision
        </h2>
        <p className="max-w-3xl mx-auto text-indigo-100 leading-relaxed">
          We envision EduPortal becoming a next-generation educational ecosystem
          where AI, community collaboration, and predictive analytics work together
          to guide students toward successful and fulfilling careers.
        </p>
      </div>

    </div>
  );
};

export default About;
