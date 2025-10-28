
import { useState } from 'react';
import supabase from '../services/supabase';
import { Mail, ArrowLeft } from 'lucide-react';


const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false); // Flag for showing the success message

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const trimmedEmail = email.trim();
        
        // Supabase sends the reset email
        const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
            // CRITICAL: Replace this with your actual production URL
            // This is the page where the user lands to type their new password
            redirectTo: `${window.location.origin}/update-password`, 
        });

        setLoading(false);

        if (error) {
            // Display an error, like 'Too many requests' or another Supabase error
            setMessage(`Erreur: ${error.message}`);
        } else {
            // SECURITY/UX: Always give a success message, even if the email doesn't exist,
            // to prevent email enumeration.
            setMessage('');
            setIsSent(true); 
        }
    };

    // --- Conditional Success View ---
    if (isSent) {
        return (
            // Thème: Fond très sombre, bordure verte pour le succès
            <div className="flex flex-col items-center max-w-md mt-20 p-8 mx-4 rounded-lg bg-black border border-green-600 shadow-2xl text-center md:mx-auto">
                <Mail className="w-12 h-12 text-green-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-100 mb-2">E-mail envoyé!</h2>
                <p className="text-gray-300 mb-4">
                    Si l'adresse <strong className="text-green-400">{email}</strong> est enregistrée, un lien de réinitialisation vous a été envoyé.
                </p>
                <p className="text-gray-400 text-sm">
                    Veuillez vérifier votre boîte de réception (et vos spams).
                </p>
                {/* Lien de retour au thème sombre */}
                <a href="/login" className="mt-6 flex items-center gap-2 text-gray-300 hover:text-white font-semibold transition">
                    <ArrowLeft className="w-4 h-4" /> Retour à la connexion
                </a>
            </div>
        );
    }

    // --- Default Form View ---
    return (
        // Thème: Fond très sombre (noir), carte de connexion légèrement plus claire
        <div className="flex flex-col items-center max-w-md mx-auto mt-20 p-8 rounded-lg bg-[#141414] border border-[#bdbdbd25] shadow-2xl">
            <h1 className="text-2xl font-bold text-white mb-6 text-center md:text-3xl">Mot de passe oublié?</h1>
            <p className="text-gray-400 mb-6 text-center text-sm">
                Entrez l'adresse e-mail associée à votre compte pour recevoir un lien de réinitialisation.
            </p>

            {/* Error Message Box */}
            {message && (
                <div className="p-3 w-full rounded-md text-sm mb-4 bg-red-700 text-white">
                    {message}
                </div>
            )}

            <form onSubmit={handleReset} className="w-full flex flex-col gap-4">
                
                {/* Email Input */}
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Adresse e-mail"
                    required
                    // Input style: fond gris foncé, texte blanc
                    className="px-4 py-3 rounded-md bg-[#242424] border border-[#bdbdbd25] text-white placeholder-gray-500 focus:border-[#bdbdbd70] focus:outline-0 transition"
                />

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loading || !email}
                    // Bouton: Gris clair/blanc comme dans votre image de connexion
                    className={`
                        w-full mt-4 py-3 rounded-md font-bold text-black transition-all duration-200 
                        ${loading 
                            ? 'bg-gray-500 cursor-not-allowed' 
                            : 'bg-gray-200 hover:bg-white'}
                    `}
                >
                    {loading ? 'Envoi du lien...' : 'Envoyer le lien de réinitialisation'}
                </button>
            </form>

            {/* Lien de retour au thème sombre (texte marron/orange non utilisé ici, car c'est une action secondaire) */}
            <a href="/login" className="mt-6 flex items-center gap-1 text-sm text-gray-400 hover:text-white transition">
                <ArrowLeft className="w-4 h-4" />
                Annuler et revenir
            </a>
        </div>
    );
};

export default ForgotPasswordForm;
