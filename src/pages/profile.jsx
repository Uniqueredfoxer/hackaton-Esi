import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import supabase from "../services/supabase";
import { User, Mail, Calendar, LogOut, ArrowRight, Lock } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Auth check
  useEffect(() => {
    let isSubscribed = true;

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (isSubscribed) {
        setUser(session?.user || null);
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (isSubscribed) {
          setUser(session?.user || null);
        }
      }
    );

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // 🌀 Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60dvh] text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6953FF] mb-4"></div>
        <p>Chargement de votre profil...</p>
      </div>
    );
  }

  // ❌ Not logged in → show prompt
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
            Connectez-vous pour accéder à votre profil, gérer vos documents et participer à la communauté.
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

  // ✅ User is logged in → show profile

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  // Format date (e.g., "25 oct. 2024")
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="max-w-3xl w-full mx-auto px-4 py-8">
      <div className="bg-[#111] border border-[#2b2b2b] rounded-xl p-6 md:p-8 shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6953FF] to-[#3b82f6] flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">{user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'}</h1>
          <p className="text-gray-400 text-sm mt-1">{user.email}</p>
        </div>

        <div className="space-y-5">
          {/* Email */}
          <div className="flex items-start gap-4 p-4 bg-[#151515] rounded-lg">
            <div className="mt-1 p-2 bg-[#2d3748] rounded-lg">
              <Mail className="w-5 h-5 text-[#6953FF]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Adresse e-mail</p>
              <p className="text-gray-200">{user.email}</p>
            </div>
          </div>

          {/* Sign-up date */}
          <div className="flex items-start gap-4 p-4 bg-[#151515] rounded-lg">
            <div className="mt-1 p-2 bg-[#2d3748] rounded-lg">
              <Calendar className="w-5 h-5 text-[#6953FF]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Inscrit depuis</p>
              <p className="text-gray-200">{formatDate(user.created_at)}</p>
            </div>
          </div>

          {/* User ID (optional, for debugging) */}
          <div className="flex items-start gap-4 p-4 bg-[#151515] rounded-lg">
            <div className="mt-1 p-2 bg-[#2d3748] rounded-lg">
              <User className="w-5 h-5 text-[#6953FF]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">ID utilisateur</p>
              <p className="text-gray-200 text-sm font-mono truncate max-w-xs">{user.id}</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8 pt-6 border-t border-[#2b2b2b]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1a1a1a] hover:bg-[#252525] text-gray-300 font-medium rounded-lg border border-[#2b2b2b] transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;