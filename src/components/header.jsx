// src/components/Header.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../services/supabase";
import Logo from "./logo";
import { User, LogOut } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Auth listener
  useEffect(() => {
    let isSubscribed = true;

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (isSubscribed) {
        setUser(session?.user || null);
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (isSubscribed) {
          setUser(session?.user || null);
        }
      }
    );

    return () => {
      isSubscribed = false;
      subscription?.unsubscribe();
    };
  }, []);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    closeMenu();
    navigate("/login", { replace: true });
  };

  // 🌀 While checking auth, show skeleton
  if (loading) {
    return (
      <header className="flex justify-center bg-[#111] text-[hsl(0_0%_80%)] border-b border-b-[#bdbdbd25] py-4 w-full fixed top-0 z-50 backdrop-blur-md h-16">
        <div className="flex items-center justify-between w-full max-w-7xl px-8">
          <Logo />
          <div className="hidden md:flex gap-4">
            <div className="h-6 w-20 bg-[#222] rounded animate-pulse"></div>
            <div className="h-6 w-20 bg-[#6953FF] rounded animate-pulse"></div>
          </div>
          <div className="w-7 h-5 md:hidden bg-gray-600 rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="flex justify-center bg-[#111] text-[hsl(0_0%_80%)] text-[1rem] border-b border-b-[#bdbdbd25] py-4 w-full fixed top-0 z-50 backdrop-blur-md h-16">
      <div className="flex flex-row justify-between items-center w-full max-w-7xl px-8">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
          <ul className="flex flex-row gap-8 w-full justify-center">
            <li className="cursor-pointer px-3 py-1 rounded-[30px] hover:text-white hover:bg-[#222] transition-colors duration-300 ease-in-out">
              <Link to="/" className="block w-full">Accueil</Link>
            </li>
            <li className="cursor-pointer px-3 py-1 rounded-[30px] hover:text-white hover:bg-[#222] transition-colors duration-300 ease-in-out">
              <Link to="/community">Communauté</Link>
            </li>
            <li className="cursor-pointer px-3 py-1 rounded-[30px] hover:text-white hover:bg-[#222] transition-colors duration-300 ease-in-out">
              <Link to="/resources">Ressources</Link>
            </li>
          </ul>
        </nav>

        {/* Desktop Auth Area */}
        <div className="hidden md:flex flex-row gap-4 h-full items-center">
          {!user ? (
            <>
              <Link
                to="/login"
                className="border border-[#bdbdbd25] rounded-[6px] px-3 py-1 text-[hsl(0_0%_95%)] cursor-pointer hover:text-white hover:bg-[#222] transition-colors duration-300 ease-in-out"
                onClick={closeMenu}
              >
                Se connecter
              </Link>
              <Link
                to="/signup"
                className="inline-block bg-[hsl(0_0%_95)] text-black px-3 py-1 rounded-[6px] hover:bg-[hsl(0_0%_80%)] transition-colors duration-300 ease-in-out"
                onClick={closeMenu}
              >
                S'inscrire
              </Link>
            </>
          ) : (
            <div className="relative group">
              <button
                className="flex items-center justify-center w-8 h-8 rounded-full border border-[#bdbdbd25] bg-[#222] text-white hover:opacity-90 transition-opacity"
                aria-label="Menu utilisateur"
              >
                <User className="w-4 h-4" />
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#2b2b2b] rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-300 hover:bg-[#2b2b2b] hover:text-white transition-colors"
                  onClick={closeMenu}
                >
                  Mon profil
                </Link>
                <Link
                  to="/upload"
                  className="block px-4 py-2 text-gray-300 hover:bg-[#2b2b2b] hover:text-white transition-colors"
                  onClick={closeMenu}
                >
                  Téléverser
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-[#2b2b2b] hover:text-red-400 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="flex flex-col justify-between w-7 h-5 z-50 cursor-pointer md:hidden"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <div className={`h-0.5 bg-gray-300 w-full rounded-xl ${isMenuOpen ? 'rotate-45 translate-y-2' : ''} transition-transform duration-300 ease-in-out`}></div>
          <div className={`h-0.5 bg-gray-300 w-full rounded-xl ${isMenuOpen ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ease-in-out`}></div>
          <div className={`h-0.5 bg-gray-300 w-full rounded-xl ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''} transition-transform duration-300 ease-in-out`}></div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <button
          className="absolute bg-black z-40 h-dvh w-full opacity-50"
          onClick={closeMenu}
          aria-label="Fermer le menu"
        ></button>
      )}

      {/* Mobile Menu */}
      <div
        className={`flex flex-col items-center w-70 fixed top-0 right-0 h-dvh z-45 bg-[#111] pt-20 text-gray-300 md:hidden transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <ul className="flex w-full flex-col items-center gap-8 p-10">
          <li className="w-full text-xl text-[#bbb] font-bold border-b-[#bdbdbd25] pb-3 border-b hover:text-gray-100 transition-colors duration-300 ease-in-out">
            <Link to="/" onClick={closeMenu}>Accueil</Link>
          </li>
          <li className="w-full text-xl text-[#bbb] font-bold border-b-[#bdbdbd25] pb-3 border-b hover:text-gray-100 transition-colors duration-300 ease-in-out">
            <Link to="/community" onClick={closeMenu}>Communauté</Link>
          </li>
          <li className="w-full text-xl text-[#bbb] font-bold border-b-[#bdbdbd25] pb-3 border-b hover:text-gray-100 transition-colors duration-300 ease-in-out">
            <Link to="/resources" onClick={closeMenu}>Ressources</Link>
          </li>
          {user && (
            <>
              <li className="w-full text-xl text-[#bbb] font-bold border-b-[#bdbdbd25] pb-3 border-b hover:text-gray-100 transition-colors duration-300 ease-in-out">
                <Link to="/upload" onClick={closeMenu}>Téléverser</Link>
              </li>
              <li className="w-full text-xl text-[#bbb] font-bold border-b-[#bdbdbd25] pb-3 border-b hover:text-gray-100 transition-colors duration-300 ease-in-out">
                <Link to="/profile" onClick={closeMenu}>Profil</Link>
              </li>
            </>
          )}
          {!user ? (
            <>
              <li className="w-full text-xl text-[#bbb] font-bold text-center border border-[#cccccc25] rounded-[6px] py-2 hover:bg-[#bbbbbb15] transition-colors duration-300 ease-in-out">
                <Link to="/login" onClick={closeMenu}>Se connecter</Link>
              </li>
              <li className="w-full text-xl font-bold text-center bg-[hsl(0_0%_90%)] text-black -translate-y-4 rounded-[6px] py-2 hover:bg-[hsl(0_0%_85%)] transition-colors duration-300 ease-in-out">
                <Link to="/signup" onClick={closeMenu}>S'inscrire</Link>
              </li>
            </>
          ) : (
            <li className="w-full text-xl font-bold text-center border border-red-500/30 text-red-400 rounded-[6px] py-2 hover:bg-red-500/10 transition-colors duration-300 ease-in-out">
              <button onClick={handleLogout} className="w-full">Déconnexion</button>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;