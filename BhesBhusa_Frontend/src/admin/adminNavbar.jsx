import { useState } from "react";
import { 
  LayoutDashboard,
  Map,
  Package,
  Calendar,
  Users,
  UserCog,
  LogOut,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../private/context/AuthContext";

const AdminNavbar = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const {logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigation = (path, name) => {
    setActiveItem(name);
    setIsMobileOpen(false);
    navigate(path);
  };

  const navItems = [
    { name: "Dashboard", path: "/adminDashboard", icon: LayoutDashboard },
    { name: "Clothes", path: "/adminCloth", icon: Map },
    { name: "Packages", path: "/admintourpackages", icon: Package },
    { name: "Orders", path: "/bookingAdmin", icon: Calendar },
    { name: "User List", path: "/userlist", icon: Users },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-200"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white
        border-r border-gray-200 shadow-xl
        transition-all duration-300 ease-in-out z-40
        ${isCollapsed ? 'w-20' : 'w-72'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                {/* Logo */}
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <img 
                    src="/api/placeholder/48/48" 
                    alt="Logo" 
                    className="w-8 h-8 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <UserCog className="w-6 h-6 text-white hidden" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                  <p className="text-xs text-gray-500">Management System</p>
                </div>
              </div>
            )}
            
            {isCollapsed && (
              <div className="flex items-center justify-center w-full">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <img 
                    src="/api/placeholder/48/48" 
                    alt="Logo" 
                    className="w-8 h-8 rounded object-contain"
                    onError={(e) => {
                      console.log('Collapsed logo failed to load:', e.target.src);
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <UserCog className="w-5 h-5 text-white" style={{display: 'none'}} />
                </div>
              </div>
            )}
            
            {/* Collapse Toggle - Desktop Only */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;
            
            return (
              <div
                key={item.name}
                onClick={() => handleNavigation(item.path, item.name)}
                className={`
                  group relative flex items-center px-4 py-3 rounded-xl cursor-pointer
                  transition-all duration-300 ease-in-out
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 shadow-md border border-blue-200' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full"></div>
                )}
                
                {/* Icon */}
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'bg-gray-100 group-hover:bg-gray-200 text-gray-600'
                  }
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                
                {/* Label */}
                {!isCollapsed && (
                  <div className="ml-4 flex-1">
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                )}
                
                {/* Hover Effect */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-gray-600 shadow-lg">
                    {item.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Section - Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`
              group w-full flex items-center px-4 py-3 rounded-xl
              text-red-500 hover:text-red-600 hover:bg-red-50 
              transition-all duration-300 border border-transparent hover:border-red-200
            `}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 group-hover:bg-red-100 transition-all duration-300">
              <LogOut className="w-5 h-5" />
            </div>
            
            {!isCollapsed && (
              <span className="ml-4 font-medium text-sm">Logout</span>
            )}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-gray-600 shadow-lg">
                Logout
              </div>
            )}
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      </div>

      {/* Main Content Spacer */}
      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'} transition-all duration-300`}>
        {/* Your main content goes here */}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .group {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default AdminNavbar;