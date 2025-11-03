// src/components/Comment/CommentsList.jsx
import Comment from "./commentCard";
import { MessageCircle } from "lucide-react";

const CommentsList = ({
  comments,
  postId,
  onVote,
  onReply,
  currentUserId,
  isPostAuthor,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#2b2b2b] rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[#2b2b2b] rounded w-1/4"></div>
                <div className="h-3 bg-[#2b2b2b] rounded w-3/4"></div>
                <div className="h-3 bg-[#2b2b2b] rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">
          Aucun commentaire pour le moment. Soyez le premier à participer à la
          discussion !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          postId={postId}
          onVote={onVote}
          onReply={onReply}
          currentUserId={currentUserId}
          isPostAuthor={isPostAuthor}
        />
      ))}
    </div>
  );
};

export default CommentsList;
