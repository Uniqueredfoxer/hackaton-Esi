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
} from "lucide-react";
import {
  fetchUserProfile,
  fetchUserDocuments,
  fetchUserPosts,
  fetchUserComments,
} from "../services/userServices";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("documents");
  const [documents, setDocuments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
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

  // 📥 Fetch profile
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const profileData = await fetchUserProfile(user.id);
        setProfile(profileData);

        // Load initial tab content
        await loadTabContent("documents");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // 📂 Load content based on active tab
  const loadTabContent = async (tab) => {
    if (!user) return;

    try {
      setContentLoading(true);
      setError("");

      switch (tab) {
        case "documents":
          if (documents.length === 0) {
            const docData = await fetchUserDocuments(user.id);
            setDocuments(docData);
          }
          break;
        case "posts":
          if (posts.length === 0) {
            const postData = await fetchUserPosts(user.id);
            setPosts(postData);
          }
          break;
        case "comments":
          if (comments.length === 0) {
            const commentData = await fetchUserComments(user.id);
            setComments(commentData);
          }
          break;
        default:
          break;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setContentLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    loadTabContent(tab);
  };

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

  const calculateAccountAge = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} jour${diffDays > 1 ? "s" : ""}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} mois`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} an${years > 1 ? "s" : ""}${remainingMonths > 0 ? ` et ${remainingMonths} mois` : ""}`;
    }
  };

  const formatFileSize = (sizeInBytes) => {
    if (typeof sizeInBytes !== "number" || sizeInBytes < 0) return "0 B";
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024)
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Render content based on active tab
  const renderContent = () => {
    if (contentLoading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6953FF]"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "documents":
        return (
          <div className="space-y-3">
            {documents.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                Aucun document téléversé.
              </p>
            ) : (
              documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  formatFileSize={formatFileSize}
                />
              ))
            )}
          </div>
        );

      case "posts":
        return (
          <div className="space-y-3">
            {posts.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                Aucune question posée.
              </p>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} formatDate={formatDate} />
              ))
            )}
          </div>
        );

      case "comments":
        return (
          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                Aucun commentaire publié.
              </p>
            ) : (
              comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  formatDate={formatDate}
                />
              ))
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-blue-900/50 flex items-center justify-center mb-3">
          <User className="w-10 h-10 text-blue-300" />
        </div>
        <h1 className="text-xl font-bold text-white text-center">
          {profile?.username || user.email.split("@")[0]}
        </h1>
      </div>

      {/* Profile Info - Simplified with only 4 fields */}
      <div className="bg-[#111] border border-[#2b2b2b] rounded-xl p-4 mb-6">
        <h2 className="text-lg font-bold text-white mb-4 text-center">
          Informations du compte
        </h2>

        <div className="grid gap-4">
          {/* Username */}
          <div className="flex items-center gap-3 p-3 bg-[#151515] rounded-lg">
            <User className="w-5 h-5 text-[#6953FF] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Pseudo
              </p>
              <p className="text-white font-medium text-sm">
                {profile?.username || "Non défini"}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 p-3 bg-[#151515] rounded-lg">
            <Mail className="w-5 h-5 text-[#6953FF] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Adresse e-mail
              </p>
              <p className="text-white text-sm">{user.email}</p>
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center gap-3 p-3 bg-[#151515] rounded-lg">
            <Star className="w-5 h-5 text-[#6953FF] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Score
              </p>
              <p className="text-white text-sm">
                {profile?.scores || 0} points
              </p>
            </div>
          </div>

          {/* Account Age */}
          <div className="flex items-center gap-3 p-3 bg-[#151515] rounded-lg">
            <Calendar className="w-5 h-5 text-[#6953FF] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Compte créé il y a
              </p>
              <p className="text-white text-sm">
                {calculateAccountAge(user.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6 pt-4 border-t border-[#2b2b2b]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1a1a1a] hover:bg-[#252525] text-gray-300 font-medium rounded-lg border border-[#2b2b2b] transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-[#111] border border-[#2b2b2b] rounded-xl p-4">
        {/* Tab Navigation */}
        <div className="flex border-b border-[#2b2b2b] mb-4 overflow-x-auto">
          <button
            onClick={() => handleTabChange("documents")}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "documents"
                ? "border-[#6953FF] text-[#6953FF]"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            <FileText className="w-4 h-4" />
            Mes documents
          </button>
          <button
            onClick={() => handleTabChange("posts")}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "posts"
                ? "border-[#6953FF] text-[#6953FF]"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Mes questions
          </button>
          <button
            onClick={() => handleTabChange("comments")}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "comments"
                ? "border-[#6953FF] text-[#6953FF]"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Mes commentaires
          </button>
        </div>

        {/* Tab Content Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">
            {activeTab === "documents" && "Mes documents"}
            {activeTab === "posts" && "Mes questions"}
            {activeTab === "comments" && "Mes commentaires"}
          </h2>
          {activeTab === "documents" && (
            <Link
              to="/upload"
              className="text-[#6953FF] hover:text-[#5a47e0] text-sm font-medium"
            >
              Téléverser
            </Link>
          )}
          {activeTab === "posts" && (
            <Link
              to="/ask"
              className="text-[#6953FF] hover:text-[#5a47e0] text-sm font-medium"
            >
              Poser une question
            </Link>
          )}
        </div>

        {/* Tab Content */}
        {renderContent()}
      </div>
    </div>
  );
};

// Card Components (keep the same as before)
const DocumentCard = ({ doc, formatFileSize }) => (
  <div className="bg-[#151515] border border-[#2b2b2b] rounded-lg p-3">
    <div className="flex items-start gap-2">
      <div className="w-8 h-8 bg-[#2d3748] rounded flex items-center justify-center flex-shrink-0">
        <FileText className="w-4 h-4 text-[#6953FF]" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-white truncate">{doc.title}</h3>
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
            onClick={() => window.open(`${doc.file_url}?download=`, "_blank")}
            className="flex items-center gap-1 px-2 py-1 bg-[#2b2b2b] hover:bg-[#3a3a3a] text-gray-200 rounded text-xs"
          >
            <FileText className="w-3 h-3" />
            Télécharger
          </button>
        </div>
      </div>
    </div>
  </div>
);

const PostCard = ({ post, formatDate }) => (
  <div className="bg-[#151515] border border-[#2b2b2b] rounded-lg p-3">
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
        </div>
      </div>
    </div>
  </div>
);

const CommentCard = ({ comment, formatDate }) => (
  <div className="bg-[#151515] border border-[#2b2b2b] rounded-lg p-3">
    <div className="flex items-start gap-2">
      <div className="w-8 h-8 bg-[#2d3748] rounded flex items-center justify-center flex-shrink-0">
        <MessageCircle className="w-4 h-4 text-[#6953FF]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
          <span className="font-medium text-white">{comment.post_title}</span>
          <span>•</span>
          <span>{formatDate(comment.posted_at)}</span>
        </div>
        <p className="text-gray-300 text-sm line-clamp-3">{comment.content}</p>
        <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500">
          <span>{comment.scores || 0} points</span>
        </div>
        <div className="flex gap-1.5 mt-2">
          <Link
            to={`/community/${comment.post_id}`}
            className="flex items-center gap-1 px-2 py-1 bg-[#6953FF] hover:bg-[#5a47e0] text-white rounded text-xs"
          >
            <MessageCircle className="w-3 h-3" />
            Voir la discussion
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Profile;
