// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import supabase from "../services/supabase";
import {
  User,
  Mail,
  Calendar,
  LogOut,
  ArrowRight,
  Lock,
  FileText,
  MessageCircle,
  Star,
  Edit,
  CheckCircle,
} from "lucide-react";
import {
  fetchUserProfile,
  fetchUserDocuments,
  fetchUserPosts,
} from "../services/userServices";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔐 Auth check
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

  // 📥 Fetch profile + content
  useEffect(() => {
    if (!user) return;

    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError("");

        const profileData = await fetchUserProfile();
        setProfile(profileData);

        const docData = await fetchUserDocuments(user.id);
        setDocuments(docData);

        const postData = await fetchUserPosts(user.id);
        setPosts(postData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  // 🌀 Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60dvh] text-gray-400 px-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6953FF] mb-4"></div>
        <p>Chargement de votre profil...</p>
      </div>
    );
  }

  // ❌ Not logged in → show prompt
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60dvh] px-4 text-center max-w-2xl mx-auto">
        <div className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-xl p-6 shadow-lg w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2d3748] text-[#6953FF] mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Connexion requise
          </h2>
          <p className="text-gray-300 mb-4 leading-relaxed">
            Connectez-vous pour accéder à votre profil, gérer vos documents et
            participer à la communauté.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-[#6953FF] hover:bg-[#5a47e0] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <User className="w-4 h-4" />
            Se connecter
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const formatFileSize = (sizeInBytes) => {
    if (typeof sizeInBytes !== "number" || sizeInBytes < 0) return "0 B";
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024)
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6953FF] to-[#3b82f6] flex items-center justify-center mb-3">
          <User className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white text-center">
          {profile?.username || user.email.split("@")[0]}
        </h1>
        <p className="text-gray-400 text-sm mt-1 text-center">{user.email}</p>
      </div>

      {/* Profile Info - Mobile First */}
      <div className="bg-[#111] border border-[#2b2b2b] rounded-xl p-4 mb-6">
        <h2 className="text-lg font-bold text-white mb-3">Informations</h2>

        <div className="space-y-3">
          {/* Username */}
          <div className="flex items-start gap-3 p-3 bg-[#151515] rounded-lg">
            <User className="w-4 h-4 text-[#6953FF] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Pseudo
              </p>
              <p className="text-gray-200 font-medium">
                {profile?.username || "Non défini"}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3 p-3 bg-[#151515] rounded-lg">
            <Mail className="w-4 h-4 text-[#6953FF] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Adresse e-mail
              </p>
              <p className="text-gray-200">{user.email}</p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-start gap-3 p-3 bg-[#151515] rounded-lg">
            <Star className="w-4 h-4 text-[#6953FF] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Rôle
              </p>
              <p className="text-gray-200">{profile?.role || "Utilisateur"}</p>
            </div>
          </div>

          {/* Scores */}
          <div className="flex items-start gap-3 p-3 bg-[#151515] rounded-lg">
            <Star className="w-4 h-4 text-[#6953FF] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Score
              </p>
              <p className="text-gray-200">{profile?.scores || 0}</p>
            </div>
          </div>

          {/* Bio */}
          {profile?.bio && (
            <div className="flex items-start gap-3 p-3 bg-[#151515] rounded-lg">
              <Edit className="w-4 h-4 text-[#6953FF] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Bio
                </p>
                <p className="text-gray-200">{profile.bio}</p>
              </div>
            </div>
          )}

          {/* Sign-up date */}
          <div className="flex items-start gap-3 p-3 bg-[#151515] rounded-lg">
            <Calendar className="w-4 h-4 text-[#6953FF] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Inscrit depuis
              </p>
              <p className="text-gray-200">{formatDate(user.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-4 pt-4 border-t border-[#2b2b2b]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1a1a1a] hover:bg-[#252525] text-gray-300 font-medium rounded-lg border border-[#2b2b2b] transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-[#111] border border-[#2b2b2b] rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-white">Mes documents</h2>
          <Link
            to="/upload"
            className="text-[#6953FF] hover:text-[#5a47e0] text-sm font-medium"
          >
            Téléverser
          </Link>
        </div>
        {documents.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            Aucun document téléversé.
          </p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-[#151515] border border-[#2b2b2b] rounded-lg p-3"
              >
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 bg-[#2d3748] rounded flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-[#6953FF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-white truncate">
                      {doc.title}
                    </h3>
                    <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                      {doc.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 bg-[#2b2b2b] text-[10px] text-gray-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {doc.tags.length > 2 && (
                        <span className="px-1.5 py-0.5 bg-[#2b2b2b] text-[10px] text-gray-400 rounded">
                          +{doc.tags.length - 2}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500">
                      <span>{doc.level}</span>
                      <span>•</span>
                      <span>{doc.year}</span>
                      <span>•</span>
                      <span>{formatFileSize(doc.file_size_bytes)}</span>
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      <button
                        onClick={() => window.open(doc.file_url, "_blank")}
                        className="flex items-center gap-1 px-2 py-1 bg-[#6953FF] hover:bg-[#5a47e0] text-white rounded text-xs"
                      >
                        <FileText className="w-3 h-3" />
                        Voir
                      </button>
                      <button
                        onClick={() =>
                          window.open(`${doc.file_url}?download=`, "_blank")
                        }
                        className="flex items-center gap-1 px-2 py-1 bg-[#2b2b2b] hover:bg-[#3a3a3a] text-gray-200 rounded text-xs"
                      >
                        <FileText className="w-3 h-3" />
                        Télécharger
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Posts Section */}
      <div className="bg-[#111] border border-[#2b2b2b] rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-white">Mes questions</h2>
          <Link
            to="/ask"
            className="text-[#6953FF] hover:text-[#5a47e0] text-sm font-medium"
          >
            Poser une question
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            Aucune question posée.
          </p>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-[#151515] border border-[#2b2b2b] rounded-lg p-3"
              >
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 bg-[#2d3748] rounded flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-[#6953FF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-white truncate">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 bg-[#2b2b2b] text-[10px] text-gray-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="px-1.5 py-0.5 bg-[#2b2b2b] text-[10px] text-gray-400 rounded">
                          +{post.tags.length - 2}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500">
                      <span>{post.scores || 0} points</span>
                      <span>•</span>
                      <span>{post.comments_number || 0} commentaires</span>
                      <span>•</span>
                      <span>{formatDate(post.posted_at)}</span>
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      <Link
                        to={`/community/${post.id}`}
                        className="flex items-center gap-1 px-2 py-1 bg-[#6953FF] hover:bg-[#5a47e0] text-white rounded text-xs"
                      >
                        <MessageCircle className="w-3 h-3" />
                        Voir
                      </Link>
                      {post.is_resolved && (
                        <span className="flex items-center gap-0.5 bg-green-900/30 text-green-400 text-[10px] px-1.5 py-0.5 rounded">
                          <CheckCircle className="w-2.5 h-2.5" />
                          Résolue
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
