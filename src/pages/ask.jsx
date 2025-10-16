import { useState } from "react";

const Ask = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call community service to create a new post
    console.log({ title, content });
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-black text-[hsl(0_0%_95%)]">Poser une question</h1>
      <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Titre de la question" className="px-3 py-2 rounded-md bg-[#111] border border-[#2b2b2b] text-gray-200" />
        <textarea value={content} onChange={(e)=>setContent(e.target.value)} placeholder="Explique ta question..." rows={8} className="px-3 py-2 rounded-md bg-[#111] border border-[#2b2b2b] text-gray-200" />
        <button className="w-fit bg-gradient-to-r from-[#3b82f6] to-[#7c3aed] text-white font-semibold py-2 px-4 rounded-md">Publier</button>
      </form>
    </div>
  );
};

export default Ask;