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
  ShoppingBag,
  TrendingUp,
  Truck,
  Users,
  XCircle,
  Menu,
  Home,
  Settings,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../private/context/AuthContext";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {logout} = useAuth();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login'); // or wherever you want to redirect after logout
  };

  const handleNavigation = (path) => {
    setIsMobileOpen(false);
    navigate(path);
  };

  const sidebarItems = [
    { name: "Dashboard", icon: <TrendingUp className="w-5 h-5" />, path: "/adminDashboard" },
    { name: "Add Clothes", icon: <Package className="w-5 h-5" />, path: "/addClothes" },
    { name: "Clothes List", icon: <Calendar className="w-5 h-5" />, path: "/adminCloth" },
    { name: "User", icon: <Users className="w-5 h-5" />, path: "/userList" },
  ];

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-600 to-slate-900 text-white w-72 shadow-2xl hidden md:flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Admin Panel
              </h2>
              <p className="text-xs text-slate-400">Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
            Navigation
          </div>
          {sidebarItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.name}
                className={`group relative flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 shadow-lg"
                    : "hover:bg-slate-700/50 hover:translate-x-1"
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r"></div>
                )}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
                      : "bg-slate-700 group-hover:bg-slate-600"
                  }`}
                >
                  {item.icon}
                </div>
                <div className="ml-3 flex-1">
                  <span className={`text-sm font-medium ${isActive ? "text-white" : "text-slate-300"}`}>
                    {item.name}
                  </span>
                </div>
                {isActive && (
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">A</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-slate-400">Online</p>
              </div>
            </div>
            <button 
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-6 left-6 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-slate-700"
        >
          {isMobileOpen ? <XCircle className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)}></div>
          <div className="absolute left-0 top-0 h-full w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transform transition-transform duration-300">
            {/* Mobile Header */}
            <div className="p-6 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Admin Panel
                    </h2>
                    <p className="text-xs text-slate-400">Management System</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex-1 p-4 space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                Navigation
              </div>
              {sidebarItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <div
                    key={item.name}
                    className={`group relative flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 shadow-lg"
                        : "hover:bg-slate-700/50"
                    }`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r"></div>
                    )}
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
                          : "bg-slate-700 group-hover:bg-slate-600"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="ml-3 flex-1">
                      <span className={`text-sm font-medium ${isActive ? "text-white" : "text-slate-300"}`}>
                        {item.name}
                      </span>
                    </div>
                    {isActive && (
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-slate-700/50">
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">A</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Admin User</p>
                    <p className="text-xs text-slate-400">Online</p>
                  </div>
                </div>
                <button 
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNavbar;