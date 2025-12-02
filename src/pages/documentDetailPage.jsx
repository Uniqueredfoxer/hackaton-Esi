import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download, FileText, Eye, Tag, Calendar, User } from "lucide-react";
import supabase from "../services/supabase";

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const { data, error } = await supabase
          .from("documents")
          .select(
            `
            id,
            title,
            description,
            category,
            year,
            tags,
            level,
            file_url,
            file_type,
            file_size_bytes,
            uploaded_at,
            author_id,
            profiles(username)
          `,
          )
          .eq("id", id)
          .single();

        if (error) throw error;

        // Format author name
        const authorName = data.profiles?.username || "Anonyme";

        const doc = {
          ...data,
          author: { name: authorName },
        };

        setDocument(doc);
        setPreviewUrl(data.file_url);
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("Document introuvable");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDocument();
  }, [id]);

  /// ✅ VIEW: Open in browser (preview)
  const handleView = (e) => {
    e.preventDefault();
    if (!document.file_url) return;

    // Remove any existing ?download= parameter for clean preview
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-[#111] border border-[#2b2b2b] rounded-xl p-8 animate-pulse">
          <div className="h-8 bg-[#222] rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-[#222] rounded w-full"></div>
            <div className="h-4 bg-[#222] rounded w-2/3"></div>
            <div className="flex gap-2 pt-4">
              <div className="h-6 bg-[#222] rounded w-16"></div>
              <div className="h-6 bg-[#222] rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-xl p-8">
          <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            Document non trouvé
          </h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-[#6953FF] hover:bg-[#5a47e0] text-white rounded-lg"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  // Determine if file is previewable
  const isPreviewable =
    document?.file_type?.toLowerCase() === "pdf" ||
    document?.file_url?.match(/\.(jpeg|jpg|png)$/i);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white flex items-center gap-1 mb-4"
        >
          ← Retour
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {document.title}
        </h1>
      </div>

      {/* Preview or Thumbnail */}
      <div className="bg-[#111] border border-[#2b2b2b] rounded-xl overflow-hidden mb-6">
        {isPreviewable ? (
          <div className="relative pt-[56.25%]">
            {" "}
            {/* 16:9 aspect ratio */}
            <iframe
              src={document.file_url}
              className="absolute top-0 left-0 w-full h-full"
              title="Document preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        ) : (
          <div className="p-8 text-center">
            <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">
              Aperçu non disponible pour ce type de fichier
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 bg-[#6953FF] hover:bg-[#5a47e0] text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          <Download className="w-5 h-5" />
          Télécharger ({Math.round(document.file_size_bytes / 1024)} KB)
        </button>
        {isPreviewable && (
          <button
            onClick={handleView}
            className="flex items-center justify-center gap-2 bg-[#2b2b2b] hover:bg-[#3a3a3a] text-gray-200 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            <Eye className="w-5 h-5" />
            Voir en plein écran
          </button>
        )}
      </div>

      {/* Metadata */}
      <div className="bg-[#111] border border-[#2b2b2b] rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <h2 className="text-lg font-semibold text-gray-300 mb-3">
              Détails
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Auteur</p>
                  <p className="text-white">{document.author.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Publié le</p>
                  <p className="text-white">
                    {formatDate(document.uploaded_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="text-white">{document.file_type}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <h2 className="text-lg font-semibold text-gray-300 mb-3">
              Catégorisation
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Catégorie</p>
                <p className="text-white font-medium">{document.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Niveau</p>
                <p className="text-white font-medium">{document.level}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-[#2b2b2b] text-xs text-gray-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 pt-6 border-t border-[#2b2b2b]">
          <h2 className="text-lg font-semibold text-gray-300 mb-3">
            Description
          </h2>
          <p className="text-gray-200 whitespace-pre-line">
            {document.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;
