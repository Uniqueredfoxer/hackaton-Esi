import { useEffect, useState } from "react";
import QuestionCard from "../components/questionCard";
import { fetchPosts } from "../services/communityService";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchPosts().then((p) => {
      if (!mounted) return;
      setPosts(p);
      setLoading(false);
    });
    return () => (mounted = false);
  }, []);

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-[hsl(0_0%_95%)]">Communauté</h1>
      </div>
      <div className="flex px-6 md:px-10 flex-col gap-4 justify-center">
        {loading ? <div className="text-gray-400">Chargement des posts...</div> : posts.map((p) => <QuestionCard key={p.id} post={p} />)}
      </div>
    </div>
  );
};

export default Community;