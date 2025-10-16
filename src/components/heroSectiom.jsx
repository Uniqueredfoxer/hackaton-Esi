import SearchBar from "./searchBar";

const HeroSection = () => {
    return (
        <section className="bg-[#111] text-gray-300 flex flex-col justify-start items-center w-full border rounded-2xl border-[#bdbdbd25]">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-center max-w-4xl px-4">Bienvenue sur AKA</h1>
            <p className="text-lg  text-center max-w-3xl px-4">Accède aux cours, TD, anciens devoirs, pose des questions et collabore avec tes camarades à travers notre forum intégré</p>
            <SearchBar />
        </section>
    );
};
export default HeroSection;