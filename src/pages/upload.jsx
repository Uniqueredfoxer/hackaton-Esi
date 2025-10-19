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
    <div className="flex flex-col items-center max-w-7xl border border-[#bdbdbd25] bg-[#222] p-6 rounded-md w-fit mx-auto mt-12 md:px-2">
      <h1 className="text-xl  text-center font-black text-[hsl(0_0%_85%)] md:text-3xl md:px-10">Téléverser un document</h1>
      <form onSubmit={handleSubmit} className="mt-4  w-full flex flex-col gap-4">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Titre du document" className="flex-1 px-3 py-2 rounded-md bg-[#111] border border-[#2b2b2b] text-gray-200" />
        <input type="file" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} className="text-gray-200" />
        <select value={type} onChange={(e)=>setType(e.target.value)} className="px-3 py-2 w-full rounded-md bg-[#111] border border-[#2b2b2b] text-gray-200">
          <option>Cours</option>
          <option>TD</option>
          <option>Devoir</option>
          <option value="something">Livre</option>
        </select>
        <button className="w-fit cursor-pointer mx-auto bg-[hsl(0_0%_90%)] hover:bg-[hsl(0_0%_80%)] text-black font-semibold py-2 px-4 rounded-md">Téléverser</button>
      </form>
    </div>
  );
};

export default Upload;