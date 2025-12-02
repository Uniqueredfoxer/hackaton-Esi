import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { uploadFile } from "../services/uploadService";
import supabase from "../services/supabase";
import {
  UploadCloud,
  FileText,
  CheckCircle,
  ArrowRight,
  User,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";

const Upload = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [tags, setTags] = useState([]);
  const [level, setLevel] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Auth check effect
  useEffect(() => {
    let isSubscribed = true;

    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (isSubscribed) {
        setUser(session?.user || null);
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes — but DON'T auto-redirect
    // Instead, just update `user` so UI reacts
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (isSubscribed) {
        setUser(session?.user || null);
      }
    });

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  //While checking auth
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60dvh] text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6953FF] mb-4"></div>
        <p>Vérification de votre session...</p>
      </div>
    );
  }

  // ❌ Not logged in → show friendly prompt
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60dvh] px-4 text-center max-w-2xl mx-auto">
        <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-xl p-8 shadow-lg w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2d3748] text-[#6953FF] mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Connexion requise
          </h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Vous devez être connecté pour téléverser des documents, accéder à
            votre profil ou consulter les publications.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-[#6953FF] hover:bg-[#5a47e0] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <User className="w-4 h-4" />
            Se connecter
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }


  const categoryOptions = ["Cours", "TD", "Devoir", "Livre"];
  const levelOptions = [
    "Licence",
    "L1",
    "L2",
    "L3",
    "Master",
    "M1",
    "M2",
    "Doctorat",
  ];
  const tagOptions = [
    "Accounting",
    "ADS",
    "AI",
    "Analog Electronics",
    "bash",
    "C",
    "C++",
    "cybersecurity",
    "DB",
    "Digital Electronics",
    "Economics",
    "Electricity",
    "Electrokinetics",
    "Electromagnetism",
    "English",
    "French",
    "General Algebra",
    "Go",
    "Java",
    "JavaScript",
    "Linear Algebra",
    "linux",
    "Mathmatical Analisys",
    "Mathematics",
    "ML",
    "Mobile",
    "Networks",
    "OS",
    "Pointer",
    "probability",
    "Programming",
    "Python",
    "Rust",
    "scripting",
    "TP",
    "Web",
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !file ||
      !title.trim() ||
      !description.trim() ||
      !category ||
      !year ||
      tags.length === 0 ||
      !level
    ) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    setIsSubmitting(true);

    try {
      const metadata = {
        title: title.trim(),
        description: description.trim(),
        category,
        year,
        tags,
        level,
      };

     
      const result = await uploadFile(file, metadata);

      if (result.error) {
        alert("Erreur : " + result.error);
      } else if (result.success) {
        alert("Fichier téléversé avec succès !");
        navigate("/resources");
      } else {
        alert("Réponse inattendue du serveur");
      }
    } catch (err) {
      // Handle network/exception errors
      console.error("Submit error:", err);
      alert("Erreur technique : " + (err.message || "Veuillez réessayer"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (selectedFile) => {
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!selectedFile) return;

    if (selectedFile.size > MAX_SIZE) {
      toast.error("La taille du fichier dépasse la limite de 10 Mo.");
      return;
    }

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Seules les fichiers PDF, JPEG, PNG et DOCX sont autorisés.");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrag = (e, over) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(over);
  };

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <div className="flex flex-col items-center max-w-3xl w-full mx-auto px-4 py-8">
      <div className="w-full bg-[#111] border border-[#2b2b2b] rounded-xl p-6 md:p-8 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-[hsl(0_0%_85%)] mb-6">
          Téléverser un document
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File Upload */}
          <label
            htmlFor="file-upload"
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
              isDragOver
                ? "border-[#6953FF] bg-[#1e1e1e]"
                : "border-gray-600 hover:border-[#6953FF] bg-[#151515]"
            }`}
            onDragOver={(e) => handleDrag(e, true)}
            onDragLeave={(e) => handleDrag(e, false)}
            onDrop={(e) => {
              handleDrag(e, false);
              handleFileChange(e.dataTransfer.files[0]);
            }}
          >
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />
            {file ? (
              <div className="text-center text-green-400">
                <CheckCircle className="w-10 h-10 mx-auto mb-3" />
                <p className="font-semibold truncate max-w-xs">{file.name}</p>
                <p className="text-sm text-gray-400">
                  ({Math.round(file.size / 1024)} KB)
                </p>
                <p className="text-xs mt-2 text-gray-500">
                  Cliquez pour remplacer
                </p>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <UploadCloud className="w-10 h-10 mx-auto mb-3" />
                <p className="font-semibold">Déposez votre fichier ici</p>
                <p className="text-sm mt-1">ou cliquez pour parcourir</p>
                <p className="text-xs mt-2 text-gray-500">
                  PDF, DOCX, JPG, PNG • Max 10 Mo
                </p>
              </div>
            )}
          </label>

          {/* Inputs */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du document *"
            required
            className="w-full px-4 py-3 rounded-lg bg-[#151515] border border-[#2b2b2b] text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#c0c0c095]"
          />
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Année *"
            required
            min="1900"
            max="2030"
            className="w-full px-4 py-3 rounded-lg bg-[#151515] border border-[#2b2b2b] text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#c0c0c095]"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description *"
            required
            className="w-full px-4 py-3 rounded-lg bg-[#151515] border border-[#2b2b2b] text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#c0c0c095]"
          />
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Tags (sélectionnez-en au moins un) *
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-[#151515] border border-[#2b2b2b] rounded-lg min-h-[48px]">
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    tags.includes(tag)
                      ? "bg-[#6953FF] text-white"
                      : "bg-[#2b2b2b] text-gray-300 hover:bg-[#3a3a3a]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {tags.length === 0 && (
              <p className="text-red-400 text-sm mt-1">
                Veuillez sélectionner au moins un tag.
              </p>
            )}
          </div>
          {/* Level */}
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-[#151515] border border-[#2b2b2b] text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#c0c0c095]"
          >
            <option value="">Niveau *</option>
            {levelOptions.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-[#151515] border border-[#2b2b2b] text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#c0c0c095]"
          >
            <option value="">Catégorie *</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-[#c1c1c1] hover:bg-[#e1e1e1] text-black font-semibold rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Téléversement en cours...
              </>
            ) : (
              "Téléverser le document"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
