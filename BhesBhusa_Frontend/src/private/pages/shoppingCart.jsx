import { Trash, Plus, Minus, ShoppingCart, ArrowLeft, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/NavBar";
import { useCart } from "../context/cartContext";

const CartScreen = () => {
  const { cart, setCart, loading, error, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (index, delta) => {
    const updated = [...cart];
    const newQty = updated[index].quantity + delta;
    if (newQty < 1) return;
    updated[index].quantity = newQty;
    setCart(updated);
  };

  const handleRemove = async (clothId) => {
    try {
      await removeFromCart(clothId);
      toast.success("Item removed from cart!");
    } catch (error) {
      toast.error("Failed to remove item.");
    }
  };

  const getTotal = () => {
    return cart.reduce(
      (sum, item) => sum + (item?.cloth?.price || 0) * item.quantity,
      0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-blue-500 rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
              <p className="text-xl font-medium text-gray-800 mb-1">
                Loading your cart...
              </p>
              <p className="text-sm text-gray-500">
                Preparing your shopping experience
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
      <div className="mx-auto mt-20 py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium text-xl font-dosis">Continue Shopping</span>
            </button>
            
            <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-full shadow-sm">
              <ShoppingCart className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-dosis font-medium text-gray-700">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-dosis md:text-5xl font-bold text-gray-900 mb-3">
              Shopping Cart
            </h1>
            <p className="text-lg font-dosis text-gray-600 max-w-2xl mx-auto">
              Review your selected items and proceed to checkout
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center font-medium">{error}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="flex-1">
            {cart.length === 0 ? (
              <div className="text-center py-20">
                <div className="mb-8">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-12 h-12 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-dosis font-semibold text-gray-900 mb-3">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-600 font-dosis mb-8 max-w-md mx-auto">
                    Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
                  </p>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span className="font-dosis text-xl">Start Shopping</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => {
                  const cloth = item.cloth;
                  if (!cloth) return null;

                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={
                              cloth.image
                                ? `https://localhost:3000/clothes_image/${cloth.image}`
                                : "https://via.placeholder.com/100"
                            }
                            alt={cloth.title}
                            className="w-36 h-32 md:w-40 md:h-40 object-cover rounded-xl"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl md:text-3xl font-dosis font-bold text-gray-900 truncate pr-4">
                              {cloth.title}
                            </h3>
                            <button
                              onClick={() => handleRemove(cloth._id)}
                              className="p-2 text-red-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 transform hover:scale-110 flex-shrink-0"
                              title="Remove from cart"
                            >
                              <Trash className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Price */}
                            <div className="text-md font-dosis font-bold text-gray-600">
                              Size: {item.size ||" Free"}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-4">
                              <span className="text-md font-medium font-dosis text-gray-500">Quantity:</span>
                              <div className="flex items-center bg-gray-50 rounded-full">
                                <button
                                  onClick={() => handleQuantityChange(index, -1)}
                                  className="p-2 hover:bg-gray-200 rounded-full  transition-colors duration-200"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4 text-gray-600" />
                                </button>
                                <span className="px-4 py-2 font-semibold text-gray-900 min-w-[3rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(index, 1)}
                                  className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
                                >
                                  <Plus className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                            </div>

                            {/* Subtotal */}
                            <div className="text-right">
                              <p className="text-xl font-bold text-red-600">
                                Rs. {(cloth.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart Summary Section */}
          {cart.length > 0 && (
            <div className="lg:w-96">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-32">
                <h2 className="text-2xl font-dosis font-bold text-gray-900 mb-6 text-center">
                  Order Summary
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-800 text-lg font-dosis">Subtotal</span>
                    <span className="font-semibold text-red-600">
                      Rs. {getTotal().toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-start py-2 border-b border-gray-100">
                    <span className="text-gray-800 text-lg font-dosis">Shipping</span>
                    <span className="text-gray-800 text-md font-dosis text-gray-500 text-right max-w-[200px]">
                      Calculated at checkout
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-4">
                    <span className="text-xl font-bold font-dosis text-gray-900">Total</span>
                    <span className="text-xl font-bold text-red-600">
                      Rs. {getTotal().toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  disabled={cart.length === 0}
                  className="w-full bg-[#4B2E2E] hover:bg-yellow-500 hover:text-black font-dosis disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl shadow-lg transform hover:scale-[1.02] disabled:hover:scale-100 transition-all duration-200 text-lg"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="text-blue-600 font-dosis hover:text-blue-700 font-medium text-lg hover:underline transition-colors duration-200"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartScreen;