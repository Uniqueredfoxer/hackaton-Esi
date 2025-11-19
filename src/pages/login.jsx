import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../services/auth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      // on success, redirect to home or profile
      navigate("/");
    } catch (err) {
      setError(
        err?.message || "Échec de la connexion. Vérifiez vos identifiants.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex px-4 justify-center h-[55dvh] mt-[10dvh]">
      <div className="w-full max-w-md bg-[#111] border border-[#2b2b2b] rounded-lg p-8 shadow-md">
        <h2 className="text-2xl font-black text-[hsl(0_0%_95%)] mb-2">
          Connexion
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Connecte-toi pour accéder à tes ressources et au forum.
        </p>

        {error && (
          <div className="bg-red-900/60 text-red-200 px-4 py-2 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col">
            <span className="text-sm text-gray-300 mb-1">Adresse e-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#111] border border-[#2b2b2b] px-3 py-2 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#444]"
              placeholder="email@exemple.com"
              autoComplete="email"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-gray-300 mb-1">Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#111] border border-[#2b2b2b] px-3 py-2 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#444]"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[hsl(0_0%_90%)] hover:bg-[hsl(0_0%_80%)] disabled:opacity-60 text-black font-semibold py-2 rounded-md"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-400 w-full">
          Pas encore de compte?{" "}
          <Link
            to="/signup"
            className="text-white font-semibold hover:underline"
          >
            S'inscrire
          </Link>
        </div>
        <Link
          to="/forgot-password"
          className="cursor-pointer mt-5 text-white text-sm font-semibold hover:underline"
        >
          j'ai oublié mon mot de passe
        </Link>
      </div>
    </div>
  );
};

export default Login;
