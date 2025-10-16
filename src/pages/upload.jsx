import { useState } from "react";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("Cours");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Upload to Supabase storage and create resource record
    console.log({ title, file, type });
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-black text-[hsl(0_0%_95%)]">Téléverser un document</h1>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Titre du document" className="px-3 py-2 rounded-md bg-[#111] border border-[#2b2b2b] text-gray-200" />
        <input type="file" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} className="text-gray-200" />
        <select value={type} onChange={(e)=>setType(e.target.value)} className="px-3 py-2 rounded-md bg-[#111] border border-[#2b2b2b] text-gray-200 w-40">
          <option>Cours</option>
          <option>TD</option>
          <option>Devoir</option>
        </select>
        <button className="w-fit bg-[hsl(0_0%_90%)] text-black font-semibold py-2 px-4 rounded-md">Téléverser</button>
      </form>
    </div>
  );
};

export default Upload;