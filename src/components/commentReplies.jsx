// src/components/Comment/CommentReplies.jsx
import Comment from "./commentCard";

const CommentReplies = ({
  replies,
  postId,
  onVote,
  onReply,
  currentUserId,
  isExpanded,
}) => {
  if (!isExpanded) return null;

  return (
    <div className="mt-4 space-y-4 border-l-2 border-gray-700 ml-4 pl-4">
      {replies.map((reply) => (
        <Comment
          key={reply.id}
          comment={reply}
          postId={postId}
          onVote={onVote}
          onReply={onReply}
          currentUserId={currentUserId}
          isPostAuthor={false} // Replies can't be marked as best answer
          showReplies={false} // No nested replies for now
        />
      ))}
    </div>
  );
};

export default CommentReplies;
