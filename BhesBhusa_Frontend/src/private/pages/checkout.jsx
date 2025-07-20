import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, MapPin, Phone, Mail, User, Package, Truck, Store, ShieldCheck, ArrowLeft } from "lucide-react";
import Footer from "../components/footer";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/cartContext";
import NavBar from "../components/NavBar";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, token } = useAuth();
  const { cart } = useCart();

  let checkoutItems = [];

  // Map checkout items from location or cart context
  if (location.state?.bundle) {
    checkoutItems = location.state.bundle.map((item) => ({
      cloth: item,
      quantity: item.quantity || 1,
      size: item.selectedSize || "Free",
    }));
  } else if (location.state?.cloth) {
    checkoutItems = [
      {
        cloth: location.state.cloth,
        quantity: 1,
        size: location.state.cloth.selectedSize || "Free",
      },
    ];
  } else {
    checkoutItems = cart;
  }

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    address: "",
    province: "",
    phone: "",
    email: "",
  });

  const [selectedShipping, setSelectedShipping] = useState("");

  // Fetch user email on load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData((prev) => ({ ...prev, email: res.data.email }));
      } catch (error) {
        console.error("Failed to fetch user email", error);
      }
    };

    if (userId && token) fetchUser();
  }, [userId, token]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const calculateSubtotal = () =>
    checkoutItems.reduce(
      (total, item) => total + (item.cloth?.price || 0) * (item.quantity || 1),
      0
    );

  const shippingCost =
    selectedShipping === "INSIDE_THE_VALLEY"
      ? 100
      : selectedShipping === "OUTSIDE_THE_VALLEY"
      ? 300
      : 0;

  const total = calculateSubtotal() + shippingCost;

  const handleSubmit = async () => {
    if (!selectedShipping) {
      alert("Please select a shipping method.");
      return;
    }

    const items = checkoutItems.map((item) => ({
      clothId: item.cloth._id,
      quantity: item.quantity,
      size: item.size || "Free",
      title: item.cloth.title,
      price: item.cloth.price,
      image: item.cloth.image,
    }));

    const orderData = {
      userId,
      items,
      shipping: {
        method: selectedShipping,
        cost: shippingCost,
        ...formData,
      },
      payment: {
        method: "", // no payment method selected here
        status: "PENDING",
      },
      subtotal: calculateSubtotal(),
      shippingCost,
      total,
      customerNotes: "",
    };

    try {
      const res = await axios.post(
        "https://localhost:3000/api/order/create",
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate("/order", {
        state: {
          orderData,
          fromCart: !location.state?.cloth && !location.state?.bundle,
        },
      });
    } catch (err) {
      console.error("Order placement failed", err);
      alert("Failed to place order");
    }
  };

  const getShippingIcon = (method) => {
    switch (method) {
      case "INSIDE_THE_VALLEY":
        return <Truck className="w-5 h-5" />;
      case "OUTSIDE_THE_VALLEY":
        return <Package className="w-5 h-5" />;
      case "IN_STORE_PICKUP":
        return <Store className="w-5 h-5" />;
      default:
        return <Truck className="w-5 h-5" />;
    }
  };

  const getShippingName = (method) => {
    switch (method) {
      case "INSIDE_THE_VALLEY":
        return "Inside Valley Delivery";
      case "OUTSIDE_THE_VALLEY":
        return "Outside Valley Delivery";
      case "IN_STORE_PICKUP":
        return "In-Store Pickup";
      default:
        return method;
    }
  };

  const getShippingTime = (method) => {
    switch (method) {
      case "INSIDE_THE_VALLEY":
        return "1-2 days";
      case "OUTSIDE_THE_VALLEY":
        return "3-5 days";
      case "IN_STORE_PICKUP":
        return "Available immediately";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className=" mx-auto mt-20 py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-xl font-medium font-dosis">Back</span>
            </button>
            
            <div className="flex items-center space-x-3 bg-white px-4 rounded-full">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <span className="text-sm font-dosis font-medium text-gray-700">Secure Checkout</span>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold font-dosis text-gray-900 mb-3">
              Checkout
            </h1>
            <p className="text-lg text-gray-600 font-medium font-dosis max-w-2xl mx-auto">
              Complete your order with secure payment and fast delivery
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Billing Details */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-dosis text-gray-900">Billing Details</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 font-bold font-dosis rounded-lg focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <div className="relative">
                    <input
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 font-bold font-dosis rounded-lg focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 font-bold font-dosis rounded-lg focus:border-transparent transition-all duration-200 text-gray-900 appearance-none bg-white"
                  >
                    <option value="">Select Country</option>
                    <option value="Nepal">Nepal</option>
                  </select>
                </div>

                <div className="relative">
                  <input
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 font-bold font-dosis rounded-lg focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div className="relative">
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 font-bold font-dosis rounded-lg focus:border-transparent transition-all duration-200 text-gray-900 appearance-none bg-white"
                  >
                    <option value="">Select Province</option>
                    <option value="Province 1">Province 1</option>
                    <option value="Province 2">Province 2</option>
                    <option value="Province 3">Province 3</option>
                    <option value="Province 4">Province 4</option>
                    <option value="Province 5">Province 5</option>
                    <option value="Province 6">Province 6</option>
                    <option value="Province 7">Province 7</option>
                  </select>
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 font-bold font-dosis rounded-lg focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    readOnly
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 font-bold font-dosis rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Methods */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-slate-500 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold font-dosis text-gray-900">Shipping Method</h3>
              </div>

              <div className="space-y-4">
                {["INSIDE_THE_VALLEY", "OUTSIDE_THE_VALLEY", "IN_STORE_PICKUP"].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedShipping === method
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value={method}
                      checked={selectedShipping === method}
                      onChange={(e) => setSelectedShipping(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          selectedShipping === method ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-600"
                        }`}>
                          {getShippingIcon(method)}
                        </div>
                        <div>
                          <div className="font-semibold font-dosis text-gray-900">
                            {getShippingName(method)}
                          </div>
                          <div className="text-md font-dosis text-gray-500">
                            {getShippingTime(method)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold font-dosis text-gray-900">
                          {method === "INSIDE_THE_VALLEY" ? "Rs. 100" : 
                           method === "OUTSIDE_THE_VALLEY" ? "Rs. 300" : "Free"}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-32">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-slate-500 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-dosis text-gray-900">Your Order</h2>
              </div>

              <div className="space-y-6 mb-6">
                {checkoutItems.map((item) => (
                  <div key={item.cloth._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={
                        item.cloth?.image
                          ? `https://localhost:3000/clothes_image/${item.cloth?.image}`
                          : "https://via.placeholder.com/100"
                      }
                      alt={item.cloth?.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className=" text-xl font-semibold font-dosis text-gray-900 truncate">
                        {item.cloth?.title}
                      </h4>
                      <p className="text-md font-dosis text-gray-500">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold font-dosis text-gray-900">
                        Rs. {(item.cloth?.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-bold font-dosis">Subtotal</span>
                  <span className="font-semibold font-dosis text-gray-900">
                    Rs. {calculateSubtotal().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-bold font-dosis">Shipping</span>
                  <span className="font-semibold font-dosis text-gray-900">
                    Rs. {shippingCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-4 bg-yellow-100 rounded-lg px-4">
                  <span className="text-xl font-bold font-dosis text-gray-900">Total</span>
                  <span className="text-xl font-bold font-dosis text-red-600">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full mt-8 bg-[#4B2E2E] hover:text-gray-900 hover:bg-yellow-500 text-white font-dosis font-semibold py-4 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-200 text-lg flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span className="font-dosis">Place Order</span>
              </button>

              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-dosis text-md">Your payment information is secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;