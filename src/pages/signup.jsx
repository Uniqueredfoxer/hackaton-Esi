import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/auth";
import {Mail, User} from 'lucide-react'

const Signup = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSingedUp, setIsSignedUp] = useState(false);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!username || !email || !password || !confirm) {
            setError("Veuillez remplir tous les champs.");
            return;
        }
        if (password !== confirm) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }
        if (password.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        setLoading(true);
        try {
            await signUp(username, email, password);
            navigate("/");
        } catch (err) {
            setError(err?.message || "Échec de l'inscription. Réessayez plus tard.");
        } finally {
            setLoading(false);
        }
    };



    if (isSignedUp) {
        return (
            // Success Message Component
            <div className="flex flex-col items-center max-w-lg mx-auto mt-20 p-8 rounded-lg bg-[#1a202c] border border-green-600 shadow-2xl text-center">
                <Mail className="w-12 h-12 text-green-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-100 mb-2">Vérifiez votre boîte de réception!</h2>
                <p className="text-gray-300 mb-4">
                    Un e-mail de confirmation a été envoyé à <strong className="text-green-400">{email}</strong>.
                </p>
                <p className="text-gray-400 text-sm">
                    Veuillez cliquer sur le lien dans cet e-mail pour valider votre compte et vous connecter.
                </p>
                <button 
                    onClick={() => setIsSignedUp(false)}
                    className="mt-6 py-2 px-4 rounded-md font-semibold bg-[#6953FF] text-white hover:bg-[#5a44e5] transition"
                >
                    Retour à l'inscription
                </button>
            </div>
        );
    }


    return (
        <div className="flex px-4 justify-center mt-[10dvh]">
            <div className="w-full max-w-lg bg-[#111] border border-[#2b2b2b] rounded-lg p-8 shadow-md">
                <h2 className="text-2xl font-black text-[hsl(0_0%_95%)] mb-2">Créer un compte</h2>
                <p className="text-sm text-gray-400 mb-6">Rejoins AKA pour partager et accéder aux ressources académiques.</p>

                {error && (
                    <div className="bg-red-900/60 text-red-200 px-4 py-2 rounded-md mb-4">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="flex flex-col">
                        <span className="text-sm text-gray-300 mb-1">Pseudo</span>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-[#111] border border-[#2b2b2b] px-3 py-2 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#444]"
                            placeholder="ex: etudiant123"
                            autoComplete="name"
                            required
                        />
                    </label>

                    <label className="flex flex-col">
                        <span className="text-sm text-gray-300 mb-1">Adresse e-mail</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-[#111] border border-[#2b2b2b] px-3 py-2 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#444]"
                            placeholder="you@university.edu"
                            autoComplete="email"
                            required
                        />
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col">
                            <span className="text-sm text-gray-300 mb-1">Mot de passe</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-[#111] border border-[#2b2b2b] px-3 py-2 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#444]"
                                placeholder="••••••••"
                                autoComplete="new-password"
                            />
                        </label>

                        <label className="flex flex-col">
                            <span className="text-sm text-gray-300 mb-1">Confirmer mot de passe</span>
                            <input
                                type="password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                className="bg-[#111] border border-[#2b2b2b] px-3 py-2 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#444]"
                                placeholder="••••••••"
                                autoComplete="new-password"
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 bg-[hsl(0_0%_90%)] hover:bg-[hsl(0_0%_80%)] disabled:opacity-60 text-black font-semibold py-2 rounded-md"
                    >
                        {loading ? "Inscription…" : "Créer mon compte"}
                    </button>
                </form>

                <div className="mt-4 text-sm text-gray-400">
                    Déjà un compte? <Link to="/login" className="text-white font-semibold hover:underline" onClick={() => setActiveTab('login')}>Se connecter</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;