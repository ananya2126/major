import React from "react";
import { Send, MessageCircle, CornerDownRight, Sparkles, Share2, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

const PostCard = ({
  post,
  commentInputs,
  setCommentInputs,
  handleAddComment,
  highlightPost,
  highlightComment,
  handleDeletePost,
  showDelete = false, // ✅ NEW (default hidden)
}) => {
  const initials = post.username
    ? post.username.slice(0, 2).toUpperCase()
    : "??";

  const colors = [
    "from-indigo-400 to-indigo-600",
    "from-purple-400 to-purple-600",
    "from-cyan-400 to-cyan-600",
    "from-rose-400 to-rose-600",
    "from-emerald-400 to-emerald-600",
    "from-orange-400 to-orange-600",
  ];
  const colorIdx = post.username
    ? post.username.charCodeAt(0) % colors.length
    : 0;

  return (
    <article
      id={`post-${post.id}`}
      className={`bg-white rounded-2xl border transition-all duration-500 ${
        highlightPost === post.id
          ? "border-indigo-300 shadow-lg shadow-indigo-100 ring-2 ring-indigo-100"
          : "border-slate-100 shadow-sm hover:shadow-md"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <div
          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colors[colorIdx]} flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0`}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-slate-900 truncate">
            @{post.username}
          </h4>
          <p className="text-[11px] text-slate-400">
            {new Date(post.postedAt).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-4">
        <p className="text-slate-700 text-sm leading-relaxed">{post.content}</p>

        {/* AI Reply */}
        {post.aiReply && (
          <div className="mt-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2.5 py-0.5 rounded-full">
                <Sparkles size={11} />
                <span className="text-[10px] font-bold">DEVIKA AI</span>
              </div>
            </div>
            <div className="prose prose-sm max-w-none prose-p:my-1 prose-p:text-slate-600 prose-li:my-0.5 prose-headings:mt-3 prose-headings:text-slate-800 text-slate-600">
              <ReactMarkdown>{post.aiReply}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Comments */}
      {post.comments?.length > 0 && (
        <div className="px-5 pb-3 space-y-2 border-t border-slate-50 pt-3">
          {post.comments.map((comment) => (
            <div
              key={comment.id}
              className={`flex gap-2 transition rounded-lg ${
                highlightComment === comment.id
                  ? "bg-yellow-50 px-2 py-1"
                  : ""
              }`}
            >
              <CornerDownRight
                size={14}
                className="text-slate-300 mt-0.5 flex-shrink-0"
              />
              <div>
                <span className="text-indigo-600 text-xs font-bold">
                  @{comment.username}
                </span>{" "}
                <span className="text-xs text-slate-600">
                  {comment.message}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment Input */}
      <div className="px-5 pb-4 pt-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Write a comment…"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            value={commentInputs[post.id] || ""}
            onChange={(e) =>
              setCommentInputs({
                ...commentInputs,
                [post.id]: e.target.value,
              })
            }
            onKeyDown={(e) =>
              e.key === "Enter" && handleAddComment(post.id)
            }
          />
          <button
            onClick={() => handleAddComment(post.id)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-sm hover:shadow-md transition-all hover:scale-105"
          >
            <Send size={15} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <MessageCircle size={13} />
            {post.comments?.length || 0} comments
          </span>

          <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
            <Share2 size={13} />
            Share
          </button>
        </div>

        {/* ✅ DELETE BUTTON — ONLY WHEN ALLOWED */}
        {showDelete && (
          <button
            onClick={() => handleDeletePost(post.id)}
            className="flex items-center gap-1.5 text-rose-500 hover:text-rose-600 font-medium transition-all hover:scale-105"
          >
            <Trash2 size={13} />
            Delete
          </button>
        )}
      </div>
    </article>
  );
};

export default PostCard;