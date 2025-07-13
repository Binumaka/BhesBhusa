import { ShoppingCart } from "lucide-react";
import React from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/cartContext";
import { useWishlist } from "../context/wishlistContext";

const ClothCard = ({ cloths = [] }) => {
  const [loading, setLoading] = React.useState(false);
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [selectedSizes, setSelectedSizes] = React.useState({});

  const gotoClothDetails = (id) => {
    navigate(`/clothesDetail/${id}`);
  };

  const isInWishlist = (clothId) =>
    wishlist?.some((item) => item.cloth?._id === clothId);

  const handleWishlist = async (e, clothId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await toggleWishlist(clothId);
      const message = isInWishlist(clothId)
        ? "Removed from wishlist"
        : "Added to wishlist";
      toast.success(message);
    } catch (err) {
      console.error("Wishlist action failed:", err);
      toast.error("Wishlist action failed");
    }
  };

  const handleSizeSelect = (clothId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [clothId]: size,
    }));
  };

  const addtoCart = async (cloth) => {
    const size = selectedSizes[cloth._id] || cloth.availableSizes?.[0] || "Free";
    try {
      await addToCart(cloth, 1, size);
      toast.success("Item added to cart");
    } catch (error) {
      console.error("Failed to add to cart", error);
      toast.error("Failed to add item to cart");
    }
  };

  const goToCheckout = (cloth) => {
    const size = selectedSizes[cloth._id] || cloth.availableSizes?.[0] || "Free";
    navigate("/checkout", { state: { cloth: { ...cloth, selectedSize: size } } });
  };

  if (!Array.isArray(cloths)) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <p className="text-red-500">Invalid cloths data provided</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
      {cloths.length > 0 ? (
        cloths.map((cloth) => {
          if (!cloth || !cloth._id) return null;

          const sizes =
            cloth.availableSizes && cloth.availableSizes.length > 0
              ? cloth.availableSizes
              : ["Free"];
          const selectedSize = selectedSizes[cloth._id] || sizes[0];

          return (
            <div
              key={cloth._id}
              className="group relative w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => gotoClothDetails(cloth._id)}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={
                    cloth.image
                      ? `https://localhost:3000/clothes_image/${cloth.image}`
                      : "https://via.placeholder.com/320x400?text=No+Image"
                  }
                  alt={cloth.title || "Cloth"}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Top Right Icons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={(e) => handleWishlist(e, cloth._id)}
                    className="p-2 rounded-full transition-all duration-200"
                  >
                    {isInWishlist(cloth._id) ? (
                      <FaHeart className="w-6 h-5 text-red-500" />
                    ) : (
                      <FaHeart className="w-6 h-5 text-gray-400 hover:text-red-500" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addtoCart(cloth);
                    }}
                    disabled={loading}
                    className="p-2 rounded-full transition-all duration-200"
                  >
                    <ShoppingCart className="w-6 h-5 text-gray-800 hover:text-yellow-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-slate-600 transition-colors">
                  {cloth.title || "Untitled"}
                </h3>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-slate-800">
                    Rs. {cloth.price || "N/A"}
                  </span>
                </div>

                {/* Sizes */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Choose Size:</p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSizeSelect(cloth._id, size);
                        }}
                        className={`px-3 py-1 text-xs font-medium rounded-lg border ${
                          selectedSize === size
                            ? "bg-yellow-500 text-black border-yellow-500"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buy Now */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToCheckout(cloth);
                    }}
                    disabled={loading}
                    className="w-full py-3 px-4 text-sm font-medium text-white bg-[#4B2E2E] rounded-lg hover:bg-yellow-500 hover:text-black transition-colors disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "Buy Now"}
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Products Available
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            We're currently updating our inventory. Please check back soon for
            new arrivals!
          </p>
        </div>
      )}
    </div>
  );
};

export default ClothCard;
