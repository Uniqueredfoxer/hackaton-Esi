// src/components/Comment/CommentActions.jsx
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
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
  loadingReplies = false,
  
}) => {
  

  return (
  <div className="flex flex-col gap-2 ">
    <div className="flex items-center justify-between text-gray-400">
      {/* Vote buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onVote(1)}
          className="p-1 hover:text-green-400 transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
        </button>
        <span className="text-xs font-medium min-w-[20px] text-center">
          {scores || 0}
        </span>
        <button
          onClick={() => onVote(-1)}
          className="p-1 hover:text-red-400 transition-colors"
        >
          <ThumbsDown className="w-4 h-4" />
        </button>
      </div>

      {/* Reply button */}
      <button
        onClick={onReply}
        className="flex items-center gap-1 p-1 hover:text-white transition-colors text-xs"
      >
        <MessageCircle className="w-4 h-4" />
        Répondre
      </button>

    </div>
      <button
        onClick={onToggleReplies}
        disabled={loadingReplies}
        className="flex items-center gap-1 p-1 hover:text-white transition-colors disabled:opacity-50 text-xs text-[#6953FF]"
      >
        {loadingReplies ? (
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#6953FF]"></div>
        ) : showReplies ? (
          <>
            <ChevronUp className="w-4 h-4" />
            <span>Masquer les réponses</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            <span>Voir les réponses({replyCount})</span>
          </>
        )}
      </button>
  </div>
  );
};

export default CommentActions;
