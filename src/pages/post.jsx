import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import supabase from "../services/supabase";
import {
  MessageCircle,
  Image as ImageIcon,
  Tag,
  CheckCircle,
  UploadCloud,
  ArrowRight,
  User,
  Lock,
} from "lucide-react";

const Post = () => {
  const navigate = useNavigate();

  // Auth
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState(""); // comma-separated string
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // 🔐 Auth check
  useEffect(() => {
    let isSubscribed = true;

    const checkUser = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          return;
        }

        if (isSubscribed) {
          setUser(session?.user || null);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error in checkUser:", err);
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (isSubscribed) {
        setUser(session?.user || null);
      }
    });

    return () => {
      isSubscribed = false;
      subscription?.unsubscribe();
    };
  }, [navigate]);
  // 🌀 Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60dvh] text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6953FF] mb-4"></div>
        <p>Vérification de votre session...</p>
      </div>
    );
  }

  // ❌ Not logged in
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
            Connectez-vous pour poser des questions, partager des ressources et
            participer à la communauté.
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

  // 🖼️ Handle image
  const handleImageChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image (JPEG, PNG, GIF).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5 Mo.");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  // 📤 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Veuillez remplir le titre et la description.");
      return;
    }

    // Parse tags: split, clean, filter empty
    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    setIsSubmitting(true);
    let imageUrl = null;

    // Upload image if exists
    if (imageFile) {
      const fileName = `${user.id}/${Date.now()}-${imageFile.name}`;
      const { error } = await supabase.storage
        .from("post-images")
        .upload(fileName, imageFile);

      if (error) {
        setIsSubmitting(false);
        alert("Erreur image : " + error.message);
        return;
      }

      const { data, error: urlError } = await supabase.storage
        .from("post-images")
        .getPublicUrl(fileName);
      imageUrl = data.publicUrl;

      if (urlError) {
        setIsSubmitting(false);
        alert("Erreur URL : " + urlError.message);
        return;
      }

      if (!data.publicUrl) {
        setIsSubmitting(false);
        alert("Erreur URL : Impossible de générer l'URL publique");
        return;
      }
    }

    // Insert post
    const { error: postError } = await supabase.from("posts").insert({
      title: title.trim(),
      description: description.trim(),
      author_id: user.id,
      tags, // array of strings
      image_url: imageUrl || null,
      // scores, views, etc. use defaults
    });

    setIsSubmitting(false);

    if (postError) {
      alert("Erreur : " + postError.message);
    } else {
      alert("Question publiée !");
      navigate("/community");
    }
  };

  const handleDrag = (e, over) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(over);
  };

  return (
    <div className="max-w-3xl w-full mx-auto px-4 py-8">
      <div className="bg-[#111] border border-[#2b2b2b] rounded-xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#2d3748] rounded-lg">
            <MessageCircle className="w-6 h-6 text-[#6953FF]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[hsl(0_0%_95%)]">
            Faire un post
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de votre question *"
            required
            className="w-full px-4 py-3 rounded-lg bg-[#151515] border border-[#2b2b2b] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6953FF]"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez votre question en détail... *"
            rows={6}
            required
            className="w-full px-4 py-3 rounded-lg bg-[#151515] border border-[#2b2b2b] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6953FF] resize-none"
          />

          {/* Tags */}
          <div>
            <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <Tag className="w-4 h-4" />
              Tags (optionnel)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Ex: Maths, Python, L2 (séparés par des virgules)"
              className="w-full px-4 py-3 rounded-lg bg-[#151515] border border-[#2b2b2b] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6953FF]"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Joindre une image (optionnel)
            </label>
            <label
              htmlFor="image-upload"
              className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                isDragOver
                  ? "border-[#6953FF] bg-[#1e1e1e]"
                  : "border-gray-600 hover:border-[#6953FF] bg-[#151515]"
              }`}
              onDragOver={(e) => handleDrag(e, true)}
              onDragLeave={(e) => handleDrag(e, false)}
              onDrop={(e) => {
                handleDrag(e, false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleImageChange(file);
              }}
            >
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageChange(file);
                }}
              />
              {imagePreview ? (
                <div className="text-center">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="max-h-32 rounded-md object-contain mb-2"
                  />
                  <p className="text-sm text-green-400 font-medium">
                    Image ajoutée
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-medium">Déposez une image ou cliquez</p>
                  <p className="text-xs">JPG, PNG, GIF • Max 5 Mo</p>
                </div>
              )}
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#3b82f6] to-[#7c3aed] hover:from-[#2a70e0] hover:to-[#6a2ecf] text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Publication...
              </>
            ) : (
              "Poster"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
