import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyPosts from "./pages/MyPosts";
import Trends from "./pages/Trends";
import ChatAI from "./pages/ChatAI";
import PredictScope from "./pages/PredictScope";
import About from "./pages/About";
import HowToUse from "./pages/HowToUse";
import Preparation from "./pages/Preparation";
import Quiz from "./pages/Quiz";
import Landing from "./pages/Landing";
import CareerRecommend from "./pages/CareerRecommend";

function AppContent() {
  const location = useLocation();

  // Auth state
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  // Routes where layout should be hidden
  const hiddenRoutes = ["/", "/landing", "/login", "/signup","/about"];

  // Show layout only if current route is NOT in hiddenRoutes
  const showLayout = !hiddenRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      {showLayout && <Navbar />}

      {/* Sidebar */}
      {showLayout && <Sidebar />}

      {/* Main Content */}
      <div className={showLayout ? "ml-64 pt-20 px-4 pb-10" : ""}>
        <Routes>

          {/* Public Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected / Main Pages */}
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/prepare" element={<Preparation />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/chat-ai" element={<ChatAI />} />
          <Route path="/predict" element={<PredictScope />} />
          <Route path="/career" element={<CareerRecommend />} />

          <Route path="/about" element={<About />} />
          <Route path="/how-to-use" element={<HowToUse />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <h1 className="text-center text-3xl mt-20 font-semibold">
                404 - Page Not Found
              </h1>
            }
          />

        </Routes>
      </div>

      {/* Footer */}
      {showLayout && <Footer />}

    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

