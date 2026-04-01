import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  BellRing,
  CheckCircle2,
  MessageSquare,
  Sparkles,
} from "lucide-react";

const Notifications = () => {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    // Fetch notifications
    api
      .get("/user/notifications")
      .then((res) => {
        setNotifs(res.data);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to fetch notifications", err);
        setLoading(false);
        setError("Failed to load notifications.");
      });
  }, [navigate]);

  const handleClick = (n) => {
    navigate("/feed", {
      state: {
        postId: n.pid,
        commentId: n.cid,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 pb-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Activity
            </h1>
            <p className="text-slate-500 font-medium">
              Stay updated with your network
            </p>
          </div>

          <div className="bg-indigo-600/10 text-indigo-600 px-4 py-2 rounded-2xl font-bold text-sm flex items-center gap-2">
            <Sparkles size={16} /> {notifs.length} New
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-6 text-slate-600 text-lg">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-slate-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Reload
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {notifs.map((n) => (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                className="group hover:bg-white transition-all duration-300 p-5 rounded-3xl flex items-start gap-4 cursor-pointer bg-white shadow-sm border border-slate-100 hover:shadow-lg"
              >
                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform">
                  <MessageSquare size={20} />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-slate-800 font-semibold">
                      {n.message}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Just now
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold">
                      Post #{n.pid}
                    </span>
                    <span className="text-[11px] text-indigo-500 font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Delivered
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {!loading && notifs.length === 0 && (
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200 shadow-lg">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BellRing size={32} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  All caught up!
                </h3>
                <p className="text-slate-400">
                  No new notifications.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
