import { HiOutlineDownload } from "react-icons/hi";
import { PiShareFat } from "react-icons/pi";
import { TbBook } from "react-icons/tb";
import { FaUser } from "react-icons/fa";

const tagStyles = {
  Cours: "bg-blue-900/50 text-blue-400",
  TD: "bg-green-900/40 text-green-300",
  Devoir: "bg-yellow-900/40 text-yellow-300",
};

const ResourceCard = ({ resource }) => {
  const tagClass = tagStyles[resource.type] || "bg-gray-800/40 text-gray-300";

  return (
    <div className="flex items-center border w-full border-[#bdbdbd25] bg-[#222222] p-4 rounded-md">
      <div className="h-[120px] w-[90px] rounded-[8px] flex items-center justify-center bg-blue-800/30 text-blue-300">{resource.thumb || 'PDF'}</div>
      <div className="flex flex-1 flex-col ml-4 text-gray-300">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold">{resource.title}</h3>
          <span className={`text-sm w-fit px-3 py-1 rounded-[8px] ${tagClass}`}> {resource.type} </span>
        </div>
        <div className="text-sm inline-flex items-center mt-1">  <FaUser className="w-3 h-3 mr-1"/> <span>{resource.author}</span></div>
        <p className="text-sm text-gray-400 mt-2">{resource.description}</p>

        <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
          <span>{resource.format}</span>
          <span>•</span>
          <span>{resource.level}</span>
          <span>•</span>
          <span>{resource.year}</span>
          <span>•</span>
          <span>{resource.size}</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            <button className="flex items-center bg-[hsl(0_0%_90%)] hover:bg-[hsl(0_0%_80%)] text-black font-semibold py-1 px-3 rounded-md"> <HiOutlineDownload className="w-5 h-5"/> <span className="ml-2">Télécharger</span></button>
            <button className="flex items-center ml-2 bg-[#444] hover:bg-[#555] text-gray-300 font-semibold py-1 px-3 rounded-md"> <TbBook className="w-5 h-5 mr-1 mt-0.5"/> <span>Voir</span></button>
            <button className="flex items-center ml-2 bg-[#444] hover:bg-[#555] text-gray-300 font-semibold py-1 px-3 rounded-md"> <PiShareFat className="w-6 h-6 mr-1 mt-1"/> <span>Partager</span></button>
          </div>
          <div className="text-sm text-gray-500">{resource.downloads} téléchargements</div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
