import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import supabase from "../services/supabase";

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Vérification en cours...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      const token_hash = searchParams.get("token");
      const type = searchParams.get("type");
      const next = searchParams.get("redirect_to") || "/";

      if (!token_hash || !type) {
        setMessage("Lien de confirmation invalide.");
        setLoading(false);
        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type,
        });

        if (error) {
          console.error("Confirmation error:", error);
          setMessage(
            "❌ Échec de la confirmation. Le lien a peut-être expiré.",
          );
        } else {
          setMessage("✅ Votre email a été confirmé ! Redirection...");
          setTimeout(() => navigate(next), 2000);
        }
      } catch (err) {
        console.error(err);
        setMessage("Une erreur inattendue est survenue.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="text-center p-6">
        <h1 className="text-2xl font-bold mb-4">Confirmation d'email</h1>
        {loading ? <p>Vérification en cours...</p> : <p>{message}</p>}
      </div>
    </div>
  );
};

export default ConfirmEmail;
