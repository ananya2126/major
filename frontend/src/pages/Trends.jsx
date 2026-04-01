import React, { useState } from "react";
import api from "../services/api";
import {
  TrendingUp,
  Zap,
  BookOpen,
  Target,
  Award,
  Rocket,
  Code,
  Clock,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  Loader,
  Plus
} from "lucide-react";

const Trends = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [customDomain, setCustomDomain] = useState("");
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const courses = [
    { id: "web-development", name: "Web Development", icon: <Code size={24} /> },
    { id: "data-science", name: "Data Science", icon: <TrendingUp size={24} /> },
    { id: "cloud-computing", name: "Cloud Computing", icon: <Zap size={24} /> },
    { id: "ai-ml", name: "AI & Machine Learning", icon: <Lightbulb size={24} /> },
    { id: "devops", name: "DevOps", icon: <Rocket size={24} /> },
    { id: "cybersecurity", name: "Cybersecurity", icon: <Target size={24} /> },
  ];

  const handleCourseSelect = async (courseId) => {
    setSelectedCourse(courseId);
    setCustomDomain("");
    setLoading(true);
    setError(null);

    const courseName = courses.find((c) => c.id === courseId)?.name || courseId;
    await fetchTrends(courseName);
  };

  const handleCustomDomainSubmit = async (e) => {
    e.preventDefault();
    if (!customDomain.trim()) {
      setError("Please enter a domain name");
      return;
    }

    setSelectedCourse(null);
    setLoading(true);
    setError(null);
    await fetchTrends(customDomain.trim());
  };

  const fetchTrends = async (courseName) => {
    try {
      const response = await api.post("/ai/latest-trends", {
        course: courseName,
      });

      console.log("API Response:", response.data);

      let data;
      try {
        data = JSON.parse(response.data.trends);
        console.log("Parsed trends data:", data);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        setError("Failed to parse trends data. Please try again.");
        setLoading(false);
        return;
      }

      if (!data.trending_domains || !data.technologies || !data.roadmap) {
        setError("Invalid trends data structure. Please try again.");
        setLoading(false);
        return;
      }

      setTrendsData(data);
    } catch (err) {
      console.error("Error fetching trends:", err);
      setError("Failed to fetch trends. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="text-indigo-600" size={32} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Latest Trends & Roadmap
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore trending domains, technologies, and career paths for your chosen field
          </p>
        </div>

        {!trendsData ? (
          <>
            {/* Course Selection */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Select a Course to Explore Trends
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => handleCourseSelect(course.id)}
                    disabled={loading}
                    className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white mb-4 w-fit mx-auto">
                      {course.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {course.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-2 flex items-center gap-2 justify-center">
                      Explore <ArrowRight size={16} />
                    </p>
                  </button>
                ))}
              </div>

              {/* Custom Domain Input */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                  Explore Custom Domain
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Can't find your domain? Type any custom domain to explore trends and learning paths
                </p>
                <form
                  onSubmit={handleCustomDomainSubmit}
                  className="flex gap-3 max-w-lg mx-auto"
                >
                  <input
                    type="text"
                    placeholder="e.g., Blockchain, IoT, Game Dev, Cybersecurity..."
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Explore
                  </button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Back Button and Title */}
            <div className="mb-8">
              <button
                onClick={() => {
                  setTrendsData(null);
                  setSelectedCourse(null);
                }}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold mb-4 transition-colors"
              >
                <ArrowRight size={18} className="rotate-180" />
                Back to Courses
              </button>
              <h2 className="text-3xl font-bold text-gray-800">
                {trendsData.course} - Latest Trends & Roadmap
              </h2>
            </div>

            {/* Trending Domains */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Zap className="text-yellow-500" size={28} />
                Trending Domains
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                {trendsData.trending_domains?.map((domain, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border-2 border-yellow-200 hover:shadow-lg transition-all duration-200"
                  >
                    <p className="font-semibold text-gray-800">{domain}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Code className="text-blue-500" size={28} />
                Technologies in Demand
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                {trendsData.technologies?.map((tech, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all duration-200"
                  >
                    <p className="font-semibold text-gray-800">{tech}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools & Frameworks */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Rocket className="text-red-500" size={28} />
                Essential Tools & Frameworks
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                {trendsData.tools?.map((tool, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border-2 border-red-200 hover:shadow-lg transition-all duration-200"
                  >
                    <p className="font-semibold text-gray-800">{tool}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Roadmap */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <BookOpen className="text-green-500" size={28} />
                Learning Roadmap: Beginner to Expert
              </h3>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-600"></div>

                {/* Roadmap Steps */}
                <div className="space-y-8">
                  {trendsData.roadmap?.map((step, idx) => (
                    <div key={idx} className="relative pl-24">
                      {/* Timeline Dot */}
                      <div className="absolute left-0 w-16 h-16 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg border-4 border-white shadow-lg">
                          {idx + 1}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-indigo-200 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-bold text-gray-800">
                            {step.step}
                          </h4>
                          {step.duration && (
                            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full text-sm font-semibold text-indigo-600">
                              <Clock size={14} />
                              {step.duration}
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Career Roles */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Award className="text-purple-500" size={28} />
                Career Roles & Opportunities
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {trendsData.career_roles?.map((role, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl border-2 border-purple-200 flex items-center gap-3 hover:shadow-lg transition-all duration-200"
                  >
                    <CheckCircle className="text-purple-600" size={24} />
                    <p className="font-semibold text-gray-800">{role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Future Scope */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl shadow-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Lightbulb size={28} />
                Future Scope & Opportunities
              </h3>
              <p className="text-lg leading-relaxed">
                {trendsData.future_scope}
              </p>
            </div>
          </>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="animate-spin text-indigo-600" size={48} />
            <p className="text-gray-600 mt-4 text-lg">Fetching latest trends...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 text-center">
            <p className="text-red-700 font-semibold text-lg">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trends;
