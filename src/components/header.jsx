import {Link} from 'react-router-dom';
import { useState } from 'react';



const Header = () =>{

    const [isMenuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!isMenuOpen);
    const closeMenu = () => setMenuOpen(false);
    const [activeTab, setActiveTab] = useState('home');

    

    return(
        <>
            <header className="flex justify-center bg-[#111] text-[hsl(0_0%_80%)] text-[1rem] border-b border-b-[#bdbdbd25] py-4 w-full fixed top-0 z-100 backdrop-blur-md h-16">
                <div className="flex flex-row justify-between items-center w-full max-w-7xl px-8">
                    <div className="text-2xl font-black text-[hsl(0_0%_95%)] ">
                        ESI
                    </div>
                    <nav className="hidden  lg:flex">
                        <ul className="flex flex-row gap-8 w-full justify-center">
                            <li className={`cursor-pointer px-3 py-1 rounded-[30px] hover:text-white hover:bg-[#222] transition-colors duration-300 ease-in-out ${activeTab === 'home' ? 'text-white px-3 py-1 rounded-[30px] bg-[#222]' : ''}`} onClick={() => setActiveTab('home')} ><Link to="/" className='block w-full '>Accueil</Link></li>
                            <li className={`cursor-pointer px-3 py-1 rounded-[30px] hover:text-white hover:bg-[#222] transition-colors duration-300 ease-in-out ${activeTab === 'community' ? 'text-white px-3 py-1 rounded-[30px] bg-[#222]' : ''}`} onClick={() => setActiveTab('community')}><Link to="/community">Communauté</Link></li>
                            <li className={`cursor-pointer px-3 py-1 rounded-[30px] hover:text-white hover:bg-[#222] transition-colors duration-300 ease-in-out ${activeTab === 'resources' ? 'text-white px-3 py-1 rounded-[30px] bg-[#222]' : ''}`} onClick={() => setActiveTab('resources')}><Link to="/resources">Resources</Link></li>
                            <li className={`cursor-pointer px-3 py-1 rounded-[30px] hover:text-white hover:bg-[#222] transition-colors duration-300 ease-in-out ${activeTab === 'upload' ? 'text-white px-3 py-1 rounded-[30px] bg-[#222]' : ''}`} onClick={() => setActiveTab('upload')}><Link to="/upload">Televerser</Link></li>
                            <li className={`cursor-pointer px-3 py-1 rounded-[30px] hover:text-white hover:bg-[#222] transition-colors duration-300 ease-in-out ${activeTab === 'profile' ? 'text-white px-3 py-1 rounded-[30px] bg-[#222]' : ''}`} onClick={() => setActiveTab('profile')}><Link to="/profile">Profile</Link></li>
                        </ul>
                    </nav>
                    <div className=" flex-row gap-4 h-full items-center hidden md:flex">
                        <Link to="/login" className={`border border-[#bdbdbd25] rounded-[6px] px-2 py-1 text-[hsl(0_0%_95%)] cursor-pointer hover:text-white hover:bg-[#222] transition-colors duration-300 ease-in-out ${activeTab === 'login' ? 'bg-[#bbbbbb15]' : ''}`} onClick={() => setActiveTab('login')}>se connecter</Link>
                        <Link to="/signup" className={`inline-block bg-[hsl(0_0%_95)] text-black  px-2 py-1 rounded-[6px] hover:bg-[hsl(0_0%_80%)] transition-colors duration-300 ease-in-out ${activeTab === 'signup' ? 'bg-[hsl(0_0%_80%)]' : ''}`} onClick={() => setActiveTab('signup')}>S'inscrire</Link>
                    </div>
                    <button className="flex flex-col justify-between w-7 h-5 z-120 cursor-pointer fixed right-5 md:hidden" onClick={toggleMenu}>
                        <div className={`h-0.5 bg-gray-300 w-full rounded-xl ${isMenuOpen ? 'rotate-45 translate-y-2 transition-transform duration-300 ease-in-out': 'rotate-0 transition-transform duration-300 ease-in-out'} `}></div>
                        <div className={`h-0.5 bg-gray-300 w-full rounded-xl ${isMenuOpen ? 'opacity-0 transition-opacity duration-300 ease-in-out': 'opacity-100 transition-opacity duration-300 ease-in-out'} `}></div>
                        <div className={`h-0.5 bg-gray-300 w-full rounded-xl ${isMenuOpen ? '-rotate-45 -translate-y-2 transition-transform duration-300 ease-in-out': 'rotate-0 transition-transform duration-300 ease-in-out'} `}></div>
                    </button>
                </div>
                <div className={`flex flex-col items-center w-70 fixed top-0 right-0 h-dvh z-110 bg-[#111] pt-20 text-gray-300 md:hidden ${isMenuOpen? 'translate-x-0 transition-transform duration-300 ease-in-out': 'translate-x-full transition-transform duration-300 ease-in-out'}`}>
                    <ul className='flex w-full flex-col items-center gap-8 p-10'>
                        <li className={`w-full text-xl text-[#bbb] font-bold border-b-[#bdbdbd25] pb-3 border-b hover:text-gray-100 transition-colors duration-300 ease-in-out active:text-white ${activeTab === 'home' ? 'text-white' : ''}`} onClick={closeMenu}><Link to="/">Accueil</Link></li>
                        <li className={`w-full text-xl text-[#bbb] font-bold border-b-[#bdbdbd25] pb-3 border-b hover:text-gray-100 transition-colors duration-300 ease-in-out active:text-white ${activeTab === 'community' ? 'text-white' : ''}`} onClick={closeMenu}><Link to="/community">Communauté</Link></li>
                        <li className={`w-full text-xl text-[#bbb] font-bold border-b-[#bdbdbd25] pb-3 border-b hover:text-gray-100 transition-colors duration-300 ease-in-out active:text-white ${activeTab === 'resources' ? 'text-white' : ''}`} onClick={closeMenu}><Link to="/resources">Resources</Link></li>
                        <li className={`w-full text-xl text-[#bbb] font-bold border-b-[#bdbdbd25] pb-3 border-b hover:text-gray-100 transition-colors duration-300 ease-in-out active:text-white ${activeTab === 'upload' ? 'text-white' : ''}`} onClick={closeMenu}><Link to="/upload">Televerser</Link></li>
                        <li className={`w-full text-xl text-[#bbb] font-bold border-b-[#bdbdbd25] pb-3 border-b hover:text-gray-100 transition-colors duration-300 ease-in-out active:text-white ${activeTab === 'profile' ? 'text-white' : ''}`} onClick={closeMenu}><Link to="/profile">Profile</Link></li>
                        <li className={`w-full text-xl text-[#bbb] font-bold text-center border border-[#cccccc25] rounded-[6px] py-2 hover:bg-[#bbbbbb15] transition-colors duration-300 ease-in-out active:bg-[#bbbbbb15] ${activeTab === 'login' ? 'bg-[#bbbbbb15]' : ''}`} onClick={closeMenu}><Link to="/login">Se connecter</Link></li>
                        <li className={`w-full text-xl font-bold text-center bg-[hsl(0_0%_90%)] text-black -translate-y-4 rounded-[6px] py-2 hover:bg-[hsl(0_0%_85%)] transition-colors duration-300 ease-in-out active:bg-[hsl(0_0%_85%)] ${activeTab === 'signup' ? 'bg-[hsl(0_0%_85%)]' : ''}`} onClick={closeMenu}><Link to="/signup">S'inscrire</Link></li>
                    </ul>
                </div>
                <button className={` absolute bg-black z-105 h-dvh w-full lg:hidden ${isMenuOpen? 'opacity-50 transition-opacity duration-300 ease-in-out': 'opacity-0 transition-opacity duration-300 ease-in-out'}`} onClick={closeMenu}></button>
            </header>
        
        </>
    )
}
export default Header;