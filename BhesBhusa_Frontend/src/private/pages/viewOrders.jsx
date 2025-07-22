import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";

const stripePromise = loadStripe(
  "pk_test_51Rmz5rQIuxFyrJUtpfLSHvB0VMXMwldGE61jeBS8nN0qlVtQExRJPLhmMrzJAbe5n9llpuLS41ybqg81xQhPH4NZ00E6Il2hFi"
);

const OrderList = () => {
  const { userId, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`/api/order/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders.", error);
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await axios.patch(`/api/order/${orderId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "CANCELLED" } : o))
      );
      alert("Order cancelled successfully!");
    } catch (err) {
      console.error("Failed to cancel order", err);
      alert(err.response?.data?.message || "Error cancelling order");
    }
  };

  const handlePayment = async (orderId) => {
    if (!window.confirm("Proceed with payment?")) return;

    setProcessing(true);

    try {
      const orderData = orders.find((order) => order._id === orderId);

      if (!orderData) {
        alert("Order not found");
        setProcessing(false);
        return;
      }

      const checkoutItems = orderData.items.map((item) => ({
        title: item.title || item.clothId?.title || "Clothing Item",
        price: item.price || item.clothId?.price || 0,
        quantity: item.quantity || 1,
      }));

      const res = await axios.post(
        "/api/order/create-stripe",
        {
          orderId: orderData._id,
          total: orderData.total,
          title: "Order Payment",
          items: checkoutItems,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: res.data.id,
      });

      if (error) {
        console.error("Stripe redirect error:", error.message);
        toast.error("Payment failed. Please try again.");
      }
    } catch (err) {
      console.error("Stripe payment initiation failed:", err);
      toast.error("Failed to initiate Stripe payment.");
    } finally {
      setProcessing(false);
    }
  };

  const getStepNumber = (status) => {
    switch (status) {
      case "PENDING":
        return 1;
      case "CONFIRMED":
        return 2;
      case "PROCESSING":
        return 3;
      case "SHIPPED":
        return 4;
      case "DELIVERED":
        return 5;
      default:
        return 0;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border-amber-200";
      case "CONFIRMED":
        return "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 border-blue-200";
      case "PROCESSING":
        return "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-800 border-indigo-200";
      case "SHIPPED":
        return "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-800 border-purple-200";
      case "DELIVERED":
        return "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 border-emerald-200";
      case "CANCELLED":
        return "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-200";
      default:
        return "bg-gradient-to-r from-slate-50 to-gray-50 text-slate-800 border-slate-200";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PAID":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200";
      case "PENDING":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border border-yellow-200";
      case "FAILED":
        return "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <NavBar />
      <div className="mt-20 mx-auto py-12 px-4">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center bg-white px-80 space-x-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl mb-6 shadow-lg">
              <svg
                className="w-6 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold font-dosis bg-gray-800 bg-clip-text text-transparent mb-3">
              My Orders
            </h1>
          </div>
          <p className="text-lg text-gray-600 font-dosis max-w-md mx-auto">
            Track and manage your orders with real-time updates
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-100 border-t-indigo-600 mb-6"></div>
              <div className="animate-pulse absolute inset-0 rounded-full border-4 border-purple-100"></div>
            </div>
            <p className="text-gray-600 text-lg font-medium">
              Loading your orders...
            </p>
            <p className="text-gray-400 text-sm mt-2">This may take a moment</p>
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={fetchOrders}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <svg
                className="w-12 h-12 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Orders Yet
            </h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Start your shopping journey and discover amazing products!
            </p>
            <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-lg">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Enhanced Order Header */}
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-8 py-6 border-b border-gray-200">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                        <div className="space-y-1">
                          <p className="text-md font-medium font-dosis text-gray-500 uppercase tracking-wide">
                            Order Number
                          </p>
                          <p className="text-xl font-dosis font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {order.orderNumber}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-md font-dosis font-medium text-gray-500 uppercase tracking-wide">
                            Order Date
                          </p>
                          <p className="text-lg font-dosis font-semibold text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`px-4 py-2 rounded-full font-dosis text-sm font-semibold border-2 ${getStatusColor(
                            order.status
                          )} shadow-sm`}
                        >
                          <span className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full font-dosis bg-current opacity-60"></div>
                            {order.status}
                          </span>
                        </span>
                        <span
                          className={`px-4 py-2 rounded-full font-dosis text-sm font-semibold ${getPaymentStatusColor(
                            order.paymentStatus
                          )} shadow-sm`}
                        >
                          Payment: {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="text-center lg:text-right bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <p className="text-md font-medium font-dosis text-gray-500 uppercase tracking-wide mb-1">
                        Total Amount
                      </p>
                      <p className="text-2xl font-dosis font-bold bg-red-600 bg-clip-text text-transparent">
                        Rs. {order.total}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Order Content */}
                <div className="p-8">
                  {/* Enhanced Action Buttons */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {order.paymentStatus?.toUpperCase() === "PENDING" &&
                      order.status?.toUpperCase() !== "CANCELLED" && (
                        <button
                          onClick={() => handlePayment(order._id)}
                          disabled={processing}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none flex items-center gap-2"
                        >
                          {processing ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Pay Now
                            </>
                          )}
                        </button>
                      )}
                    {order.status?.toUpperCase() === "PENDING" && (
                      <button
                        onClick={() => handleCancel(order._id)}
                        className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Cancel Order
                      </button>
                    )}
                  </div>

                  {/* Enhanced Items Section */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-6">
                      <svg
                        className="w-5 h-5 text-indigo-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                      <h3 className="text-xl font-bold text-gray-900">
                        Order Items ({order.items.length})
                      </h3>
                    </div>
                    <div className="grid gap-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100 hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-200 transition-all duration-200"
                        >
                          <div className="w-28 h-20 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                            <img
                              src={
                                item.clothId?.image
                                  ? `https://localhost:3000/clothes_image/${item.clothId.image}`
                                  : "/fallback-image.png"
                              }
                              alt={
                                item?.title || item.clothId?.title || "Product"
                              }
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                e.target.src = "/fallback-image.png";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                              {item.title ||
                                item.clothId?.title ||
                                (typeof item.clothId === "string"
                                  ? item.clothId
                                  : "Unnamed Item")}
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                              <div>
                                <span className="text-gray-500 font-medium">
                                  Quantity:
                                </span>
                                <span className="ml-1 font-semibold text-gray-900">
                                  {item.quantity}
                                </span>
                              </div>
                              <div>
                                <span className="text-red-500 font-medium">
                                  Price:
                                </span>
                                <span className="ml-1 font-semibold text-red-600">
                                  Rs. {item.price || item.clothId?.price || 0}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500 font-medium">
                                  Size:
                                </span>
                                <span className="ml-1 font-semibold text-gray-900">
                                  {item.size || item.clothId?.size || "Free"}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800">
                                  × {item.quantity}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Shipping Info */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <svg
                        className="w-5 h-5 text-indigo-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      </svg>
                      <h3 className="text-xl font-bold text-gray-900">
                        Shipping Details
                      </h3>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Shipping Cost
                            </p>
                            <p className="text-lg font-bold text-red-600">
                              Rs. {order.shipping?.cost || 0}
                            </p>
                          </div>
                        </div>
                        {order.shipping?.additionalInfo && (
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-5 h-5 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Additional Info
                              </p>
                              <p className="text-gray-800 font-medium">
                                {order.shipping.additionalInfo}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Progress Tracker */}
                  {order.status?.toUpperCase() !== "CANCELLED" && (
                    <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-8 border border-gray-100">
                      <div className="flex items-center gap-2 mb-8 justify-center">
                        <svg
                          className="w-6 h-6 text-indigo-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        <h4 className="text-2xl font-bold text-gray-900">
                          Order Progress
                        </h4>
                      </div>

                      <div className="relative">
                        <div className="flex justify-between items-center">
                          {[
                            { label: "Pending", step: 1, icon: "📝" },
                            { label: "Confirmed", step: 2, icon: "✅" },
                            { label: "Processing", step: 3, icon: "⚙️" },
                            { label: "Shipped", step: 4, icon: "🚚" },
                            { label: "Delivered", step: 5, icon: "📦" },
                          ].map((step) => {
                            const currentStep = getStepNumber(order.status);
                            const isCompleted = currentStep > step.step;
                            const isActive = currentStep === step.step;

                            return (
                              <div
                                key={step.label}
                                className="flex flex-col items-center relative z-10"
                                style={{ width: "20%" }}
                              >
                                <div
                                  className={`w-14 h-14 flex items-center justify-center rounded-full text-white text-lg font-bold mb-3 transition-all duration-300 shadow-lg ${
                                    isCompleted
                                      ? "bg-gradient-to-r from-green-500 to-emerald-600 scale-110"
                                      : isActive
                                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 scale-105 animate-pulse"
                                      : "bg-gradient-to-r from-gray-300 to-gray-400"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <svg
                                      className="w-6 h-6"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  ) : (
                                    <span className="text-sm">{step.icon}</span>
                                  )}
                                </div>
                                <p
                                  className={`text-sm text-center font-semibold transition-all duration-300 ${
                                    isCompleted || isActive
                                      ? "text-gray-900 scale-105"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {step.label}
                                </p>
                                {isActive && (
                                  <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Enhanced Progress Line */}
                        <div
                          className="absolute top-7 left-0 right-0 h-1 bg-gray-200 rounded-full"
                          style={{ zIndex: 1 }}
                        >
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-700 ease-out shadow-sm"
                            style={{
                              width: `${Math.max(
                                0,
                                (getStepNumber(order.status) - 1) * 25
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
