// src/pages/Resources.jsx
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import DocumentCard from "../components/documentCard";
import { fetchDocuments } from "../services/documentServices";
import { Plus, Filter } from "lucide-react";

const Resources = () => {
  // Filters
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("Tout");
  const [year, setYear] = useState("Tout");
  const [level, setLevel] = useState("Tout");
  const [fileType, setFileType] = useState("Tout");

  // Data
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

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

  const yearOptions = [
    "Tout",
    ...Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i),
  ];

  const levelOptions = [
    "Tout",
    "Licence",
    "L1",
    "L2",
    "L3",
    "Master",
    "M1",
    "M2",
    "Doctorat",
  ];

  const fileTypeOptions = ["Tout", "PDF", "DOCX", "JPG", "PNG"];

  // Fetch documents with current filters
  const loadDocuments = useCallback(
    async (reset = false) => {
      setLoading(true);

      const offset = reset ? 0 : documents.length;

      const { data, count } = await fetchDocuments({
        query,
        tag: tag === "Tout" ? "" : tag,
        year: year === "Tout" ? "" : year,
        level: level === "Tout" ? "" : level,
        fileType: fileType === "Tout" ? "" : fileType,
        limit: 10,
        offset,
      });

      if (reset) {
        setDocuments(data);
      } else {
        setDocuments((prev) => [...prev, ...data]);
      }

      setTotalCount(count);
      setHasMore(documents.length + data.length < count);
      setLoading(false);
    },
    [query, tag, year, level, fileType, documents.length],
  );

  // Load initial data
  useEffect(() => {
    loadDocuments(true);
  }, [loadDocuments]);

  // Handle filter changes
  const handleFilterChange = (setter, value) => {
    setter(value);
    if (window.innerWidth < 768) setShowFilters(false);
  };

  // Reset and load when filters change
  useEffect(() => {
    loadDocuments(true);
  }, [query, tag, year, level, fileType, loadDocuments]);

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 bg-[#111] sticky top-0 z-30 border-b border-[#2b2b2b]">
        <h1 className="text-2xl font-bold text-[hsl(0_0%_95%)] text-center">
          Ressources
        </h1>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par titre, description..."
          className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-[#2b2b2b] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6953FF]"
        />
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
                onClick={() => handleFilterChange(setTag, t)}
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

        {/* Year */}
        <div className="mb-3">
          <p className="text-sm text-gray-400 mb-2">Année</p>
          <div className="flex flex-wrap gap-2">
            {yearOptions.map((y) => (
              <button
                key={y}
                onClick={() => handleFilterChange(setYear, y)}
                className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                  year === y
                    ? "bg-[#6953FF] text-white"
                    : "bg-[#1a1a1a] text-gray-300 hover:bg-[#222]"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Level */}
        <div className="mb-3">
          <p className="text-sm text-gray-400 mb-2">Niveau</p>
          <div className="flex flex-wrap gap-2">
            {levelOptions.map((l) => (
              <button
                key={l}
                onClick={() => handleFilterChange(setLevel, l)}
                className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                  level === l
                    ? "bg-[#6953FF] text-white"
                    : "bg-[#1a1a1a] text-gray-300 hover:bg-[#222]"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* File Type */}
        <div>
          <p className="text-sm text-gray-400 mb-2">Type de fichier</p>
          <div className="flex flex-wrap gap-2">
            {fileTypeOptions.map((f) => (
              <button
                key={f}
                onClick={() => handleFilterChange(setFileType, f)}
                className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                  fileType === f
                    ? "bg-[#6953FF] text-white"
                    : "bg-[#1a1a1a] text-gray-300 hover:bg-[#222]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-4">
        {loading && documents.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#6953FF] mb-2"></div>
            Chargement...
          </div>
        ) : documents.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            Aucune ressource ne correspond à votre recherche.
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {documents.length > 0 && hasMore && (
          <div className="flex justify-center py-6">
            <button
              onClick={() => loadDocuments()}
              disabled={loading}
              className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#222] text-gray-300 rounded-lg border border-[#2b2b2b] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                "Charger plus"
              )}
            </button>
          </div>
        )}

        {documents.length > 0 && !hasMore && (
          <p className="text-center text-gray-500 py-4 text-sm">
            Fin des ressources ({totalCount} au total)
          </p>
        )}
      </div>

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
