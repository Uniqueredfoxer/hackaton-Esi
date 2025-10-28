// src/components/QuestionCard.jsx
import { Link } from "react-router-dom";
import { MessageCircle, ThumbsUp, CheckCircle } from "lucide-react";

const QuestionCard = ({ post }) => {
  // Safely access author name
  const authorName = post.author?.name || "Utilisateur";

  // Format date (e.g., "25 oct.")
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const options = { day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg p-4 hover:bg-[#222] transition-colors duration-200">
      <div className="flex items-start gap-3">
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header: Title + Resolved Badge */}
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-white truncate pr-2">
              {post.title}
            </h3>
            {post.isResolved && (
              <span className="flex items-center gap-1 bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full border border-green-900/50">
                <CheckCircle className="w-3 h-3" />
                Résolue
              </span>
            )}
          </div>

          {/* Author & Date */}
          <p className="text-gray-400 text-sm mt-1">
            par <span className="font-medium">{authorName}</span> • {formatDate(post.postedAt)}
          </p>

          {/* Description */}
          <p className="text-gray-300 text-sm mt-2 line-clamp-2">
            {post.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {Array.isArray(post.tags) &&
              post.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-[#2b2b2b] text-xs text-gray-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
            {Array.isArray(post.tags) && post.tags.length > 3 && (
              <span className="px-2 py-1 bg-[#2b2b2b] text-xs text-gray-400 rounded-full">
                +{post.tags.length - 3}
              </span>
            )}
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.score || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.commentsNumber || 0}</span>
              </div>
            </div>

            <Link
              to={`/community/${post.id}`}
              className="text-[#6953FF] hover:text-[#5a47e0] font-medium text-sm flex items-center gap-1 group"
            >
              Voir la discussion
              <span className="inline-block group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;