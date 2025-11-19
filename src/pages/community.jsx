// src/pages/Community.jsx
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import QuestionCard from "../components/questionCard";
import { fetchPosts } from "../services/postServices";
import { Plus, Filter, Search } from "lucide-react";
import { fetchAllUserVotes } from "../services/voteServices";

const Community = () => {
  // State
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("Tout");
  const [resolvedFilter, setResolvedFilter] = useState("Tout");
  const [showFilters, setShowFilters] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [userVotes, setUserVotes] = useState({});

  // Options
  const tagOptions = [
    "Tout",
    "ADS",
    "Maths",
    "Linear Algebra",
    "General Algebra",
    "Mathematical Analysis",
    "Electricity",
    "Electromagnetism",
    "Analog Electronics",
    "Digital Electronics",
    "Electrokinetics",
    "French",
    "English",
    "Economics",
    "Accounting",
    "OS",
    "Networks",
    "DB",
    "Programmation",
    "Web",
    "Mobile",
    "AI",
    "ML",
    "Python",
    "Java",
    "C++",
    "JavaScript",
    "Go",
    "Rust",
  ];

  const resolvedOptions = ["Tout", "Résolues", "Non résolues"];

  useEffect(() => {
    const loadUserVotes = async () => {
      try {
        const votes = await fetchAllUserVotes("post");
        setUserVotes(votes);
      } catch (error) {
        console.error(error);
      }
    };

    loadUserVotes();
  }, []);

  // Convert resolved filter to boolean for API
  const getResolvedFilter = () => {
    if (resolvedFilter === "Résolues") return true;
    if (resolvedFilter === "Non résolues") return false;
    return undefined; // "Tout" - no filter
  };

  // Load posts with current filters
  const loadPosts = useCallback(
    async (reset = false) => {
      setLoading(true);

      const offset = reset ? 0 : posts.length;

      try {
        const result = await fetchPosts({
          search: query,
          tags: tag === "Tout" ? [] : [tag],
          isResolved: getResolvedFilter(),
          limit: 10,
          offset: offset,
          sortBy: "posted_at",
          sortOrder: "desc",
        });

        if (reset) {
          setPosts(result.posts);
        } else {
          setPosts((prev) => [...prev, ...result.posts]);
        }

        setTotalCount(result.totalCount);
        setHasMore(result.hasMore);
      } catch (error) {
        console.error("Failed to load posts:", error);
        if (reset) {
          setPosts([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [query, tag, resolvedFilter, posts.length],
  );

  // Load initial posts
  useEffect(() => {
    loadPosts(true);
  }, [loadPosts]);

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    if (type === "tag") setTag(value);
    if (type === "resolved") setResolvedFilter(value);
    if (window.innerWidth < 768) setShowFilters(false);
  };

  // Reset and load when filters change
  useEffect(() => {
    loadPosts(true);
  }, [query, tag, resolvedFilter, loadPosts]);

  return (
    <div className="pb-24">
      {/* Sticky Header */}
      <div className="px-4 pt-4 pb-3 bg-[#111] sticky top-0 z-30 border-b border-[#2b2b2b]">
        <h1 className="text-2xl font-bold text-[hsl(0_0%_95%)] text-center">
          Communauté
        </h1>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une question..."
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1a1a1a] border border-[#2b2b2b] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6953FF]"
          />
        </div>
      </div>

      {/* Filter Toggle (Mobile) */}
      <div className="px-4 pb-3 md:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-[#6953FF] font-medium"
        >
          <Filter className="w-4 h-4" />
          Filtres
        </button>
      </div>

      {/* Filters */}
      <div
        className={`px-4 pb-4 transition-all duration-200 ${showFilters ? "block" : "hidden md:block"}`}
      >
        {/* Tags */}
        <div className="mb-3">
          <p className="text-sm text-gray-400 mb-2">Par tag</p>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map((t) => (
              <button
                key={t}
                onClick={() => handleFilterChange("tag", t)}
                className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors whitespace-nowrap ${
                  tag === t
                    ? "bg-[#6953FF] text-white"
                    : "bg-[#1a1a1a] text-gray-300 hover:bg-[#222]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Resolved Status */}
        <div>
          <p className="text-sm text-gray-400 mb-2">Statut</p>
          <div className="flex flex-wrap gap-2">
            {resolvedOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => handleFilterChange("resolved", opt)}
                className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                  resolvedFilter === opt
                    ? "bg-[#6953FF] text-white"
                    : "bg-[#1a1a1a] text-gray-300 hover:bg-[#222]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="px-4">
        {loading && posts.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#6953FF] mb-2"></div>
            Chargement des questions...
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            Aucune question ne correspond à votre recherche.
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <QuestionCard
                key={post.id}
                post={post}
                userVote={userVotes[post.id]}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {posts.length > 0 && hasMore && (
          <div className="flex justify-center py-6">
            <button
              onClick={() => loadPosts()}
              disabled={loading}
              className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#222] text-gray-300 rounded-lg border border-[#2b2b2b] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Chargement...
                </>
              ) : (
                "Charger plus de questions"
              )}
            </button>
          </div>
        )}

        {posts.length > 0 && !hasMore && (
          <p className="text-center text-gray-500 py-4 text-sm">
            Fin des questions ({totalCount} au total)
          </p>
        )}
      </div>

      {/* Floating Ask Button */}
      <Link
        to="/post"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#6953FF] hover:bg-[#5a47e0] flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-40"
        aria-label="Poser une question"
      >
        <Plus className="w-6 h-6 text-white" />
      </Link>
    </div>
  );
};

export default Community;
