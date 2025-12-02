import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchPost,
  updatePost,
  deletePost,
  markPostAsSolved,
  unmarkPostAsSolved,
} from "../services/postServices";
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from "../services/commentServices";
import {
  voteOnPost,
  voteOnComment,
  getPostUserVote,
} from "../services/voteServices";
import {
  ArrowLeft,
  Share,
  Flag,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import CommentsList from "../components/commentList";
import CommentForm from "../components/commentForm";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [postScore, setPostScore] = useState(0);

  useEffect(() => {
    const loadUserVoteForPost = async () => {
      try {
        const vote = await getPostUserVote(id);
        setUserVote(vote);
      } catch (error) {
        console.error(error);
      }
    };

    loadUserVoteForPost();
  }, [id]);

  // Fetch post and comments
  useEffect(() => {
    if (!authLoading) {
      loadPost();
      loadComments();
    }
  }, [id, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6953FF] mx-auto"></div>
            <p className="mt-4 text-gray-400">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const postData = await fetchPost(id);
      setPost(postData);
      setPostScore(postData.score || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      setCommentsLoading(true);
      setCommentsError("");
      const commentsData = await fetchComments(id);
      setComments(commentsData.comments);
    } catch (err) {
      setCommentsError(err.message);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleSubmitComment = async (content, parentCommentId = null) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      const newComment = await createComment(id, content, parentCommentId);

      // Add new comment to state
      if (parentCommentId) {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === parentCommentId
              ? {
                  ...comment,
                  replies: [...(comment.replies || []), newComment],
                }
              : comment,
          ),
        );
      } else {
        setComments((prev) => [newComment, ...prev]);
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
      setCommentsError(err.message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };
  const handlePostVote = async (voteType) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const result = await voteOnPost(id, voteType);

      // Update both score and user vote state
      setPostScore(result.newScore);
      setUserVote(result.userVote);
    } catch (err) {
      console.error("Error voting on post:", err);
      setError(err.message);
    }
  };

  
  const handleCommentVote = async (commentId, voteValue) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const result = await voteOnComment(commentId, voteValue);

      // Update comment score in state
      const updateCommentScore = (comments, targetId, newScore) => {
        return comments.map((comment) => {
          if (comment.id === targetId) {
            return { ...comment, score: newScore }; // Fixed: should be 'score' not 'scores'
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: updateCommentScore(comment.replies, targetId, newScore),
            };
          }
          return comment;
        });
      };

      setComments((prev) =>
        updateCommentScore(prev, commentId, result.newScore),
      );
    } catch (err) {
      console.error("Error voting on comment:", err);
      setCommentsError(err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes < 1 ? "À l'instant" : `Il y a ${diffInMinutes}min`;
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)}h`;
    } else if (diffInDays < 7) {
      return `Il y a ${Math.floor(diffInDays)}j`;
    } else {
      const options =
        window.innerWidth < 768
          ? { day: "numeric", month: "short" } // Mobile: "25 oct."
          : { day: "numeric", month: "long", year: "numeric" }; // Desktop: "25 octobre 2024"

      return date.toLocaleDateString("fr-FR", options);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white p-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button skeleton */}
          <div className="h-6 bg-[#2b2b2b] rounded w-32 mb-6 animate-pulse"></div>

          {/* Post skeleton */}
          <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg p-6 mb-6 animate-pulse">
            <div className="h-8 bg-[#2b2b2b] rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-[#2b2b2b] rounded w-1/2 mb-6"></div>
            <div className="space-y-2 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-[#2b2b2b] rounded"></div>
              ))}
            </div>
            <div className="h-10 bg-[#2b2b2b] rounded"></div>
          </div>

          {/* Comments skeleton */}
          <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-[#2b2b2b] rounded w-48 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 bg-[#2b2b2b] rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#2b2b2b] rounded w-1/4"></div>
                    <div className="h-3 bg-[#2b2b2b] rounded w-3/4"></div>
                    <div className="h-3 bg-[#2b2b2b] rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white p-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/community"
            className="inline-flex items-center gap-2 text-[#6953FF] hover:text-[#5a47e0] mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour à la communauté</span>
            <span className="sm:hidden">Retour</span>
          </Link>
          <div className="text-center py-12">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">
              {error || "Discussion non trouvée"}
            </h1>
            <p className="text-gray-400 mb-6 text-sm sm:text-base">
              {error
                ? "Une erreur est survenue"
                : "Cette discussion n'existe pas ou a été supprimée"}
            </p>
            <Link
              to="/community"
              className="bg-[#6953FF] hover:bg-[#5a47e0] text-white px-6 py-2 rounded-lg font-medium text-sm sm:text-base"
            >
              Retour à la communauté
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Link
            to="/community"
            className="inline-flex items-center gap-2 text-[#6953FF] hover:text-[#5a47e0] text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour à la communauté</span>
            <span className="sm:hidden">Retour</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              className="p-2 hover:bg-[#2b2b2b] rounded-lg transition-colors"
              title="Partager"
            >
              <Share className="w-4 h-4" />
            </button>
            <button
              className="p-2 hover:bg-[#2b2b2b] rounded-lg transition-colors"
              title="Signaler"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Post */}
        <article className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          {/* Post Header - Mobile optimized */}
          <div className="flex flex-row items-start sm:justify-between gap-3 mb-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-tight">
                {post.title}
              </h1>

              {/* Author & Metadata - Stack on mobile */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-400">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4 text-white" />
                    <span className="font-medium text-white">
                      {post.author || "Utilisateur"}
                    </span>
                  </div>
                  <span className="hidden sm:inline text-gray-500">•</span>
                  <span>{formatDate(post.date)}</span>
                </div>
              </div>
            </div>

            {/* Resolved Status */}
            <div
              className={`hidden sm:flex items-center gap-2 text-xs sm:text-sm px-3 py-1 rounded-full border ${
                post.isResolved
                  ? "bg-green-900/30 text-green-400 border-green-900/50"
                  : "bg-red-900/30 text-red-400 border-red-900/50"
              }`}
            >
              {post.isResolved ? (
                <>
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="inline">Résolue</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="inline">Non résolue</span>
                </>
              )}
            </div>
          </div>

          {/* Tags - Wrap properly on mobile */}
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
            {Array.isArray(post.tags) &&
              post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 sm:px-3 py-1 bg-gray-900/30 text-gray-400 text-xs rounded-full border border-gray-700/50"
                >
                  {tag}
                </span>
              ))}
          </div>

          {/* Post Content */}
          <div className="mb-4 sm:mb-6">
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
              {post.description}
            </p>

            {post.imageUrl && (
              <div className="mt-4">
                <img
                  src={post.imageUrl}
                  alt="Post attachment"
                  className="max-w-full h-auto rounded-lg border border-[#2b2b2b]"
                />
              </div>
            )}
          </div>

          {/* Post Stats and Actions - Mobile optimized */}
          <div className="flex items-center justify-between pt-4 border-t border-[#2b2b2b]">
            <div className="flex items-center gap-4 sm:gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Upvote Button */}
                <button
                  onClick={() => handlePostVote(1)}
                  className={`flex items-center gap-1 transition-colors ${
                    userVote === 1
                      ? "text-green-400"
                      : "hover:text-green-400 text-gray-400"
                  }`}
                >
                  <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Score Display */}
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    postScore > 0
                      ? "text-green-400"
                      : postScore < 0
                        ? "text-red-400"
                        : "text-gray-300"
                  }`}
                >
                  {postScore}
                </span>

                {/* Downvote Button */}
                <button
                  onClick={() => handlePostVote(-1)}
                  className={`flex items-center gap-1 transition-colors ${
                    userVote === -1
                      ? "text-red-400"
                      : "hover:text-red-400 text-gray-400"
                  }`}
                >
                  <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">
                  {comments.length} commentaires
                </span>
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <section className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
            Commentaires ({comments.length})
          </h2>

          {/* Comment Form for top-level comments */}
          <div className="mb-6 sm:mb-8">
            <CommentForm
              onSubmit={(content) => handleSubmitComment(content, null)}
              submitting={submitting}
            />
          </div>

          {/* Comments Error */}
          {commentsError && (
            <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-4 rounded-lg mb-6 text-sm">
              {commentsError}
            </div>
          )}

          {/* Comments List */}
          <CommentsList
            comments={comments}
            postId={id}
            onVote={handleCommentVote} // Now uses the fixed handler
            onReply={handleSubmitComment}
            currentUserId={user?.id}
            isPostAuthor={post?.authorId === user?.id}
            loading={commentsLoading}
          />
        </section>
      </div>
    </div>
  );
};

export default PostDetailPage;
