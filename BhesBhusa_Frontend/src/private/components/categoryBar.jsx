import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft, Tag } from "lucide-react";

const CategoryBar = ({ onCategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);
  const [categoryClothes, setCategoryClothes] = useState({});
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [noClothesMessage, setNoClothesMessage] = useState("");

  const categories = [
    { name: "Newari Dress" },
    { name: "Gurung Dress" },
    { name: "Tamang Dress" },
    { name: "Sherpa Dress" },
    { name: "Magar Dress" },
    { name: "Rai Dress" },
    { name: "Limbu Dress" },
    { name: "Tharu Dress" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchClothes();
  }, []);

  const fetchClothes = async () => {
    try {
      const response = await fetch("https://localhost:3000/api/clothes");
      const data = await response.json();

      const clothesMap = categories.reduce((acc, category) => {
        acc[category.name] = 0;
        return acc;
      }, {});

      data.forEach(item => {
        if (clothesMap[item.category] !== undefined) {
          clothesMap[item.category]++;
        }
      });

      setCategoryClothes(clothesMap);

      const firstAvailableCategory = categories.find(cat => clothesMap[cat.name] > 0)?.name;

      if (firstAvailableCategory) {
        setSelectedCategory(firstAvailableCategory);
        setNoClothesMessage("");
        onCategorySelect(firstAvailableCategory);
      } else {
        setSelectedCategory(null);
        setNoClothesMessage("No clothes available in any category.");
        onCategorySelect(null);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load clothes");
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (categoryClothes[category] === 0) {
      setNoClothesMessage("No clothes available in this category.");
      onCategorySelect(null);
    } else {
      setNoClothesMessage("");
      onCategorySelect(category);
    }
  };

  const handleNext = () => {
    const itemsPerPage = isMobile ? 3 : 6;
    if (visibleIndex + itemsPerPage < categories.length) {
      setVisibleIndex(visibleIndex + 1);
    }
  };

  const handlePrev = () => {
    if (visibleIndex > 0) {
      setVisibleIndex(visibleIndex - 1);
    }
  };

  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 rounded-lg">
        <p className="text-red-500 text-center font-medium">{error}</p>
      </div>
    );
  }

  const itemsPerPage = isMobile ? 3 : 6;
  const visibleCategories = categories.slice(visibleIndex, visibleIndex + itemsPerPage);

  return (
    <div className="relative w-full bg-gray-100 pt-6 pb-6 rounded-xl shadow-sm">
      <div className="max-w-full mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Tag className="mr-2 h-5 w-5 text-blue-600" />
            Explore Clothes by Category
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={handlePrev}
              disabled={visibleIndex === 0}
              className={`h-8 w-8 flex items-center justify-center rounded-full 
                ${visibleIndex === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white shadow-md hover:bg-blue-50 text-blue-600'}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={visibleIndex + itemsPerPage >= categories.length}
              className={`h-8 w-8 flex items-center justify-center rounded-full 
                ${visibleIndex + itemsPerPage >= categories.length
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white shadow-md hover:bg-blue-50 text-blue-600'}`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-6'} gap-3`}>
          {visibleCategories.map(({ name }) => {
            const count = categoryClothes[name] || 0;
            return (
              <button
                key={name}
                onClick={() => handleCategoryClick(name)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300
                  ${selectedCategory === name 
                    ? 'bg-blue-300 text-black shadow-lg transform scale-105' 
                    : 'bg-white hover:bg-blue-50 hover:shadow hover:scale-105'}`}
              >
                <span className="text-xs font-medium text-center line-clamp-1">{name}</span>
                <span className={`text-xs mt-1 px-2 py-1 rounded-full ${
                  count > 0 
                    ? (selectedCategory === name ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-800') 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {noClothesMessage && (
          <div className="mt-4 text-center text-red-600 font-medium">
            {noClothesMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBar;
