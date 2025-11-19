import { useState } from 'react';
import supabase from '../services/supabase';
import { useNavigate } from 'react-router-dom';

const UpdatePasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setMessage('Les mots de passe ne correspondent pas.');
            return;
        }
        
        if (newPassword.length < 8) {
            setMessage('Le mot de passe doit contenir au moins 8 caractères.');
            return;
        }

        setLoading(true);
        setMessage('Mise à jour du mot de passe en cours...');
        
        // This relies on the session token provided in the URL by the email link
        const { error } = await supabase.auth.updateUser({ password: newPassword });

        setLoading(false);

        if (error) {
            // Note: If the session token has expired, this error will occur.
            setMessage(`delai expiré: ${error.message}. Veuillez redemander un lien.`);
        } else {
            setMessage('Mot de passe mis à jour avec succès! Vous êtes maintenant connecté.');
            // Redirect the user to the home page or dashboard after a short delay
            setTimeout(() => {
                navigate('/');
            }, 2000); 
        }
    };

    return (
        // Uses the established dark/accent palette
        <div className="flex flex-col items-center max-w-md mx-auto mt-20 p-8 rounded-lg bg-[#1a202c] border border-[#2d3748] shadow-2xl">
            <h1 className="text-3xl font-bold text-gray-100 mb-6 text-center">Nouveau mot de passe</h1>
            
            <form onSubmit={handleUpdatePassword} className="w-full flex flex-col gap-4">
                
                {/* New Password Input */}
                <input 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nouveau mot de passe"
                    required
                    className="px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:border-[#bdbdbd60] transition"
                />

                {/* Confirm Password Input */}
                <input 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmer le mot de passe"
                    required
                    className="px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:border-[#bdbdbd60] transition"
                />

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loading || !newPassword || newPassword !== confirmPassword}
                    className={`
                        w-full mt-2 py-3 rounded-md font-bold text-black transition-all duration-200 
                        ${loading || !newPassword || newPassword !== confirmPassword 
                            ? 'bg-gray-500 cursor-not-allowed' 
                            : 'bg-[#f0f0f0] hover:bg-[#f5f5f5]'}
                    `}
                >
                    {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                </button>
            </form>
            
            {message && (
                <p className={`mt-4 text-sm ${message.startsWith('Erreur') ? 'text-red-400' : 'text-green-400'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default UpdatePasswordPage;