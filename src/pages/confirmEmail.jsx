// src/pages/Confirm.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import supabase from '../services/supabase';

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Vérification en cours...');

  useEffect(() => {
    const verifyEmail = async () => {
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      const next = searchParams.get('next') || '/';

      if (!token_hash || !type) {
        setMessage('Lien de confirmation invalide.');
        return;
      }

      // Clear the URL params after reading (optional but clean)
      navigate(next, { replace: true });

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type,
        });

        if (error) {
          console.error('Confirmation error:', error);
          setMessage('Échec de la confirmation. Le lien a peut-être expiré.');
          return;
        }

        setMessage('✅ Votre email a été confirmé ! Redirection...');
        // Optional: auto-redirect after 2 seconds
        setTimeout(() => navigate('/'), 2000);
      } catch (err) {
        console.error(err);
        setMessage('Une erreur inattendue est survenue.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center p-6">
        <h1 className="text-2xl font-bold mb-4">Confirmation d'email</h1>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ConfirmEmail;