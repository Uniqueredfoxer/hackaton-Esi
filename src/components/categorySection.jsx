import { BiBook } from "react-icons/bi";
import { BiBookContent } from "react-icons/bi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { HiOutlineDocument } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const CategorySection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    // Navigate to documents page with category filter
    navigate(`/resources?category=${category}`);
  };

  return (
    <div className="mt-10 max-w-7xl px-4 py-10 md:px-20">
      <h2 className="text-2xl font-bold text-gray-300 mb-4">Catégories</h2>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <li
          onClick={() => handleCategoryClick("cours")}
          className="border-box font-bold flex cursor-pointer p-10 bg-blue-900/40 text-blue-400 border border-[#bdbdbd25] rounded-[8px] flex-col items-center text-base hover:bg-blue-800/40 transition-colors duration-400 ease-in-out"
        >
          <BiBookContent className="h-6 w-6" />
          <span>Cours</span>
        </li>
        <li
          onClick={() => handleCategoryClick("exercices")}
          className="border-box font-bold flex cursor-pointer p-10 bg-green-900/40 text-green-400 border border-[#bdbdbd25] rounded-[8px] flex-col items-center text-base hover:bg-green-800/40 transition-colors duration-400 ease-in-out"
        >
          <HiOutlineDocumentText className="h-6 w-6" />
          <span>Exercices</span>
        </li>
        <li
          onClick={() => handleCategoryClick("devoirs")}
          className="border-box font-bold flex cursor-pointer p-10 bg-purple-900/40 text-purple-400 border border-[#bdbdbd25] rounded-[8px] flex-col items-center text-base hover:bg-purple-800/40 transition-colors duration-400 ease-in-out"
        >
          <HiOutlineDocument className="h-6 w-6" />
          <span>Devoirs</span>
        </li>
        <li
          onClick={() => handleCategoryClick("livre")}
          className="border-box font-bold flex cursor-pointer p-10 bg-yellow-900/40 text-yellow-400 border border-[#bdbdbd25] rounded-[8px] flex-col items-center text-base hover:bg-yellow-800/40 transition-colors duration-400 ease-in-out"
        >
          <BiBook className="h-6 w-6" />
          <span>Livres</span>
        </li>
      </ul>
    </div>
  );
};

export default CategorySection;
