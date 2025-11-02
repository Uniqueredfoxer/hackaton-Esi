// src/components/QuestionCard.jsx
import { Link } from "react-router-dom";
import {
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  User,
  XCircle,
} from "lucide-react";
import { voteOnPost, getUserVote } from "../services/voteServices";
import { useState } from "react";

const QuestionCard = ({ post }) => {
  const [isVoting, setIsVoting] = useState(false);
  const [currentScore, setCurrentScore] = useState(post.scores || 0);
  const [userVote, setUserVote] = useState(null); // null, 1 (up), or -1 (down)
  const [optimisticScore, setOptimisticScore] = useState(post.scores || 0);

  const {
    id,
    title,
    description,
    tags,
    isResolved,
    commentsNumber,
    date,
    author,
  } = post;

  const authorName = author || "Utilisateur";

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const options = { day: "numeric", month: "short" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const handleVote = async (voteType) => {
    if (isVoting) return;

    // Immediate UI update (optimistic update)
    const previousVote = userVote;
    const previousScore = currentScore;

    // Calculate new optimistic state
    let newOptimisticScore = currentScore;
    let newUserVote = voteType;

    if (previousVote === voteType) {
      // Toggle off: remove vote
      newOptimisticScore = voteType === 1 ? currentScore - 1 : currentScore + 1;
      newUserVote = null;
    } else if (previousVote === -voteType) {
      // Switching vote: remove old and add new
      newOptimisticScore = voteType === 1 ? currentScore + 2 : currentScore - 2;
      newUserVote = voteType;
    } else {
      // New vote
      newOptimisticScore = voteType === 1 ? currentScore + 1 : currentScore - 1;
      newUserVote = voteType;
    }

    // Apply optimistic update
    setUserVote(newUserVote);
    setOptimisticScore(newOptimisticScore);
    setIsVoting(true);

    try {
      // Actual API call
      const result = await voteOnPost(id, voteType);

      // Sync with server response
      setCurrentScore(result.newScore);
      setUserVote(result.userVote);
      setOptimisticScore(result.newScore);
    } catch (error) {
      console.error("Vote failed:", error);

      // Revert optimistic update on error
      setUserVote(previousVote);
      setOptimisticScore(previousScore);

      alert("Erreur lors du vote: " + error.message);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg p-4 hover:bg-[#222] transition-colors duration-200">
      <div className="flex items-start gap-3">
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header: Title + Resolved Badge */}
          <div className="flex items-start justify-between mb-2 ">
            <Link
              to={`/post/${id}`}
              className="hover:text-white transition-colors"
            >
              <h3 className="text-lg font-bold text-white truncate max-w pr-2 flex-1">
                {title}
              </h3>
            </Link>
            <div
              className={`hidden sm:flex items-center gap-1 text-xs px-2 py-1 rounded-full flex-nowrap border ${
                isResolved
                  ? "bg-green-900/30 text-green-400 border-green-900/50"
                  : "bg-red-900/30 text-red-400 border-red-900/50"
              }`}
            >
              {isResolved ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  Résolue
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3" />
                  Non résolue
                </>
              )}
            </div>
          </div>

          {/* Author & Date with User Icon */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4 text-[#6953FF]" />
              <span className="font-medium text-white">{authorName}</span>
            </div>
            <span className="text-gray-500">•</span>
            <span>{formatDate(date)}</span>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {Array.isArray(tags) &&
              tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-blue-900/40 text-xs text-blue-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
            {Array.isArray(tags) && tags.length > 3 && (
              <span className="px-2 py-1 bg-blue-900/40 text-xs text-blue-300 rounded-full">
                +{tags.length - 3}
              </span>
            )}
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#2b2b2b]">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              {/* Voting Section - Now at the same level as comments */}
              <div className="flex items-center gap-1">
                {/* Upvote Button */}
                <button
                  onClick={() => handleVote(1)}
                  disabled={isVoting}
                  className={`p-1 rounded transition-all duration-200 ${
                    userVote === 1
                      ? "text-green-400 bg-green-500/10"
                      : "text-gray-400 hover:text-green-400 hover:bg-[#2b2b2b]"
                  } ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`}
                  title="Upvoter cette question"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>

                {/* Score Display */}
                <span
                  className={`text-sm font-medium mx-1 min-w-[20px] text-center ${
                    optimisticScore > 0
                      ? "text-green-400"
                      : optimisticScore < 0
                        ? "text-red-400"
                        : "text-gray-300"
                  }`}
                >
                  {optimisticScore}
                </span>

                {/* Downvote Button */}
                <button
                  onClick={() => handleVote(-1)}
                  disabled={isVoting}
                  className={`p-1 rounded transition-all duration-200 ${
                    userVote === -1
                      ? "text-red-400 bg-red-500/10"
                      : "text-gray-400 hover:text-red-400 hover:bg-[#2b2b2b]"
                  } ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`}
                  title="Downvoter cette question"
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>

              {/* Comments Count */}
              <div className="flex items-center gap-1 hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>{commentsNumber || 0}</span>
              </div>
            </div>

            <Link
              to={`/post/${id}`}
              className="text-[#6953FF] hover:text-[#5a47e0] font-medium text-sm flex items-center gap-1 group"
            >
              Voir la discussion
              <span className="inline-block group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
