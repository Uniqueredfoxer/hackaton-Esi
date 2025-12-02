import Comment from "./commentCard";

const CommentReplies = ({
  replies,
  postId,
  onVote,
  onReply,
  onEdit,
  onDelete,
  currentUserId,
}) => {


  return (
    <div className="mt-4 border-l-2 border-gray-600 pl-2">
      {replies.map((reply) => (
        <Comment
          key={reply.id}
          comment={reply}
          postId={postId}
          onVote={onVote}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

export default CommentReplies;
