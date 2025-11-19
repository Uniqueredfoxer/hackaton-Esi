import React from "react";
import { Link } from "react-router-dom";
import { Download, Share2, BookOpen, User, FileText } from "lucide-react";

// Utility function to format file size in MB

// Helper component for styled Tags
const TagBadge = ({ children }) => (
  // Utilisation d'un bleu très doux pour se démarquer sur le fond sombre
  <span className="flex items-center text-xs text-nowrap font-medium text-blue-300 bg-blue-900/40 px-2 py-0.5 rounded-full mr-2 last:mr-0 transition duration-150">
    {children}
  </span>
);

const DocumentCard = ({ document }) => {
  const {
    id,
    title,
    description,
    author,
    year,
    category,
    level,
    tags,
    file_type,
    file_size,
    file_url,
    downloads,
  } = document;

  /// ✅ VIEW: Open in browser (preview)
  const handleView = (e) => {
    e.preventDefault();
    if (!document.file_url) return;

    // Remove any existing ?download= parameter for clean preview
    const previewUrl = document.file_url.split("?")[0];
    window.open(previewUrl, "_blank");
  };

  // ✅ DOWNLOAD: Force download
  const handleDownload = (e) => {
    e.preventDefault();
    if (!document.file_url) return;

    // Add ?download= to force download
    const downloadUrl = document.file_url.includes("?")
      ? `${document.file_url}&download=`
      : `${document.file_url}?download=`;

    window.open(downloadUrl, "_blank");
  };

  // Style de fond de la carte (gris très foncé/noir)
  return (
    <div className="flex border h-auto w-full border-[#bdbdbd25] bg-[#1a1a1a] p-4 rounded-lg transition duration-300">
      {/* 1. File Type Indicator (PDF/DOCX/etc.) */}
      <div className="hidden flex-shrink-0 w-16 md:w-[120px] rounded-md md:flex flex-col items-center justify-center bg-gray-800 text-white font-bold text-sm shadow-inner mr-4">
        {/* Icône basée sur le type de fichier (vous pouvez ajouter plus de logique ici) */}
        <FileText className="w-6 h-6 text-gray-400 mb-1" />
        {file_type}
      </div>

      {/* 2. Content Section */}
      <div className="flex-grow flex flex-col justify-between text-gray-300 min-w-0">
        {/* Top: Title, Author, Description, Tags */}
        <div className="flex flex-col relative">
          {/* Titre (navigation) */}
          <Link
            to={`/document/${id}`}
            className="hover:text-white transition-colors"
          >
            <h2 className="w-auto text-nowrap truncate text-xl font-bold leading-snug">
              {title}
            </h2>
          </Link>

          {/* Auteur */}
          <div className="text-sm inline-flex items-center text-gray-400 mt-1">
            <User className="w-3 h-3 mr-1" />
            <span>{author}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 line-clamp-2 mt-2">
            {description}
          </p>

          {/* Tags (Affichés individuellement) */}
          {tags && tags.length > 0 && (
            <div className="mt-3 flex flex-nowrap overflow-x-auto gap-y-2">
              {tags.map((tag) => (
                <TagBadge key={tag}>{tag}</TagBadge>
              ))}
            </div>
          )}

          {/* Métadonnées détaillées & Catégorie */}
          <div className="mt-3 text-sm flex items-center flex-nowrap overflow-x-auto gap-2">
            {/* Catégorie (Maintenant visible sur toutes les tailles d'écran) */}
            <span className="text-xs font-medium text-indigo-300 bg-indigo-900/50 px-2 py-0.5 rounded-full">
              {category}
            </span>

            <span className="text-gray-700">|</span>

            <span className="text-gray-500">{level}</span>
            <span className="text-gray-700">|</span>
            <span className="text-gray-500">{year}</span>
            <span className="text-gray-700">|</span>
            <span className="text-gray-500 text-nowrap">{file_size}</span>

            {/* Downloads: Visible sur Desktop, caché sur Mobile */}
            <div className="hidden md:flex items-center text-gray-400">
              <span className="ml-2 text-sm">{downloads}</span>
              <Download className="ml-0.5 w-4 h-4" />
            </div>
          </div>
        </div>

        {/* 3. Action Buttons & Mobile Downloads */}
        <div className="flex w-full justify-between items-end mt-4">
          {/* Conteneur des boutons */}
          <div className="flex justify-center w-auto items-center gap-3 flex-nowrap pb-1.5 pr-2">
            {/* Bouton Télécharger (Primaire: Gris clair/blanc) */}
            <button
              onClick={handleDownload}
              className="flex items-center bg-gray-200 hover:bg-white text-black font-semibold py-1.5 px-4 rounded-md flex-shrink-0 transition"
            >
              <Download className="w-4 h-4 mr-1" />
              <span className="text-sm">Télécharger</span>
            </button>

            {/* Bouton Voir (Secondaire: Gris foncé) */}
            <Link
              to={`/document/${id}`}
              onClick={handleView}
              className="flex items-center bg-[#2d2d2d] hover:bg-[#3a3a3a] text-gray-300 font-semibold py-1.5 px-4 rounded-md flex-shrink-0 transition"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              <span className="text-sm">Voir</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
