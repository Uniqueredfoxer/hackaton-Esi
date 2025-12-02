import DocumentCard from "./documentCard";
import { useState, useEffect } from "react";
import { fetchDocuments } from "../services/documentServices";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const LatestUploadSection = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const getDocuments = async () => {
      try {
        const { data: docs } = await fetchDocuments();
        setDocuments(docs);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      }
    };

    getDocuments();
  }, []);

  return (
    <section className="w-full px-4 md:px-20 mt-4">
      <div className="flex justify-between items-center ">
        <h1 className="text-2xl font-bold px-5 py-2 rounded-t-[8px] w-fit text-left text-[hsl(0_0%_80%)]">
          Récents
        </h1>
        <Link
          to="/resources"
          className="flex items-center gap-1 text-gray-400 hover:text-white font-medium transition-colors duration-300 group"
        >
          Voir tout
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
      {/* Document Grid */}
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        {documents.slice(0, 4).map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>
    </section>
  );
};

export default LatestUploadSection;
