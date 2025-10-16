import { useEffect, useState } from "react";
import DocumentCard from "../components/documentCard";
import SearchBar from "../components/searchBar"
import { fetchResources } from "../services/resourceService";

const tagOptions = ["Tout", "Cours", "TD", "Devoir"];

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [query, setQuery] = useState("");
    const [tag, setTag] = useState("Tout");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetchResources({ page, tag, q: query }).then((res) => {
            if (!mounted) return;
            setResources(res);
            setLoading(false);
        });
        return () => (mounted = false);
    }, [page, tag, query]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-center"><SearchBar/></div>
            <h1 className=" px-4 text-3xl font-black text-[hsl(0_0%_95%)]">Ressources</h1>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="px-4 hidden md:flex gap-2">
                        {tagOptions.map((t) => (
                            <button
                                key={t}
                                onClick={() => { setTag(t); setPage(1); }}
                                className={`px-3 py-1 rounded-md font-semibold ${t === tag ? 'bg-[#2b2b2b] text-white' : 'bg-[#111] text-gray-300 border border-[#2b2b2b]'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid px-4 grid-cols-1 gap-2 md:grid-cols-2">
                {loading ? (
                    <div className="text-gray-400">Chargement...</div>
                ) : resources.length === 0 ? (
                    <div className="text-gray-400">Aucune ressource trouvée.</div>
                ) : (
                    resources.map((r) => <DocumentCard key={r.id} resource={r} />)
                )}
            </div>

            <div className="flex justify-center items-center gap-4 mt-4">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 rounded-md bg-[#111] text-gray-300 border border-[#2b2b2b]">Précédent</button>
                <span className="text-gray-400">Page {page}</span>
                <button onClick={() => setPage((p) => p + 1)} className="px-3 py-1 rounded-md bg-[#111] text-gray-300 border border-[#2b2b2b]">Suivant</button>
            </div>
        </div>
    );
};

export default Resources;