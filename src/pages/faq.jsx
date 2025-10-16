const FAQ = () => {
  const faqs = [
    { q: "Comment télécharger un document ?", a: "Ouvre la fiche du document et clique sur Télécharger." },
    { q: "Comment poser une question sur le forum ?", a: "Connecte-toi et rends-toi sur la page Communauté, puis clique sur Poster une question." },
  ];
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-black text-[hsl(0_0%_95%)]">FAQ</h1>
      <div className="flex flex-col gap-3">
        {faqs.map((f, i) => (
          <div key={i} className="bg-[#111] border border-[#2b2b2b] rounded-md p-4 text-gray-200">
            <div className="font-semibold">{f.q}</div>
            <div className="text-gray-400 mt-2">{f.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
