import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PostCard from "../components/PostCard";
import { useLocation } from "react-router-dom";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [activePost, setActivePost] = useState(null);
  const [activeComment, setActiveComment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const highlightPostId = location.state?.postId;
  const highlightCommentId = location.state?.commentId;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/user/feed");
      const sorted = res.data.sort(
        (a, b) => new Date(b.postedAt) - new Date(a.postedAt)
      );
      setPosts(sorted);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch posts", err);
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Highlight logic
  useEffect(() => {
    if (highlightPostId) {
      setActivePost(highlightPostId);
      setActiveComment(highlightCommentId);

      setTimeout(() => {
        setActivePost(null);
        setActiveComment(null);
      }, 3000);

      setTimeout(() => {
        const element = document.getElementById(
          `post-${highlightPostId}`
        );
        element?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 200);
    }
  }, [highlightPostId, highlightCommentId]);

  const handleAddComment = async (postId) => {
    const message = commentInputs[postId];
    if (!message?.trim()) return;

    await api.post(
      `/user/comment?pid=${postId}&message=${encodeURIComponent(message)}`
    );

    setCommentInputs({ ...commentInputs, [postId]: "" });
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Explore Feed</h1>
          <p className="text-slate-600">Discover posts from your community</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-6 text-slate-600 text-lg">Loading your feed...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-slate-600 mb-4">{error}</p>
            <button
              onClick={fetchPosts}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                commentInputs={commentInputs}
                setCommentInputs={setCommentInputs}
                handleAddComment={handleAddComment}
                highlightPost={activePost}
                highlightComment={activeComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
