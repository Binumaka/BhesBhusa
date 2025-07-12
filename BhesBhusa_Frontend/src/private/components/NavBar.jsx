import axios from "axios";
import { Heart, LogOut, Search, ShoppingCart, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/cartContext";
import { useWishlist } from "../context/wishlistContext";

const NavBar = () => {
  const navigate = useNavigate();
  const { logout, isLoggedIn, userId, token } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  useEffect(() => {
    console.log("Navbar Rendered - isLoggedIn:", isLoggedIn, "userId:", userId, "token:", token);
  }, [isLoggedIn, userId, token]);

  useEffect(() => {
    if (searchQuery.trim()) {
      axios
        .get(
          `/api/clothes/search?searchTerm=${encodeURIComponent(
            searchQuery.trim()
          )}`
        )
        .then((res) => {
          setResults(res.data);
          setShowDropdown(true);
        })
        .catch(() => {
          setResults([]);
          setShowDropdown(false);
        });
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [searchQuery]);

  const cartCount = cart?.length || 0;
  const wishlistCount = wishlist?.length || 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b">
      <div className="max-w-full mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="flex items-center">
              <img
                src="/src/assets/images/BBlogo.png"
                alt="Logo"
                className="h-16 w-[90px]"
              />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-[450px] relative hidden md:block" ref={dropdownRef}>
            <form onSubmit={(e) => e.preventDefault()} className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search here ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-6 py-2 border font-medium font-dosis border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none transition-all"
              />
            </form>

            {showDropdown && results.length > 0 && (
              <div className="absolute mt-2 w-[700px] bg-white border rounded-md shadow-lg z-50 max-h-[400px] overflow-y-auto">
                {results.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 items-center p-4 border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/clothesDetail/${item._id}`)}
                  >
                    <img
                      src={`https://localhost:3000/clothes_image/${item.image}`}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex flex-col">
                      <h3 className="text-lg font-dosis font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-500 font-medium font-dosis line-clamp-2">
                        {item.description?.substring(0, 120)}...
                        <span className="text-blue-600 font-dosis"> Read more</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-20">
            <Link to="/category" className="text-gray-700 text-[20px] font-dosis hover:text-gray-900 font-medium">Clothes</Link>
            <Link to="/orderlist" className="text-gray-700 text-[20px] font-dosis hover:text-gray-900 font-medium">Orders</Link>
            <Link to="/about" className="text-gray-700 text-[20px] font-dosis hover:text-gray-900 font-medium">About Us</Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-10 mr-2">
            <div className="relative">
                <Link to="/wishlist">
                  <Heart className="w-10 h-7 cursor-pointer transition stroke-2 text-gray-600 hover:text-gray-900" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-medium w-4 h-4 flex items-center justify-center rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </div>

              <div className="relative">
                <Link to="/cart">
                  <ShoppingCart className="w-10 h-7 cursor-pointer transition stroke-2 text-gray-600 hover:text-gray-900" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-medium w-4 h-4 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-gray-700 hover:text-gray-900"
                >
                  <User className="w-10 h-7 cursor-pointer transition stroke-2 text-gray-600 hover:text-gray-900" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white font-dosis rounded-md shadow-lg py-2 z-20 border">
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 font-dosis font-medium hover:bg-gray-100">Profile</Link>
                    <Link to="/orderlist" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 font-dosis font-medium hover:bg-gray-100">Orders</Link>
                    <hr className="my-2" />
                    <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100 flex items-center">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-gray-900">
                <User className="h-6 w-6" />
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden ml-4 relative">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700 hover:text-gray-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {mobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 z-30 border">
                <Link to="/category" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Clothes</Link>
                <Link to="/orderlist" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Orders</Link>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">About Us</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
