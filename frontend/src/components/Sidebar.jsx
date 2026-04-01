import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Home,
    User,
    TrendingUp,
    MessageCircle,
    BarChart3,
    LogOut,
    LogIn,
    UserCircle,
    BookOpen,
    Brain
} from "lucide-react";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isAuth = !!localStorage.getItem("token");

    const isActive = (path) =>
        location.pathname === path
            ? "bg-indigo-100 text-indigo-600"
            : "text-slate-600 hover:bg-slate-100";

    const handleLogout = () => {
        localStorage.clear();
        window.dispatchEvent(new Event('authChange'));
        navigate("/");
    };

    return (
        <aside className="fixed left-0 top-0 h-full w-72 bg-white border-r shadow-sm pt-20 px-3 flex flex-col justify-between">

            {/* TOP SECTION */}
            <div className="space-y-2">

                <Link
                    to="/feed"
                    className={`flex items-center gap-3 p-3 rounded-xl transition ${isActive("/feed")}`}
                >
                    <Home size={18} />
                    <span className="font-medium">Explore</span>
                </Link>

                <Link
                    to="/myposts"
                    className={`flex items-center gap-3 p-3 rounded-xl transition ${isActive("/myposts")}`}
                >
                    <User size={18} />
                    <span className="font-medium">My Posts</span>
                </Link>

                <Link
                    to="/trends"
                    className={`flex items-center gap-3 p-3 rounded-xl transition ${isActive("/trends")}`}
                >
                    <TrendingUp size={18} />
                    <span className="font-medium">Latest Trends</span>
                </Link>

                <Link
                    to="/chat-ai"
                    className={`flex items-center gap-3 p-3 rounded-xl transition ${isActive("/chat-ai")}`}
                >
                    <MessageCircle size={18} />
                    <span className="font-medium">Chat with AI</span>
                </Link>

                <Link
                    to="/predict"
                    className={`flex items-center gap-3 p-3 rounded-xl transition ${isActive("/predict")}`}
                >
                    <BarChart3 size={18} />
                    <span className="font-medium">Screener</span>
                </Link>

                <Link
                    to="/career"
                    className={`flex items-center gap-3 p-3 rounded-xl transition ${isActive("/career")}`}
                >
                    <BarChart3 size={18} />
                    <span className="font-medium">Career AI</span>
                </Link>

                <Link
                    to="/prepare"
                    className={`flex items-center gap-3 p-3 rounded-xl transition ${isActive("/prepare")}`}
                >
                    <BookOpen size={18} />
                    <span className="font-medium">Prepare</span>
                </Link>
                <Link
                    to="/quiz"
                    className={`flex items-center gap-3 p-3 rounded-xl transition ${isActive("/quiz")}`}
                >
                    <Brain size={18} />
                    <span className="font-medium">Quiz</span>
                </Link>
            </div>

            {/* BOTTOM SECTION */}
            <div className="border-t pt-4 space-y-2">

                {isAuth ? (
                    <>
                        {/* Profile */}
                        <Link
                            to="/profile"
                            className={`flex items-center gap-3 p-3 rounded-xl transition ${isActive("/profile")}`}
                        >
                            <UserCircle size={18} />
                            <span className="font-medium">Profile</span>
                        </Link>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 p-3 rounded-xl text-rose-600 hover:bg-rose-50 transition"
                        >
                            <LogOut size={18} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="flex items-center gap-3 p-3 rounded-xl text-indigo-600 hover:bg-indigo-50 transition"
                    >
                        <LogIn size={18} />
                        <span className="font-medium">Login</span>
                    </Link>
                )}

            </div>

        </aside>
    );
};

export default Sidebar;
