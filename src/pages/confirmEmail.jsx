import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase";

const ConfirmEmail = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkVerification = async () => {
      try {
        // 1. First, check if user already has a valid session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Check if email was recently confirmed
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user?.email_confirmed_at) {
            if (mounted) {
              setMessage("✅ Votre email a été confirmé avec succès !");
              setTimeout(() => navigate("/"), 2000);
            }
            return;
          }
        }

        // 2. Set up auth state listener for future changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event) => {
            console.log("Auth state changed:", event);
            
            if (!mounted) return;

            if (event === "SIGNED_IN" || event === "USER_UPDATED") {
              // User signed in or was updated (email confirmed)
              const { data: { user } } = await supabase.auth.getUser();
              
              if (user?.email_confirmed_at) {
                setMessage("✅ Votre email a été confirmé avec succès !");
                setTimeout(() => navigate("/"), 2000);
              }
            } else if (event === "TOKEN_REFRESHED") {
              // Session was refreshed, check email confirmation
              const { data: { user } } = await supabase.auth.getUser();
              
              if (user?.email_confirmed_at) {
                setMessage("✅ Votre email a été confirmé avec succès !");
                setTimeout(() => navigate("/"), 2000);
              }
            }
          }
        );

        // 3. Wait a bit for any pending redirect from Supabase
        setTimeout(() => {
          if (mounted) {
            setLoading(false);
        
            if (!message) {
              setMessage("En attente de confirmation... Vérifiez votre email et cliquez sur le lien.");
            }
          }
        }, 3000);
        return () => {
          mounted = false;
          subscription.unsubscribe();
        };

      } catch (error) {
        console.error("Verification check error:", error);
        if (mounted) {
          setMessage("❌ Une erreur est survenue lors de la vérification.");
          setLoading(false);
        }
      }
    };

    checkVerification();
  }, [navigate, message]);

  return (
    <div className=" px-4 flex items-center justify-center min-h-screen">
      <div className="text-center">
        {loading ? (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4">Vérification en cours...</p>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-[30dvh] mt-[10dvh] p-4">
            <p className="md:text-lg px-4 text-gray-300">{message}</p>
            {message.includes("En attente") && (
              <button
                onClick={() => navigate("/login")}
                className="mt-4 px-4 py-2 w-fit font-bold border-2 border-gray-300/70  text-gray-300 rounded-[10px] hover:bg-gray-300 hover:text-black transition-colors duration-300 ease-in-out"
              >
                Retour à la connexion
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmail;