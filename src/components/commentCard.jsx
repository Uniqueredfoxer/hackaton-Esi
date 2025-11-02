// src/components/Comment/Comment.jsx
import { useState } from "react";
import { MoreVertical, User, Edit3, Trash2 } from "lucide-react";
import CommentActions from "./commentActions";
import CommentReplies from "./commentReplies";
import CommentForm from "./commentForm";

const Comment = ({
  comment,
  postId,
  onVote,
  onReply,
  onEdit,
  onDelete,
  currentUserId,
  isPostAuthor,
  showReplies = true,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showRepliesList, setShowRepliesList] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isCommentAuthor = currentUserId === comment.author_id;

  const handleVote = async (voteValue) => {
    try {
      await onVote(comment.id, voteValue);
    } catch (error) {
      console.error("Vote error:", error);
    }
  };

  const handleReply = async (content) => {
    try {
      await onReply(comment.id, content);
      setShowReplyForm(false);
      setShowRepliesList(true);
    } catch (error) {
      console.error("Reply error:", error);
      throw error;
    }
  };

  const handleEdit = async () => {
    try {
      await onEdit(comment.id, editContent);
      setIsEditing(false);
      setShowMenu(false);
    } catch (error) {
      console.error("Edit error:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      try {
        await onDelete(comment.id);
        setShowMenu(false);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
    setShowMenu(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return "À l'instant";
    } else if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes}min`;
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else if (diffInDays < 7) {
      return `Il y a ${diffInDays}j`;
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  };

  return (
    <div className="border-l-2 pl-4">
      {/* Comment Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3 justify-between w-full">
          <div className="flex items-center gap-2">
            {/* Generic User Icon */}
            <div className="w-8 h-8 bg-blue-800/40 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-blue-300" />
            </div>
            {/* Username */}
            <span className="font-medium text-white text-sm">
              {comment.author || "User"}
            </span>
          </div>
          {/* Date */}
          <span className="text-xs text-gray-400 pr-4">
            {formatDate(comment.postedAt)}
          </span>
        </div>

        {/* Three-dot Menu */}
        {isCommentAuthor && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-[#2b2b2b] rounded transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400 mt-1" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-6 bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg shadow-lg z-10 min-w-[120px]">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-[#2b2b2b] transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Modifier
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-[#2b2b2b] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comment Content - Edit Mode */}
      {isEditing ? (
        <div className="mb-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-20 bg-[#2b2b2b] border border-[#3d3d3d] rounded-lg p-3 text-white resize-none focus:outline-none focus:border-[#6953FF] text-sm"
            autoFocus
          />
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={handleEdit}
              disabled={!editContent.trim()}
              className="bg-[#6953FF] hover:bg-[#5a47e0] disabled:bg-[#2b2b2b] disabled:text-gray-500 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              Enregistrer
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-[#2b2b2b] hover:bg-[#3d3d3d] text-gray-300 px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        /* Comment Content - View Mode */
        <div className="mb-3">
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>
      )}

      {/* Comment Actions - Hide when editing */}
      {!isEditing && (
        <CommentActions
          scores={comment.scores}
          replyCount={comment.replies?.length || 0}
          onVote={handleVote}
          onReply={() => setShowReplyForm(!showReplyForm)}
          onToggleReplies={() => setShowRepliesList(!showRepliesList)}
          showReplies={showRepliesList}
        />
      )}

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-4 ml-4">
          <CommentForm
            onSubmit={handleReply}
            onCancel={() => setShowReplyForm(false)}
            placeholder={`Répondre à ${comment.author.username}...`}
            autoFocus
          />
        </div>
      )}

      {/* Replies */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <CommentReplies
          replies={comment.replies}
          postId={postId}
          onVote={onVote}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          currentUserId={currentUserId}
          isExpanded={showRepliesList}
        />
      )}
    </div>
  );
};

export default Comment;
