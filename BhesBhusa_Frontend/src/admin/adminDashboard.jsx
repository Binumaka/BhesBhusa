import {
  AlertCircle,
  ArrowLeft,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Mail,
  Package,
  Search,
  Settings,
  ShoppingBag,
  TrendingUp,
  Truck,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [clothes, setClothes] = useState([]);
  const [users, setUsers] = useState([]);
  const [order, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [currentView, setCurrentView] = useState("dashboard"); // "dashboard" or "users"
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clothRes, userRes, orderRes] = await Promise.all([
          fetch("https://localhost:3000/api/clothes").then(
            (res) => res.json()
          ),
          fetch("https://localhost:3000/api/user").then((res) => res.json()),
          fetch("https://localhost:3000/api/order").then((res) => res.json()),
        ]);

        setClothes(clothRes);
        setUsers(userRes);
        setOrders(orderRes);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(
        `https://localhost:3000/api/order/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const updatedOrder = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "CONFIRMED":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: "text-emerald-700",
          bg: "bg-emerald-100",
          border: "border-emerald-300",
          label: "Confirmed",
        };
      case "PENDING":
        return {
          icon: <Clock className="h-4 w-4" />,
          color: "text-orange-700",
          bg: "bg-orange-100",
          border: "border-orange-300",
          label: "Pending",
        };
      case "CANCELLED":
        return {
          icon: <XCircle className="h-4 w-4" />,
          color: "text-red-700",
          bg: "bg-red-100",
          border: "border-red-300",
          label: "Cancelled",
        };
      case "PROCESSING":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          color: "text-blue-700",
          bg: "bg-blue-100",
          border: "border-blue-300",
          label: "Processing",
        };
      case "SHIPPED":
        return {
          icon: <Truck className="h-4 w-4" />,
          color: "text-purple-700",
          bg: "bg-purple-100",
          border: "border-purple-300",
          label: "Shipped",
        };
      case "DELIVERED":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: "text-green-700",
          bg: "bg-green-100",
          border: "border-green-300",
          label: "Delivered",
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          color: "text-gray-700",
          bg: "bg-gray-100",
          border: "border-gray-300",
          label: "Unknown",
        };
    }
  };

  const getPaymentConfig = (status) => {
    switch (status) {
      case "PAID":
        return {
          color: "text-green-700",
          bg: "bg-green-100",
          border: "border-green-300",
          label: "Paid",
        };
      case "PENDING":
        return {
          color: "text-amber-700",
          bg: "bg-amber-100",
          border: "border-amber-300",
          label: "Pending",
        };
      case "FAILED":
        return {
          color: "text-red-700",
          bg: "bg-red-100",
          border: "border-red-300",
          label: "Failed",
        };
      case "REFUNDED":
        return {
          color: "text-blue-700",
          bg: "bg-blue-100",
          border: "border-blue-300",
          label: "Refunded",
        };
      default:
        return {
          color: "text-gray-700",
          bg: "bg-gray-100",
          border: "border-gray-300",
          label: "Unknown",
        };
    }
  };

  const filteredOrders =
    selectedStatus === "ALL"
      ? order
      : order.filter((o) => o.status === selectedStatus);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (currentView === "users") {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView("dashboard")}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Users Management
                  </h1>
                  <p className="text-slate-600 mt-1">
                    View and manage all registered users
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-8 py-8">
          {/* Users Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    All Users
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Total {users.length} registered users
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Users List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-slate-50/50 rounded-xl p-6 border border-slate-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    {/* Profile Image or Avatar */}
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {user?.image ? (
                        <img
                          src={
                            `https://localhost:3000/${user.image}`
                          }
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          {user.username
                            ? user.username.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900 truncate">
                        {user.username || "No Name"}
                      </h3>

                      <div className="space-y-2 mt-3">
                        {user.email && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{user.email}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="h-4 w-4" />
                          <span>Joined {formatDate(user.createdAt)}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="mt-3">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            user.isActive !== false
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No users found
                </h3>
                <p className="text-slate-600">
                  {searchQuery
                    ? "Try adjusting your search query."
                    : "No users have registered yet."}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Modern Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Admin Dashboard
                </h1>
                <p className="text-slate-600 mt-1">
                  Manage your e-commerce operations
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
            </div>
          </div>
        </div>
      </header>

      <main className="px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div 
              onClick={() => {navigate("/adminCloth")}}
              >
                <p className="text-sm font-medium text-slate-600 mb-2">
                  Products
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {clothes.length}
                </p>
                <p className="text-sm text-emerald-600 mt-2 font-medium">
                  +12% this month
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer hover:bg-slate-50"
            onClick={() => setCurrentView("users")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">
                  Customers
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {users.length}
                </p>
                <p className="text-sm text-emerald-600 mt-2 font-medium">
                  +8% this month
                </p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">
                  Orders
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {order.length}
                </p>
                <p className="text-sm text-emerald-600 mt-2 font-medium">
                  +15% this month
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <ShoppingBag className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">
                  Revenue
                </p>
                <p className="text-3xl font-bold text-slate-900">Rs. 2.4M</p>
                <p className="text-sm text-emerald-600 mt-2 font-medium">
                  +24% this month
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Orders</h2>
                <p className="text-slate-600 mt-1">
                  Manage and track all customer orders
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white min-w-40"
                  >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="p-8">
            <div className="space-y-4">
              {filteredOrders.slice(0, 10).map((orderItem) => (
                <div
                  key={orderItem._id}
                  className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 bg-slate-50/50"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Order Header */}
                    <div className="lg:w-80 flex-shrink-0">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Order Number: {orderItem.orderNumber || "N/A"}
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {/* Status */}
                        <div>
                          <label className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2 block">
                            Order Status
                          </label>
                          {orderItem.status === "CANCELLED" ? (
                            <div
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium text-sm ${
                                getStatusConfig(orderItem.status).color
                              } ${getStatusConfig(orderItem.status).bg} ${
                                getStatusConfig(orderItem.status).border
                              }`}
                            >
                              {getStatusConfig(orderItem.status).icon}
                              {getStatusConfig(orderItem.status).label}
                            </div>
                          ) : (
                            <select
                              value={orderItem.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  orderItem._id,
                                  e.target.value
                                )
                              }
                              className={`px-4 py-2 rounded-lg border-2 font-medium text-sm cursor-pointer transition-all ${
                                getStatusConfig(orderItem.status).color
                              } ${getStatusConfig(orderItem.status).bg} ${
                                getStatusConfig(orderItem.status).border
                              } hover:shadow-sm`}
                            >
                              {[
                                "PENDING",
                                "CONFIRMED",
                                "PROCESSING",
                                "SHIPPED",
                                "DELIVERED",
                                "CANCELLED",
                              ].map((statusOption) => (
                                <option key={statusOption} value={statusOption}>
                                  {getStatusConfig(statusOption).label}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        {/* Payment Status */}
                        <div>
                          <label className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2 block">
                            Payment Status
                          </label>
                          <div
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium text-sm ${
                              getPaymentConfig(orderItem.paymentStatus).color
                            } ${getPaymentConfig(orderItem.paymentStatus).bg} ${
                              getPaymentConfig(orderItem.paymentStatus).border
                            }`}
                          >
                            {getPaymentConfig(orderItem.paymentStatus).label}
                          </div>
                        </div>

                        {/* Total */}
                        <div>
                          <label className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2 block">
                            Order Total
                          </label>
                          <div className="text-2xl font-bold text-slate-900">
                            Rs.{" "}
                            {orderItem.total ||
                              orderItem.items.reduce(
                                (total, item) =>
                                  total +
                                  (item.price || item.clothId?.price || 0) *
                                    item.quantity,
                                0
                              )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Details - Now side by side */}
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Order Items */}
                      <div>
                        <label className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-4 block">
                          Order Items
                        </label>
                        <div className="space-y-3">
                          {orderItem.items.slice(0, 4).map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-200"
                            >
                              <div className="w-40 h-26 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                <img
                                  src={
                                    item.clothId?.image
                                      ? `https://localhost:3000/clothes_image/${item.clothId.image}`
                                      : "/fallback-image.png"
                                  }
                                  alt={
                                    item?.title ||
                                    item.clothId?.title ||
                                    "Product"
                                  }
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = "/fallback-image.png";
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold font-dosis text-slate-900 text-xl truncate">
                                  {item.title ||
                                    item.clothId?.title ||
                                    "Product"}
                                </p>
                                <p className="text-md font-dosis text-slate-600">
                                  Qty: {item.quantity}
                                </p>
                                <p className="text-md font-dosis font-semibold text-red-600">
                                  Rs. {item.price || item.clothId?.price || 0}
                                </p>
                              </div>
                            </div>
                          ))}

                          {orderItem.items.length > 4 && (
                            <div className="flex items-center justify-center bg-slate-100 rounded-xl p-3 border border-slate-200">
                              <span className="text-xs font-medium text-slate-600">
                                +{orderItem.items.length - 4} more items
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Shipping Info */}
                      <div>
                        <label className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-4 block">
                          Shipping Information
                        </label>
                        {orderItem.shipping ? (
                          <div className="bg-white rounded-xl p-4 border border-slate-200 h-fit">
                            <div className="space-y-3 text-sm">
                              <div>
                                <span className="font-medium text-slate-900">
                                  Customer:
                                </span>
                                <div className="text-slate-600 mt-1">
                                  {orderItem.shipping.firstName}{" "}
                                  {orderItem.shipping.lastName}
                                </div>
                              </div>
                              <div>
                                <span className="font-medium text-slate-900">
                                  Contact:
                                </span>
                                <div className="text-slate-600 mt-1">
                                  {orderItem.shipping.phone}
                                  <br />
                                  {orderItem.shipping.email}
                                </div>
                              </div>
                              <div>
                                <span className="font-medium text-slate-900">
                                  Method:
                                </span>
                                <div className="text-slate-600 mt-1">
                                  {orderItem.shipping.method?.replace(
                                    /_/g,
                                    " "
                                  )}{" "}
                                  (Rs. {orderItem.shipping.cost})
                                </div>
                              </div>
                              <div>
                                <span className="font-medium text-slate-900">
                                  Address:
                                </span>
                                <div className="text-slate-600 mt-1">
                                  {orderItem.shipping.address}
                                  <br />
                                  {orderItem.shipping.city},{" "}
                                  {orderItem.shipping.province}
                                  <br />
                                  {orderItem.shipping.country}
                                </div>
                              </div>
                              {orderItem.shipping.additionalInfo && (
                                <div>
                                  <span className="font-medium text-slate-900">
                                    Notes:
                                  </span>
                                  <div className="text-slate-600 mt-1">
                                    {orderItem.shipping.additionalInfo}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-slate-100 rounded-xl p-4 border border-slate-200">
                            <span className="text-slate-500 text-sm">
                              No shipping information available
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
