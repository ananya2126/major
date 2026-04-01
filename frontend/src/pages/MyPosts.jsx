import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PostCard from "../components/PostCard";
import { Sparkles, Plus, PenSquare, Loader2 } from "lucide-react";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [askAI, setAskAI] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // ✅ delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchMyPosts();
  }, [navigate]);

  const fetchMyPosts = async () => {
    try {
      const res = await api.get("/user/posts");
      const sorted = res.data.sort(
        (a, b) => new Date(b.postedAt) - new Date(a.postedAt)
      );
      setPosts(sorted);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch posts", err);
      setError("Failed to load your posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!content.trim()) return;

    try {
      const res = await api.post("/user/create-post", {
        content,
        mentions: askAI,
      });

      setPosts((prev) => [res.data, ...prev]);
      setContent("");
      setAskAI(false);
      setError(null);
    } catch (err) {
      console.error("Failed to create post", err);
      setError("Failed to create post. Please try again.");
    }
  };

  const handleAddComment = async (postId) => {
    const message = commentInputs[postId];
    if (!message?.trim()) return;

    await api.post(
      `/user/comment?pid=${postId}&message=${encodeURIComponent(message)}`
    );

    setCommentInputs({ ...commentInputs, [postId]: "" });
    fetchMyPosts();
  };
   // ✅ open modal instead of window.confirm
  const handleDeletePost = (postId) => {
    setDeleteId(postId);
    setShowDeleteModal(true);
  };

  // ✅ confirm delete
  const confirmDelete = async () => {
    try {
      await api.delete(`/user/posts/${deleteId}`);
      setPosts((prev) => prev.filter((p) => p.id !== deleteId));
      setError(null);
    } catch {
      setError("Failed to delete post.");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">My Posts</h1>
          <p className="text-slate-600">Manage and view your posts</p>
        </div>

        {/* Create Post */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 mb-10">
          <textarea
            className="w-full rounded-xl p-4 bg-slate-50 border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="What's on your mind?"
            rows="3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setAskAI(!askAI)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                askAI
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
            <Sparkles size={16} />
            {askAI ? "DEVIKA will reply ✨" : "Ask DEVIKA"}
          </button>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleCreatePost}
            className="px-6 py-2 rounded-xl flex items-center gap-2 bg-indigo-600 text-white"
          >
            <Plus size={18} />
            Post
          </button>
        </div>
      </div>

        {/* Posts */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-6 text-slate-600 text-lg">Loading your posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-slate-600 mb-4">{error}</p>
            <button
              onClick={fetchMyPosts}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-slate-600">No posts yet. Create your first post!</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  commentInputs={commentInputs}
                  setCommentInputs={setCommentInputs}
                  handleAddComment={handleAddComment}
                  showDelete={true} 
                  handleDeletePost={handleDeletePost}// ✅ ONLY MyPosts shows delete
                />
              ))
            )}
          </div>
        )}
      </div>
            {/* ✅ CENTER DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Delete post?
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-rose-500 text-white hover:bg-rose-600 shadow-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPosts;
