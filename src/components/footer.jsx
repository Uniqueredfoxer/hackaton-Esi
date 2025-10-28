import { Link } from 'react-router-dom';
import { useState } from 'react';
import Logo from './logo';




const Footer = () => {
    const [activeTab, setActiveTab] = useState('home');
    return (
        <footer className='bg-[#111] text-gray-300 flex justify-center border-t border-t-[#bdbdbd25] items-start w-full '>
            <div className="flex flex-col max-w-5xl w-full mb-4 p-4">
                <div className="flex flex-col gap-8 px-[20%] mb-4 md:px-4 md:flex-row lg:px-8 lg:gap-16 lg:justify-between">

                    <div className="flex flex-col gap-4 items-start  max-w-60">
                        <Logo/>
                        <p className='text-sm text-gray-400'>Votre plateforme ultime pour les ressources académiques et la collaboration communautaire.</p>
                    </div>
                    <div className="flex flex-1  flex-col gap-8 justify-between items-start max-w-xs">
                        <h3 className='font-bold text-[hsl(0_0%_95%)] '>Ressources</h3>
                        <ul className='flex flex-col gap-4'>
                            <li><Link to="/resources" className={`hover:text-white cursor-pointer active:text-[hsl(0_0%_95%)] ${activeTab === 'resources' ? 'text-white' : ''}`} onClick={() => setActiveTab('resources')}>Explorer Tout</Link></li>
                            <li><Link to="/resources" className={`hover:text-white cursor-pointer active:text-[hsl(0_0%_95%)] ${activeTab === 'resources' ? 'text-white' : ''}`} onClick={() => setActiveTab('resources')}>Sujets de Devoir</Link></li>
                            <li><Link to="/resources" className={`hover:text-white cursor-pointer active:text-[hsl(0_0%_95%)] ${activeTab === 'resources' ? 'text-white' : ''}`} onClick={() => setActiveTab('resources')}>Travaux Dirigés</Link></li>
                            <li><Link to="/resources" className={`hover:text-white cursor-pointer active:text-[hsl(0_0%_95%)] ${activeTab === 'resources' ? 'text-white' : ''}`} onClick={() => setActiveTab('resources')}>Cours</Link></li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-8 justify-between items-start max-w-xs">
                        <h3 className='font-bold text-[hsl(0_0%_95%)] '>Communauté</h3>
                        <ul className='flex flex-col gap-4'>
                            <li><Link to="/community" className='hover:text-white cursor-pointer active:text-[hsl(0_0%_95%)]'>Forum</Link></li>
                            <li><Link to="/community" className={`hover:text-white cursor-pointer active:text-[hsl(0_0%_95%)] ${activeTab === 'community' ? 'text-white' : ''}`} onClick={() => setActiveTab('community')}>Meilleurs Contributions</Link></li>
                            <li><Link to="/about" className={`hover:text-white cursor-pointer active:text-[hsl(0_0%_95%)] ${activeTab === 'about' ? 'text-white' : ''}`} onClick={() => setActiveTab('about')}>A propos</Link></li>
                            <li><Link to="/about" className={`hover:text-white cursor-pointer active:text-[hsl(0_0%_95%)] ${activeTab === 'about' ? 'text-white' : ''}`} onClick={() => setActiveTab('about')}>Conditions d'utilisation</Link></li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-8 justify-between max-w-xs">
                        <h3 className='font-bold text-[hsl(0_0%_95%)] '>Support</h3>
                        <ul className='flex flex-col gap-4'>
                            <li><Link to="/FAQ" className={`hover:text-white cursor-pointer active:text-[hsl(0_0%_95%)] ${activeTab === 'FAQ' ? 'text-white' : ''}`} onClick={() => setActiveTab('FAQ')}>FAQ</Link></li>
                            <li><Link to="/help" className={`hover:text-white cursor-pointer active:text-[hsl(0_0%_95%)] ${activeTab === 'help' ? 'text-white' : ''}`} onClick={() => setActiveTab('help')}>Centre d'Aide</Link></li>
                            <li><Link to="/contact" className={`hover:text-white cursor-pointer active:text-[hsl(0_0%_95%)] ${activeTab === 'contact' ? 'text-white' : ''}`} onClick={() => setActiveTab('contact')}>Nous contacter</Link></li>
                            <li><Link to="/about" className={`hover:text-white cursor-pointer active:text-[hsl(0_0%_95%)] ${activeTab === 'about' ? 'text-white' : ''}`} onClick={() => setActiveTab('about')}>Politique de Confidentialité</Link></li>
                        </ul>
                    </div>
                </div>
                <div>
                    <hr className='h-0.5 bg-[#bdbdbd25] border-none' />
                    <p className="text-center font-bold text-sm mt-4">&copy; 2025 AKA. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    )
}
export default Footer;