import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import ClothCard from "./ClothCard";

const FeaturedOrnament = () => {
  const [cloths, setCloths] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 4;
  const endIndex = startIndex + itemsPerPage;

  const handlePrev = () => {
    setStartIndex(Math.max(startIndex - itemsPerPage, 0));
  };

  const handleNext = () => {
    setStartIndex(
      Math.min(startIndex + itemsPerPage, cloths.length - itemsPerPage)
    );
  };

  useEffect(() => {
    const fetchCloths = async () => {
      try {
        const response = await axios.get(`/api/clothes/section/FeaturedOrnament`);
        setCloths(response.data);
      } catch (error) {
        console.error("Error fetching cloths:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCloths();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex items-center space-x-4 justify-center">
      {startIndex > 0 && (
        <button onClick={handlePrev} className="pagination-button">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
      )}
      <ClothCard cloths={cloths.slice(startIndex, endIndex)} />
      {endIndex < cloths.length && (
        <button onClick={handleNext} className="pagination-button">
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default FeaturedOrnament;
