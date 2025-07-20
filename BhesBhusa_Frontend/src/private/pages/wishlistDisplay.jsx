import { Trash, Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import { useWishlist } from "../context/wishlistContext";

const WishListScreen = () => {
  const navigate = useNavigate();
  const { wishlist, loading, removeFromWishlist } = useWishlist();

  const gotoClothesDetails = (id) => {
    navigate(`/clothesDetail/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-rose-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-rose-500 rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
              <p className="text-xl font-medium text-gray-800 mb-1">
                Loading your wishlist...
              </p>
              <p className="text-sm text-gray-500">
                Gathering your favorite items
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className=" mx-auto mt-20 py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold font-dosis">Back to Shop</span>
              </button>
            </div>
            <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-full shadow-sm">
              <Heart className="w-5 h-5 text-rose-500 fill-current" />
              <span className="text-sm font-medium text-gray-700">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-dosis md:text-5xl font-bold text-gray-900 mb-3">
              Your Wishlist
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your carefully curated collection of favorite ornaments
            </p>
          </div>
        </div>

        {/* Wishlist Content */}
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-rose-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Your wishlist is empty
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Discover beautiful ornaments and add them to your wishlist to keep track of your favorites
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Start Shopping</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:gap-8">
            {wishlist.map((item) => {
              const cloth = item.cloth;
              if (!cloth) return null;

              return (
                <div
                  key={item._id}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => gotoClothesDetails(cloth._id)}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="md:w-80 h-64 md:h-auto relative overflow-hidden">
                      <img
                        src={
                          cloth.image
                            ? `https://localhost:3000/clothes_image/${cloth.image}`
                            : "https://via.placeholder.com/150"
                        }
                        alt={cloth.title || "Cloth"}
                        className="w-full h-[340px] object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-2xl md:text-3xl font-dosis font-bold text-gray-900 group-hover:text-rose-600 transition-colors duration-200">
                            {cloth.title}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromWishlist(cloth._id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 transform hover:scale-110"
                            title="Remove from wishlist"
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <p className="text-gray-600 font-dosis leading-relaxed mb-6 text-base md:text-lg">
                          {cloth.description?.slice(0, 270)}...
                          <span className="text-rose-600  font-medium cursor-pointer hover:underline ml-1">
                            Read more
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-dosis font-bold text-rose-600">
                            Rs. {cloth.price || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Continue Shopping Button for non-empty wishlist */}
        {wishlist.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 font-medium px-8 py-3 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Continue Shopping</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishListScreen;