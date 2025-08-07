import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginScreen = () => {
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const { email, password } = formData;

      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.removeItem("pendingEmail");
      localStorage.setItem("authToken", token);
      const decoded = jwtDecode(token);
      const role = decoded.role;
      toast.success("Login Successful");
      if (role === "admin") {
        navigate("/adminDashboard");
      } else {
        navigate("/dashboard");
        window.location.reload();
      }
    } catch (err) {
      console.error("Login failed:", err);

      if (err.response?.status === 429) {
        setErrors({
          general: "Too many attempts. Please try again after 15 minutes.",
        });
        toast.error("Too many attempts. Try again later.");
      } else {
        setErrors({ general: "Invalid email or password. Please try again." });
        toast.error("Login failed");
      }

      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans flex flex-col md:flex-row overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 opacity-50 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 opacity-30 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 opacity-20 animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
      </div>

      {/* Logo */}
      <div
        className={`absolute top-6 left-6 z-10 transition-all duration-1000 ${
          mounted ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <div className="h-20 w-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
          <span className="text-white font-bold text-2xl">BB</span>
        </div>
      </div>

      {/* Form Section - Left Side */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div
          className={`w-full max-w-md transition-all duration-1000 delay-300 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* Floating card with glassmorphism effect */}
          <div className="relative">
            {/* Card glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-2xl blur opacity-25 animate-pulse"></div>

            <div className="relative bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6 border border-gray-200 border-opacity-50 hover:shadow-3xl transition-all duration-500">
              {/* Header */}
              <div className="text-center mb-8">
                <h1
                  className="text-4xl font-bold text-gray-800 mb-2"
                  style={{
                    animation: "fadeIn 1s ease-out",
                  }}
                >
                  Welcome Back
                </h1>
                <div
                  className="w-20 h-1 bg-gradient-to-r from-gray-600 to-gray-800 mx-auto rounded-full"
                  style={{
                    animation: "scaleIn 0.8s ease-out 0.5s both",
                  }}
                ></div>
                <p className="text-gray-600 mt-4">
                  Sign in to your BhesBhusa account
                </p>
              </div>

              {/* General Error Message */}
              {errors.general && (
                <div
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center"
                  style={{
                    animation: "shake 0.5s ease-in-out",
                  }}
                >
                  <AlertCircle size={16} className="mr-2" />
                  <span>{errors.general}</span>
                </div>
              )}

              <div className="space-y-6">
                {/* Email Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-all duration-300" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl text-sm bg-white bg-opacity-50 backdrop-blur-sm focus:outline-none focus:border-gray-400 focus:bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-md ${
                        errors.email
                          ? "border-red-300 focus:border-red-400"
                          : "border-gray-200"
                      }`}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{
                        animation: mounted
                          ? "slideInRight 0.6s ease-out 0.4s both"
                          : "",
                      }}
                    />
                    {formData.email &&
                      !errors.email &&
                      /\S+@\S+\.\S+/.test(formData.email) && (
                        <CheckCircle2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
                      )}
                  </div>
                  {errors.email && (
                    <p
                      className="text-red-500 text-xs mt-2 flex items-center space-x-1"
                      style={{
                        animation: "shake 0.5s ease-in-out",
                      }}
                    >
                      <AlertCircle size={12} />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-all duration-300" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl text-sm bg-white bg-opacity-50 backdrop-blur-sm focus:outline-none focus:border-gray-400 focus:bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-md ${
                        errors.password
                          ? "border-red-300 focus:border-red-400"
                          : "border-gray-200"
                      }`}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{
                        animation: mounted
                          ? "slideInRight 0.6s ease-out 0.6s both"
                          : "",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      className="text-red-500 text-xs mt-2 flex items-center space-x-1"
                      style={{
                        animation: "shake 0.5s ease-in-out",
                      }}
                    >
                      <AlertCircle size={12} />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div
                  className="flex items-center justify-between"
                  style={{
                    animation: mounted
                      ? "slideInRight 0.6s ease-out 0.8s both"
                      : "",
                  }}
                >
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-2 focus:ring-gray-500 transition-all duration-200"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors duration-200 relative group"
                    onClick={() => navigate("/forgotPassword")}
                  >
                    Forgot password?
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-800 group-hover:w-full transition-all duration-300"></span>
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={isSubmitting}
                  className={`w-full py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 ${
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:from-gray-900 hover:to-black"
                  }`}
                  style={{
                    animation: mounted ? "slideInUp 0.6s ease-out 1s both" : "",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={20} />
                      <span>Sign In</span>
                      <ChevronRight
                        size={20}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>

                {/* Register Link */}
                <div
                  className="text-center pt-4 border-t border-gray-200 border-opacity-50"
                  style={{
                    animation: mounted ? "fadeIn 0.6s ease-out 1.2s both" : "",
                  }}
                >
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/register")}
                      className="font-semibold text-gray-800 hover:text-black transition-colors duration-200 relative group"
                    >
                      Create Account
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-800 group-hover:w-full transition-all duration-300"></span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Visual Section */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-bl from-gray-100 to-gray-50 p-8 relative">
        <div
          className={`transition-all duration-1000 delay-500 ${
            mounted ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
          }`}
        >
          {/* Animated illustration */}
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute -inset-8 bg-gradient-to-r from-gray-200 from-opacity-30 to-gray-300 to-opacity-30 rounded-3xl blur-xl animate-pulse"></div>

            {/* Main illustration container */}
            <div className="relative w-96 h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden group">
              {/* Animated geometric shapes */}
              <div
                className="absolute top-8 left-8 w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl"
                style={{
                  animation: "float 6s ease-in-out infinite",
                }}
              ></div>
              <div
                className="absolute bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl"
                style={{
                  animation: "float 6s ease-in-out infinite 1s",
                }}
              ></div>
              <div
                className="absolute top-1/2 right-8 w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg"
                style={{
                  animation: "float 6s ease-in-out infinite 0.5s",
                }}
              ></div>

              {/* Central content */}
              <div className="text-center z-10">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mb-6 shadow-xl transition-transform duration-500 group-hover:scale-110">
                  <Shield className="text-white" size={48} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Secure Access
                </h2>
                <p className="text-gray-600 max-w-xs">
                  Sign in to access your personalized dashboard and exclusive
                  features
                </p>

                {/* Feature list */}
                <div className="mt-6 space-y-2 text-left">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span>Secure authentication</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span>Protected user data</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span>Quick and easy access</span>
                  </div>
                </div>
              </div>

              {/* Floating particles */}
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gray-400 rounded-full animate-ping"></div>
              <div
                className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-gray-500 rounded-full animate-ping"
                style={{ animationDelay: "0.7s" }}
              ></div>
              <div
                className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-gray-400 rounded-full animate-ping"
                style={{ animationDelay: "0.3s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(5deg);
          }
          66% {
            transform: translateY(5px) rotate(-3deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;
