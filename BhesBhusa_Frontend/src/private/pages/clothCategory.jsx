import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import { ChevronRight, ChevronLeft, Tag } from "lucide-react";

const Clothes = () => {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryClothes, setCategoryClothes] = useState({});
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [noClothesMessage, setNoClothesMessage] = useState("");

  const navigate = useNavigate();

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
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchAllClothes();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryClothes(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchAllClothes = async () => {
    try {
      const response = await fetch("https://localhost:3000/api/clothes");
      const data = await response.json();

      const map = {};
      categories.forEach((cat) => {
        map[cat.name] = 0;
      });

      data.forEach((item) => {
        if (map[item.category] !== undefined) {
          map[item.category]++;
        }
      });

      setCategoryClothes(map);

      const firstAvailable = categories.find((cat) => map[cat.name] > 0)?.name;
      if (firstAvailable) {
        setSelectedCategory(firstAvailable);
        setNoClothesMessage("");
      } else {
        setSelectedCategory(null);
        setNoClothesMessage("No clothes available in any category.");
      }
    } catch (err) {
      setError("Failed to load clothes.");
    }
  };

  const fetchCategoryClothes = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://localhost:3000/api/clothes/category/${category}`);
      const data = await res.json();
      setClothes(data);
      setNoClothesMessage(data.length === 0 ? "No clothes available in this category." : "");
    } catch (err) {
      setError("Failed to load category clothes.");
    }
    setLoading(false);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (categoryClothes[category] === 0) {
      setNoClothesMessage("No clothes available in this category.");
    } else {
      setNoClothesMessage("");
    }
  };

  const gotoClothDetails = (id) => {
    navigate(`/clothesDetail/${id}`);
  };

  const itemsPerPage = isMobile ? 3 : 6;
  const visibleCategories = categories.slice(visibleIndex, visibleIndex + itemsPerPage);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="mx-auto pt-24 px-4 sm:px-6 lg:px-8">

        {/* Category Bar */}
        <div className="mb-8">
          <div className="relative w-full bg-gray-100 pt-6 pb-6 rounded-xl shadow-sm">
            <div className="max-w-full mx-auto px-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <Tag className="mr-2 h-5 w-5 text-blue-600" />
                  Explore Clothes by Category
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setVisibleIndex(Math.max(visibleIndex - 1, 0))}
                    disabled={visibleIndex === 0}
                    className={`h-8 w-8 flex items-center justify-center rounded-full ${
                      visibleIndex === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white shadow-md hover:bg-blue-50 text-blue-600"
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (visibleIndex + itemsPerPage < categories.length) {
                        setVisibleIndex(visibleIndex + 1);
                      }
                    }}
                    disabled={visibleIndex + itemsPerPage >= categories.length}
                    className={`h-8 w-8 flex items-center justify-center rounded-full ${
                      visibleIndex + itemsPerPage >= categories.length
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white shadow-md hover:bg-blue-50 text-blue-600"
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className={`grid ${isMobile ? "grid-cols-3" : "grid-cols-6"} gap-3`}>
                {visibleCategories.map(({ name }) => {
                  const count = categoryClothes[name] || 0;
                  return (
                    <button
                      key={name}
                      onClick={() => handleCategoryClick(name)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300 ${
                        selectedCategory === name
                          ? "bg-blue-100 text-black shadow-lg transform scale-105"
                          : "bg-white hover:bg-blue-50 hover:shadow hover:scale-105"
                      }`}
                    >
                      <span className="text-xs font-medium text-center line-clamp-1">{name}</span>
                      <span
                        className={`text-xs mt-1 px-2 py-1 rounded-full ${
                          count > 0
                            ? selectedCategory === name
                              ? "bg-white text-black-600"
                              : "bg-purple-100 text-black-800"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
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
        </div>

        {/* Loader */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center text-red-600 bg-red-100 py-3 px-4 rounded mb-6">{error}</div>
        )}

        {/* No Clothes Message */}
        {!loading && clothes.length === 0 && selectedCategory && (
          <div className="text-center py-20">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="No Clothes"
              className="mx-auto w-24 h-24 mb-4 opacity-50"
            />
            <p className="text-lg text-gray-600">No clothes available for this category.</p>
          </div>
        )}

        {/* Clothes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {clothes.map((cloth) => (
            <div
              key={cloth._id}
              className="relative bg-white w-[400px] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <div
                className="relative h-64 cursor-pointer flex justify-center"
                onClick={() => gotoClothDetails(cloth._id)}
              >
                <img
                  src={
                    cloth.image
                      ? `https://localhost:3000/clothes_image/${cloth.image}`
                      : "https://via.placeholder.com/300x200"
                  }
                  alt={cloth.title}
                  className="w-[300px] h-full object-cover"
                />
                <div className="absolute top-0 left-0 bg-[#4B2E2E] font-dosis text-white text-sm px-3 py-1 rounded-br-lg">
                  {cloth.category}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-xl font-semibold font-dosis text-gray-800 mb-1 line-clamp-1">
                  {cloth.title}
                </h3>
                <p className="text-sm text-red-600 font-dosis font-bold mb-3">Rs. {cloth.price}</p>
                <div className="flex justify-center">
                <button
                  className="w-[200px] bg-[#4B2E2E] text-white py-2 font-dosis font-semibold rounded-lg bg-[#4B2E2E] rounded-lg hover:bg-yellow-500 hover:text-black transition"
                  onClick={() => gotoClothDetails(cloth._id)}
                >
                  View Details
                </button></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clothes;
