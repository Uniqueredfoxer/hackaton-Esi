import { HiOutlineDownload } from "react-icons/hi";
import { PiShareFat } from "react-icons/pi";
import { TbBook } from "react-icons/tb";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";


const DocumentCard = () => {
    return(
        <div className=" flex items-center border h-auto md:h-50 w-full border-[#bdbdbd25] bg-[#222222] p-4 rounded-[8px]">
            <div className=" h-[180px] w-[100px] md:w-[120px] rounded-[8px] flex items-center justify-center bg-blue-800/50 text-blue-400 ">PDF</div>
            <div className="flex overflow-x-scroll overflow-y-scroll flex-col ml-4 text-gray-300">
                <div className="flex flex-col relative" >
                    <span className="hidden md:block text-sm absolute top-0 right-0 w-fit px-3 py-1 rounded-[8px] bg-blue-900/50 text-blue-400"> Cours </span>
                    <Link to="/document/:id"><h2 className="text-lg font-bold">Titre du document</h2></Link>
                    <div className="text-sm inline-flex items-center ">  <FaUser className="w-3 h-3 mr-1"/> <span>pseudo</span></div>
                    <p className="text-sm text-gray-400 text-wrap">Description brève du document, incluant le sujet, l'année et le module.</p>
                    <div><span className="text-sm mt-2">Module : Programmation C</span></div>
                    <div className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                        <span>PDF</span>
                        <span> • </span>
                        <span>L1</span>
                        <span> • </span>
                        <span>2020</span>
                        <span> • </span>
                        <span>2.3 MB</span>
                        <span className="hidden md:flex"> • 2.6k <HiOutlineDownload className="ml-0.5 w-5 h-5" /></span>
                    </div>
                </div>
                <div className="flex w-full justify-between items-center mt-2">
                    <div className=" flex w-auto  items-center overflow-x-auto gap-2 flex-nowrap">
                        <button  className=" flex items-center bg-[hsl(0_0%_90%)] hover:bg-[hsl(0_0%_80%)] text-black font-semibold py-1 px-3 rounded-md"> <HiOutlineDownload className="w-4 h-4 md:w-5 md:h-5"/> <span className="text-sm md:text-base">Télécharger</span></button>
                        <button className=" flex items-center bg-[#444] hover:bg-[#555] text-gray-300 font-semibold py-1 px-3 rounded-md"> <TbBook className="w-4 h-4 md:w-5 md:h-5 mr-0.5"/> <span className="text-sm md:text-base">Voir</span></button>
                        <button className="flex items-center bg-[#444] hover:bg-[#555] text-gray-300 font-semibold py-1 px-3 rounded-md"> <PiShareFat className="w-4 h-4 md:w-5 md:h-5 mr-0.5"/> <span className="text-sm md:text-base">partager</span></button>
                    </div>
                    <div className=" flex justify-center items-center text-sm text-gray-500 mt-auto position-absolute right-10 bottom-10 md:hidden"><span className="text-base mr-1">1,6k</span><HiOutlineDownload className="w-5 h-5"/></div>
                </div>

            </div>
        </div>
    )
};
export default DocumentCard;