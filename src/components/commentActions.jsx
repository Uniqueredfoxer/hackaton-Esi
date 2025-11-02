// src/components/Comment/CommentActions.jsx
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const CommentActions = ({
  scores,
  replyCount,
  onVote,
  onReply,
  onToggleReplies,
  showReplies,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 text-sm text-gray-400">
        {/* Voting */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onVote(1)}
            className="p-1 hover:text-green-400 transition-colors"
            title="Upvote"
          >
            <ThumbsUp className="w-4 h-4" />
          </button>

          <span
            className={`font-medium min-w-8 text-center ${
              scores > 0
                ? "text-green-400"
                : scores < 0
                  ? "text-red-400"
                  : "text-gray-400"
            }`}
          >
            {scores}
          </span>

          <button
            onClick={() => onVote(-1)}
            className="p-1 hover:text-red-400 transition-colors"
            title="Downvote"
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>

        {/* Reply Button */}
        <button
          onClick={onReply}
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Répondre</span>
        </button>

        {/* Toggle Replies */}
        {replyCount > 0 && (
          <button
            onClick={onToggleReplies}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            {showReplies ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            <span>
              {replyCount} réponse{replyCount > 1 ? "s" : ""}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentActions;
