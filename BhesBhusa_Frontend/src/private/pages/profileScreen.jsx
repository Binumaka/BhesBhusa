import axios from "axios";
import {
  Calendar,
  Camera,
  Clock,
  Edit3,
  Home,
  LogOut,
  Mail,
  Package,
  Save,
  ShoppingBag,
  Trash2,
  User,
  X,
  Shield,
  Star,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import Navbar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { userId, token, logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [rentOrders, setRentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!userId || !token) return;

    const fetchAll = async () => {
      try {
        setLoading(true);
        const [userRes, purchaseRes, rentRes] = await Promise.all([
          axios.get(`/api/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/order/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUser(userRes.data);
        setFormData({
          username: userRes.data.username,
          email: userRes.data.email,
          image: userRes.data.image,
        });
        setPurchaseOrders(purchaseRes.data);
        setRentOrders(rentRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [userId, token]);

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    setEditing(false);
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      username: user.username,
      email: user.email,
      image: user.image,
    });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      if (imageFile) {
        // If image is selected, upload using multipart
        const formDataToSend = new FormData();
        formDataToSend.append("username", formData.username);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("image", imageFile);

        const { data } = await axios.post(
          `/api/auth/imageupload`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setUser(data.user);
      } else {
        // If no image selected, send a normal JSON update
        const { data } = await axios.put(
          `/api/user/${userId}`,
          {
            username: formData.username,
            email: formData.email,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(data.user);
      }
      window.location.reload();
      setEditing(false);
      setImageFile(null);
      setImagePreview(null);
      alert("Profile updated successfully.");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    )
      return;

    try {
      await axios.delete(`/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Account deleted successfully.");
      logout();
      window.location.href = "/";
    } catch (err) {
      console.error("Error deleting account:", err);
      alert("Failed to delete account.");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-zinc-100">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute top-2 left-2 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin animation-delay-150"></div>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-slate-700">Loading Profile</p>
              <p className="text-slate-500">Please wait while we fetch your data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mt-16 mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="relative mb-12 overflow-hidden rounded-3xl p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 text-white">
            {/* Profile Image Section */}
            <div className="relative group">
              <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-black/30 shadow-2xl">
                {imagePreview || user?.image ? (
                  <img
                    src={
                      imagePreview || `https://localhost:3000/${user.image}`
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                    <User className="w-20 h-20 text-white/80" />
                  </div>
                )}
              </div>

              {editing && (
                <label className="absolute -bottom-2 -right-2 bg-black/80 text-indigo-200 rounded-full p-3 cursor-pointer hover:bg-gray-100 transition-all duration-200 shadow-lg">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              {editing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                      className="px-4 py-3 bg-white/10 backdrop-blur border border-black/10 rounded-xl text-font-dosis text-black/80 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-black/30 shadow-lg"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="px-4 py-3 bg-white/10 backdrop-blur border border-black/10 rounded-xl text-font-dosis text-black/80 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-black/30 shadow-lg"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-white/10 font-dosis text-blue/80 text-[16px] text-indigo-600 px-6 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold shadow-lg border border-black/10"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 bg-white/10 backdrop-blur font-dosis text-red-600 text-[16px] px-4 py-3 rounded-xl hover:bg-black/20 transition-all duration-200 font-semibold shadow-lg border border-black/10"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center lg:justify-start gap-4">
                    <h1 className="text-4xl text-black/70 lg:text-5xl font-dosis font-bold">{user?.username}</h1>
                    <button
                      onClick={handleEdit}
                      className="p-2 bg-black/10 backdrop-blur rounded-lg hover:bg-black/20 transition-all duration-200"
                    >
                      <Edit3 className="w-5 h-5 text-blue-600" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-black/80">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <span className="text-lg">{user?.email}</span>
                  </div>
                  
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-black/80">
                    <Calendar className="w-5 h-5 text-yellow-400" />
                    <span>Member since {new Date().getFullYear()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Stats Cards */}
              <div className="bg-white/10 border-black/10 backdrop-blur rounded-2xl p-6 text-center border border-white/20 shadow-lg">
                <div className="flex items-center text-black/80 justify-center gap-2 mb-2">
                  <ShoppingBag className="w-6 h-6" />
                  <span className="text-3xl font-bold">{purchaseOrders.length}</span>
                </div>
                <p className="text-black/80 font-medium">Purchases</p>
              </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-slate-200 transition-colors">
                <Shield className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Account</h3>
                <p className="text-slate-600 text-sm">Manage your account settings</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Activity Summary</h3>
                <p className="text-slate-600 text-sm">Your recent activity overview</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Total Orders</span>
              <span className="font-bold text-2xl text-slate-900">{purchaseOrders.length + rentOrders.length}</span>
            </div>
          </div>
        </div>

        {/* Purchase Orders Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Purchase History</h2>
                <p className="text-slate-600 mt-1">Track all your orders and purchases</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {purchaseOrders.length ? (
              <div className="space-y-4">
                {purchaseOrders.map((order) => (
                  <div
                    key={order._id}
                    className="group border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-indigo-200 transition-all duration-300 bg-gradient-to-r from-white to-slate-50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 rounded-xl group-hover:bg-indigo-200 transition-colors">
                          <Package className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">
                            Order No. : {order.orderNumber}
                          </h3>
                        </div>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {order.total && (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-green-600">Rs. {order.total}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-600">{order.items?.length || 0} items</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-500" />
                        <span className="text-slate-600">Payment: {order.paymentStatus}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  No Orders Yet
                </h3>
                <p className="text-slate-600 text-lg max-w-md mx-auto">
                  Start exploring our products and your orders will appear here. Happy shopping!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;