import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  DollarSign,
  Loader,
  Mail,
  MapPin,
  Package,
  Phone,
  Shield,
  Truck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../components/footer";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";

const stripePromise = loadStripe(
  "pk_test_51Rmz5rQIuxFyrJUtpfLSHvB0VMXMwldGE61jeBS8nN0qlVtQExRJPLhmMrzJAbe5n9llpuLS41ybqg81xQhPH4NZ00E6Il2hFi"
);

const OrderCompletePage = () => {
  const { userId, token } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [orders, setOrders] = useState([]);
  const [orderData, setOrderData] = useState(null);
  const [checkoutItems, setCheckoutItems] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`/api/order/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedOrders = res.data || [];

        if (fetchedOrders.length > 0) {
          const latestOrder = fetchedOrders[fetchedOrders.length - 1];
          setOrders(fetchedOrders);
          setOrderData(latestOrder);
          const items = latestOrder.items.map((item) => ({
            title: item.title || item.clothId?.title || "Clothing Item",
            price: item.price || item.clothId?.price || 0,
            quantity: item.quantity || 1,
            size: item.size,
            image: item.clothId?.image || item.image,
            clothId: item.clothId?._id || item._id,
          }));
          setCheckoutItems(items);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to fetch order.");
      }
    };

    if (userId && token) {
      fetchOrders();
    }
  }, [userId, token]);

  const handlePaymentSelection = (e) => {
    setSelectedPayment(e.target.value);
  };

  const handleProceedPayment = async () => {
    if (!selectedPayment || !orderData) {
      toast.error("Select a payment method first.");
      return;
    }

    if (selectedPayment === "stripe") {
      setProcessing(true);
      try {
        const res = await axios.post(
          "/api/order/create-stripe",
          {
            orderId: orderData._id,
            total: orderData.total,
            title: "Order Payment",
            items: checkoutItems,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: res.data.id,
        });

        if (error) {
          console.error("Stripe redirect error:", error.message);
          toast.error("Stripe redirection failed.");
        }
      } catch (err) {
        console.error("Stripe checkout failed:", err);
        toast.error("Failed to initiate Stripe payment.");
      } finally {
        setProcessing(false);
      }
    } else {
      toast.info("Other payment methods are coming soon!");
    }
  };

  const paymentMethods = [
    {
      id: "stripe",
      name: "Credit/Debit Card",
      description: "Pay securely with your card via Stripe",
      icon: <CreditCard className="w-6 h-6" />,
    },
  ];

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <NavBar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-amber-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-amber-500 rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
              <p className="text-xl font-medium text-gray-800 mb-1">
                Loading order details...
              </p>
              <p className="text-sm text-gray-500">
                Preparing your order information
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto mt-20 py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium text-lg font-dosis">Back</span>
            </button>

            <div className="flex items-center space-x-3 bg-white px-4 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-medium text-lg font-dosis text-gray-700">
                Order Confirmed
              </span>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center bg-white px-80 space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-dosis font-bold text-gray-900">
                Order Confirmation
              </h1>
            </div>
            <p className="text-lg text-gray-600 font-medium font-dosis mx-auto">
              Your order has been confirmed! Complete your payment to finalize
              the purchase.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Details */}
          <div className="space-y-8">
            {/* Billing Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-slate-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-dosis text-gray-900">
                  Billing Details
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 rounded-xl border border-blue-100">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-bold font-dosis text-gray-900">
                      {orderData.shipping?.firstName}{" "}
                      {orderData.shipping?.lastName}
                    </p>
                    <p className="text-sm font-bold font-dosis text-gray-500">Full Name</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-xl border border-green-100">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-bold font-dosis text-gray-900">
                      {orderData.shipping?.email}
                    </p>
                    <p className="text-sm font-bold font-dosis text-gray-500">Email Address</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-xl border border-purple-100">
                  <Phone className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-bold font-dosis text-gray-900">
                      {orderData.shipping?.phone}
                    </p>
                    <p className="text-sm font-bold font-dosis text-gray-500">Phone Number</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-xl border border-yellow-100">
                  <MapPin className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-bold font-dosis text-gray-900">
                      {orderData.shipping?.address}
                    </p>
                    <p className="text-sm font-bold font-dosis text-gray-500">
                      {orderData.shipping?.province}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-xl border border-indigo-100">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-bold font-dosis text-gray-900">
                      {orderData.shipping?.method?.replace(/_/g, " ")}
                    </p>
                    <p className="text-sm font-bold font-dosis text-gray-500">Shipping Method</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-slate-500 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-dosis text-gray-900">
                  Order Items
                </h2>
              </div>

              <div className="space-y-4">
                {checkoutItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-200 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="relative">
                      <img
                        src={
                          item.image
                            ? `https://localhost:3000/clothes_image/${item.image}`
                            : "/fallback-image.png"
                        }
                        alt={item.title}
                        className="w-24 h-26 object-cover rounded-lg shadow-sm"
                      />
                      <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold font-dosis text-lg text-gray-900 truncate mb-1">
                        {item.title}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="font-bold font-dosis">Qty: {item.quantity}</span>
                        {item.size && <span className="font-bold font-dosis">Size: {item.size}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold font-dosis text-red-600 text-lg">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-sm font-medium font-dosis text-gray-500">
                        Rs. {item.price} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-8">
            {/* Order Total */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-slate-500 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-dosis text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-xl border border-blue-100">
                  <span className="text-gray-700 text-lg font-dosis font-medium">Subtotal</span>
                  <span className="font-bold font-dosis text-red-600">
                    Rs. {orderData.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-xl border border-yellow-100">
                  <span className="text-gray-700 text-lg font-dosis font-medium">Shipping</span>
                  <span className="font-bold font-dosis text-red-600">
                    Rs. {orderData.shippingCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-6 rounded-xl  border-2 border-green-200">
                  <span className="text-xl font-bold font-dosis text-gray-900">
                    Total Amount
                  </span>
                  <span className="text-xl font-bold font-dosis text-red-600">
                    Rs. {orderData.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-slate-500 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-dosis text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-4 mb-8">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                      selectedPayment === method.id
                        ? "border-green-400 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selectedPayment === method.id}
                      onChange={handlePaymentSelection}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-3 rounded-full ${
                            selectedPayment === method.id
                              ? "bg-gradient-to-r from-green-500 to-green-700 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {method.icon}
                        </div>
                        <div>
                          <div className="font-bold font-dosis text-gray-900 text-lg">
                            {method.name}
                          </div>
                          <div className="text-sm font-dosis text-gray-500">
                            {method.description}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedPayment === method.id
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedPayment === method.id && (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={handleProceedPayment}
                disabled={processing || !selectedPayment}
                className="w-full bg-[#4B2E2E] hover:bg-yellow-500 hover:text-black text-white font-bold py-4 rounded-full shadow-lg transform hover:scale-[1.02] disabled:hover:scale-100 transition-all duration-200 text-lg flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span className="text-xl font-bold font-dosis">Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xl font-bold font-dosis">Proceed to Payment</span>
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Shield className="w-4 h-4 text-green-600" />
                <span className=" text-md font-bold font-dosis">Secure payment powered by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderCompletePage;
