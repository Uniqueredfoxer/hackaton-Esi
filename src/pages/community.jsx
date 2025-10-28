// src/pages/Community.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import QuestionCard from "../components/questionCard";
import { fetchPosts } from "../services/postServices";
import { mockPosts } from "../services/mockPost";
import { Plus, Filter, X, Search } from "lucide-react";

const Community = () => {
  // State
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("Tout");
  const [resolvedFilter, setResolvedFilter] = useState("Tout");
  const [showFilters, setShowFilters] = useState(false); // Mobile only

  // Options
  const tagOptions = [
    "Tout", "ADS", "Maths", "Linear Algebra", "General Algebra", "Mathematical Analysis",
    "Electricity", "Electromagnetism", "Analog Electronics", "Digital Electronics",
    "Electrokinetics", "French", "English", "Economics", "Accounting", "OS",
    "Networks", "DB", "Programmation", "Web", "Mobile", "AI", "ML", "Python",
    "Java", "C++", "JavaScript", "Go", "Rust"
  ];

  const resolvedOptions = ["Tout", "Résolues", "Non résolues"];

  // Fetch posts
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchPosts({ q: query, tag: tag === "Tout", resolved: resolvedFilter })
      .then((res) => {
        if (mounted) {
          setPosts(res || mockPosts);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        if (mounted) setLoading(false);
      });

    return () => (mounted = false);
  }, [query, tag, resolvedFilter]);



  // Apply filter and reset scroll
  const handleFilterChange = (type, value) => {
    if (type === "tag") setTag(value);
    if (type === "resolved") setResolvedFilter(value);
    if (window.innerWidth < 768) setShowFilters(false);
  };
  // Filter posts client-side if needed (optional)
  const filteredPosts = posts.filter(post => {
    const matchesQuery = !query || 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.description.toLowerCase().includes(query.toLowerCase()) ||
      post.tags?.some(t => t.toLowerCase().includes(query.toLowerCase()));
    
    const matchesTag = tag === "Tout" || post.tags?.includes(tag);
    
    const matchesResolved = resolvedFilter === "Tout" || 
      (resolvedFilter === "Résolues" && post.isResolved) ||
      (resolvedFilter === "Non résolues" && !post.isResolved);

    return matchesQuery && matchesTag && matchesResolved;
  });

  return (
    <div className="pb-24"> {/* Space for floating button */}
      {/* Sticky Header */}
      <div className="px-4 pt-4 pb-3 bg-[#111] sticky top-0 z-30 border-b border-[#2b2b2b]">
        <h1 className="text-2xl font-bold text-[hsl(0_0%_95%)] text-center">Communauté</h1>
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
      <div className={`px-4 pb-4 transition-all duration-200 ${showFilters ? 'block' : 'hidden md:block'}`}>
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
                    ? 'bg-[#6953FF] text-white'
                    : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#222]'
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
                    ? 'bg-[#6953FF] text-white'
                    : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#222]'
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
        {loading ? (
          <div className="py-12 text-center text-gray-400">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#6953FF] mb-2"></div>
            Chargement des questions...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            Aucune question ne correspond à votre recherche.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <QuestionCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Ask Button */}
      <Link
        to="/ask"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#6953FF] hover:bg-[#5a47e0] flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-40"
        aria-label="Poser une question"
      >
        <Plus className="w-6 h-6 text-white" />
      </Link>
    </div>
  );
};

export default Community;