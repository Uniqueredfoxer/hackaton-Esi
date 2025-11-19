// src/components/TopQuestions.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchPosts } from "../services/postServices";
import QuestionCard from "./questionCard";
import { ArrowRight } from "lucide-react";
import { fetchAllUserVotes } from "../services/voteServices";

const TopQuestions = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTopPosts = async () => {
      try {
        const { posts: postsData } = await fetchPosts();

        // Get top 2 posts by score
        const topPosts = postsData
          .sort((a, b) => (b.score || 0) - (a.score || 0))
          .slice(0, 2);

        setPosts(topPosts);
      } catch (err) {
        console.error("Error fetching top posts:", err);
      } finally {
        setLoading(false);
      }
    };

    getTopPosts();
  }, []);

  if (loading) {
    return (
      <div className="mb-8 mt-8 w-full px-4 sm:px-6 lg:px-20">
        {/* Mobile-friendly header skeleton */}
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 mb-6">
          <div className="h-7 bg-[#2b2b2b] rounded w-48 animate-pulse"></div>
          <div className="h-9 bg-[#2b2b2b] rounded w-24 animate-pulse"></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg p-4 animate-pulse"
            >
              <div className="h-5 bg-[#2b2b2b] rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-[#2b2b2b] rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-[#2b2b2b] rounded w-full mb-2"></div>
              <div className="h-3 bg-[#2b2b2b] rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 mt-8 w-full px-4 sm:px-6 lg:px-20">
      {/* Mobile-friendly header */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center xs:text-left">
          Questions Populaires
        </h2>

        {posts.length > 0 && (
          <Link
            to="/community"
            className="flex items-center justify-center xs:justify-start gap-2 text-[#6953FF] hover:text-[#5a47e0] font-medium group transition-colors w-full xs:w-auto"
          >
            <span className="text-sm sm:text-base">Voir tout</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Link>
        )}
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <QuestionCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 px-4">
          <p className="text-gray-400 mb-4 text-sm sm:text-base">
            Aucune question populaire
          </p>
          <Link
            to="/community"
            className="inline-flex items-center gap-2 bg-[#6953FF] hover:bg-[#5a47e0] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors group text-sm sm:text-base"
          >
            Commencer une discussion
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default TopQuestions;
