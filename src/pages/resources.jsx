// src/pages/Resources.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DocumentCard from "../components/documentCard";
import { fetchDocuments } from "../services/documentServices";
import { Plus, Filter, X } from "lucide-react";

const Resources = () => {
  // State
  const [resources, setResources] = useState([]);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("Tout");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false); // Mobile only

  // Tag options
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

  // Fetch data
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchDocuments()
      .then((res) => {
        if (mounted) {
          setResources(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        if (mounted) setLoading(false);
      });

    return () => (mounted = false);
  }, [page, tag, query]);

  // Reset to page 1 when filters change
  const handleFilterChange = (newTag) => {
    setTag(newTag);
    setPage(1);
    if (window.innerWidth < 768) setShowFilters(false); // Close on mobile
  };

  return (
    <div className="pb-24">
      {" "}
      {/* Space for floating button */}
      {/* Header */}
      <div className="px-4 pt-4 pb-3 bg-[#111] sticky top-0 z-30 border-b border-[#2b2b2b]">
        <h1 className="text-2xl font-bold text-[hsl(0_0%_95%)] text-center">
          Ressources
        </h1>
      </div>
      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher par titre, tag, auteur..."
            className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-[#2b2b2b] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6953FF]"
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
          Filtres {tag !== "Tout" && `: ${tag}`}
        </button>
      </div>
      {/* Filters (Desktop always visible, Mobile collapsible) */}
      <div
        className={`px-4 pb-4 transition-all duration-200 ${showFilters ? "block" : "hidden md:block"}`}
      >
        <div className="flex flex-wrap gap-2">
          {tagOptions.map((t) => (
            <button
              key={t}
              onClick={() => handleFilterChange(t)}
              className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors whitespace-nowrap ${
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
      {/* Results */}
      <div className="px-4">
        {loading ? (
          <div className="py-12 text-center text-gray-400">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#6953FF] mb-2"></div>
            Chargement...
          </div>
        ) : resources.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            Aucune ressource ne correspond à votre recherche.
          </div>
        ) : (
          <div className="space-y-3">
            {resources.map((r) => (
              <DocumentCard key={r.id} document={r} />
            ))}
          </div>
        )}
      </div>
      {/* Pagination */}
      {resources.length > 0 && (
        <div className="flex justify-center items-center gap-3 py-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-[#1a1a1a] text-gray-300 border border-[#2b2b2b] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <span className="text-gray-400 font-medium min-w-[40px] text-center">
            Page {page}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg bg-[#1a1a1a] text-gray-300 border border-[#2b2b2b]"
          >
            Suivant
          </button>
        </div>
      )}
      {/* Floating Upload Button */}
      <Link
        to="/upload"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#6953FF] hover:bg-[#5a47e0] flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-40"
        aria-label="Téléverser une ressource"
      >
        <Plus className="w-6 h-6 text-white" />
      </Link>
    </div>
  );
};

export default Resources;
