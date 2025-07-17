import axios from "axios";
import { Minus, Plus, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";
import Footer from "../components/footer";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/cartContext";
import { useWishlist } from "../context/wishlistContext";

// Size Selector Component
const SizeSelector = ({ availableSizes, selectedSize, onSizeChange }) => {
  const handleSizeSelect = (size) => {
    onSizeChange(size);
  };

  return (
    <div className="mb-6">
      <div className="mb-3">
        <span className="text-sm font-dosis font-medium text-gray-700">
          Size (in inches): {selectedSize}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {availableSizes.map((size) => (
          <button
            key={size}
            onClick={() => handleSizeSelect(size)}
            className={`px-4 py-2 rounded-full text-sm font-dosis font-medium transition-all duration-200 ${
              selectedSize === size
                ? "bg-black text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

const ClothDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { userId } = useAuth();
  const [cloth, setCloth] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [rating, setRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("34\"");

  useEffect(() => {
    const fetchCloth = async () => {
      try {
        const response = await axios.get(
          `https://localhost:3000/api/clothes/${id}`
        );
        setCloth(response.data);
        setSelectedImage(response.data.image);
        if (response.data.availableSizes && response.data.availableSizes.length > 0) {
          setSelectedSize(response.data.availableSizes[0]);
        } else {
          setSelectedSize("Free");
        }
      } catch (error) {
        console.error("Failed to fetch cloth:", error);
      }
    };
    fetchCloth();
  }, [id]);

  const handleQuantityChange = (action) => {
    setQuantity((prev) => (action === "increase" ? prev + 1 : Math.max(1, prev - 1)));
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const isInWishlist = (clothId) =>
    wishlist?.some(
      (item) =>
        item.clothId === clothId || item.cloth?._id === clothId
    );

  const handleWishlist = async (e, clothId) => {
    e.preventDefault();
    e.stopPropagation();

    const itemInWishlist = isInWishlist(clothId);

    try {
      if (itemInWishlist) {
        const wishlistItem = wishlist.find(
          (item) =>
            item.clothId === clothId || item.cloth?._id === clothId
        );
        if (wishlistItem) {
          await removeFromWishlist(wishlistItem._id);
          toast.info("Removed from wishlist");
        }
      } else {
        await addToWishlist(clothId);
        toast.success("Added to wishlist successfully");
      }
    } catch (err) {
      console.error("Wishlist action failed:", err);
      toast.error("Wishlist action failed");
    }
  };

  const handleAddToCart = async () => {
    try {
      if (!cloth?._id) {
        toast.error("Invalid cloth data");
        return;
      }

      // Use addToCart with correct args (cloth object, quantity, size)
      await addToCart(cloth, quantity, selectedSize);

      toast.success("Item added to cart");
    } catch (error) {
      console.error("Failed to add to cart", error);
      toast.error("Failed to add item to cart");
    }
  };

  const handleBuyNow = () => {
    const clothWithSize = { ...cloth, selectedSize, quantity };
    navigate("/checkout", { state: { cloth: clothWithSize } });
  };

  if (!cloth) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Loading cloth details...
      </div>
    );
  }

  const imageList = [cloth.image, cloth.image1, cloth.image2].filter(Boolean);

  return (
    <>
      <NavBar />
      <div className="min-h-screen mt-20 bg-gray-50">
        <div className="max-w-full mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left side - Images */}
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-md">
                <img
                  src={
                    selectedImage
                      ? `https://localhost:3000/clothes_image/${selectedImage}`
                      : "https://via.placeholder.com/400"
                  }
                  alt={cloth.title}
                  className="w-[430px] h-[480px] rounded-lg shadow-lg object-cover"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 mt-4 justify-center">
                {imageList.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded border-2 ${
                      selectedImage === img
                        ? "border-yellow-500"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={`https://localhost:3000/clothes_image/${img}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right side - Details */}
            <div className="bg-white w-[600px] rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-dosis font-semibold text-gray-900">
                  {cloth.title}
                </h1>
                <button
                  onClick={(e) => handleWishlist(e, cloth._id)}
                  className="p-2"
                >
                  {isInWishlist(cloth._id) ? (
                    <FaHeart className="w-6 h-6 text-red-500" />
                  ) : (
                    <FaHeart className="w-6 h-6 text-gray-400 hover:text-red-600" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-dosis font-medium text-gray-600">
                  {cloth.rating || "4.2"}
                </span>
              </div>

              <div className="text-2xl font-dosis font-bold text-red-500 mb-6">
                Rs. {cloth.price}
              </div>

              <div className="space-y-3 mb-6 text-sm text-gray-600">
                <div><strong>Category:</strong> {cloth.category}</div>
                <div><strong>Tags:</strong> {cloth.tags}</div>
              </div>

              {/* Size Selector or Free Size display */}
              {cloth.availableSizes && cloth.availableSizes.length > 0 ? (
                <SizeSelector
                  availableSizes={cloth.availableSizes}
                  selectedSize={selectedSize}
                  onSizeChange={handleSizeChange}
                />
              ) : (
                <div className="mb-6">
                  <div className="mb-3">
                    <span className="text-sm font-dosis font-medium text-gray-700">
                      Size: Free
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-4 mb-6">
                <div className="flex w-[130px] h-[45px] rounded-lg items-center gap-4 border border-green-300">
                  <span className="px-3">{cloth.available}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex w-[150px] h-[45px] px-2 rounded-lg items-center gap-4 border border-gray-300">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    disabled={quantity <= 1}
                    className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-dosis font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-[200px] bg-yellow-400 hover:bg-yellow-500 text-black font-dosis text-lg py-3 px-6 rounded-lg"
                >
                  Add to Cart
                </button>
              </div>

              <div className="px-14">
                <button
                  onClick={handleBuyNow}
                  className="w-1/2 bg-[#4B2E2E] hover:bg-amber-900 text-white font-dosis py-3 px-6 rounded-lg"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-10 max-w-full">
            <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-center text-2xl font-dosis font-semibold border-b pb-2 mb-4">
                Description
              </h2>
              <p className="text-gray-700 font-dosis text-[18px] leading-relaxed">
                {cloth.description || "No description available."}
              </p>
            </div>
          </div>

          {/* Floating Rating Box */}
          <div className="hidden lg:block fixed top-96 right-0 w-[280px]">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-center">Rate us now !!</h3>
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setRating(i + 1)}
                    className="hover:scale-110 transition-all"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        i < rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-center text-gray-600 text-sm mb-2">
                {rating > 0
                  ? `You rated: ${rating} star${rating > 1 ? "s" : ""}`
                  : "Click to rate"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ClothDetails;
