import React, { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  ChevronRight,
  Shield,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
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
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
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
    
    if (!formData.confirmpassword) {
      newErrors.confirmpassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match";
    }
    
    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const { username, email, password, confirmpassword } = formData;

      // Original API call preserved - uncomment for actual use
      // const res = await axios.post("/api/auth/register", {
      //   username,
      //   email,
      //   password,
      //   confirmpassword
      // });

      // toast.success("OTP sent to your email.");
      // localStorage.setItem("pendingEmail", email);
      // navigate("/otp-verify");

      // Demo simulation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Registration successful:", { username, email, password, confirmpassword });
      console.log("OTP sent to email:", email);
      
    } catch (err) {
      console.error("Registration failed:", err);
      // toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    const levels = [
      { strength: 0, label: "", color: "" },
      { strength: 1, label: "Very Weak", color: "bg-red-500" },
      { strength: 2, label: "Weak", color: "bg-orange-500" },
      { strength: 3, label: "Fair", color: "bg-yellow-500" },
      { strength: 4, label: "Good", color: "bg-blue-500" },
      { strength: 5, label: "Strong", color: "bg-green-500" }
    ];
    
    return levels[strength];
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans flex flex-col md:flex-row overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 opacity-20 animate-spin" style={{animationDuration: '20s'}}></div>
      </div>

      {/* Logo */}
      <div className={`absolute top-6 left-6 z-10 transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
        <div className="h-20 w-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
          <span className="text-white font-bold text-2xl">BB</span>
        </div>
      </div>

      {/* Form Section - Left Side */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className={`w-full max-w-md transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Floating card with glassmorphism effect */}
          <div className="relative">
            {/* Card glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-2xl blur opacity-25 animate-pulse"></div>
            
            <div className="relative bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6 border border-gray-200 border-opacity-50 hover:shadow-3xl transition-all duration-500">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{
                  animation: 'fadeIn 1s ease-out'
                }}>
                  Create Account
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-gray-600 to-gray-800 mx-auto rounded-full" style={{
                  animation: 'scaleIn 0.8s ease-out 0.5s both'
                }}></div>
                <p className="text-gray-600 mt-4">Join us and start your journey</p>
              </div>

              <div className="space-y-6">
                {/* Username Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-all duration-300" />
                    <input
                      type="text"
                      name="username"
                      placeholder="Enter your username"
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl text-sm bg-white bg-opacity-50 backdrop-blur-sm focus:outline-none focus:border-gray-400 focus:bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-md ${
                        errors.username 
                          ? 'border-red-300 focus:border-red-400' 
                          : 'border-gray-200'
                      }`}
                      value={formData.username}
                      onChange={handleChange}
                      required
                      style={{
                        animation: mounted ? 'slideInRight 0.6s ease-out 0.4s both' : ''
                      }}
                    />
                    {formData.username && !errors.username && formData.username.length >= 3 && (
                      <CheckCircle2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
                    )}
                  </div>
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-2 flex items-center space-x-1" style={{
                      animation: 'shake 0.5s ease-in-out'
                    }}>
                      <AlertCircle size={12} />
                      <span>{errors.username}</span>
                    </p>
                  )}
                </div>

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
                          ? 'border-red-300 focus:border-red-400' 
                          : 'border-gray-200'
                      }`}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{
                        animation: mounted ? 'slideInRight 0.6s ease-out 0.6s both' : ''
                      }}
                    />
                    {formData.email && !errors.email && /\S+@\S+\.\S+/.test(formData.email) && (
                      <CheckCircle2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-2 flex items-center space-x-1" style={{
                      animation: 'shake 0.5s ease-in-out'
                    }}>
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
                      placeholder="Create a password"
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl text-sm bg-white bg-opacity-50 backdrop-blur-sm focus:outline-none focus:border-gray-400 focus:bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-md ${
                        errors.password 
                          ? 'border-red-300 focus:border-red-400' 
                          : 'border-gray-200'
                      }`}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{
                        animation: mounted ? 'slideInRight 0.6s ease-out 0.8s both' : ''
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
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{passwordStrength.label}</span>
                      </div>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-2 flex items-center space-x-1" style={{
                      animation: 'shake 0.5s ease-in-out'
                    }}>
                      <AlertCircle size={12} />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-all duration-300" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmpassword"
                      placeholder="Confirm your password"
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl text-sm bg-white bg-opacity-50 backdrop-blur-sm focus:outline-none focus:border-gray-400 focus:bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-md ${
                        errors.confirmpassword 
                          ? 'border-red-300 focus:border-red-400' 
                          : 'border-gray-200'
                      }`}
                      value={formData.confirmpassword}
                      onChange={handleChange}
                      required
                      style={{
                        animation: mounted ? 'slideInRight 0.6s ease-out 1s both' : ''
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {formData.confirmpassword && formData.password === formData.confirmpassword && (
                      <CheckCircle2 className="absolute right-12 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
                    )}
                  </div>
                  {errors.confirmpassword && (
                    <p className="text-red-500 text-xs mt-2 flex items-center space-x-1" style={{
                      animation: 'shake 0.5s ease-in-out'
                    }}>
                      <AlertCircle size={12} />
                      <span>{errors.confirmpassword}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={isSubmitting}
                  className={`w-full py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 ${
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:from-gray-900 hover:to-black"
                  }`}
                  style={{
                    animation: mounted ? 'slideInUp 0.6s ease-out 1.2s both' : ''
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      <span>Create Account</span>
                      <ChevronRight size={20} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {/* Sign In Link */}
                <div className="text-center pt-4 border-t border-gray-200 border-opacity-50" style={{
                  animation: mounted ? 'fadeIn 0.6s ease-out 1.4s both' : ''
                }}>
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="font-semibold text-gray-800 hover:text-black transition-colors duration-200 relative group"
                    >
                      Sign In
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
        <div className={`transition-all duration-1000 delay-500 ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
          {/* Animated illustration */}
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute -inset-8 bg-gradient-to-r from-gray-200 from-opacity-30 to-gray-300 to-opacity-30 rounded-3xl blur-xl animate-pulse"></div>
            
            {/* Main illustration container */}
            <div className="relative w-96 h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden group">
              {/* Animated geometric shapes */}
              <div className="absolute top-8 left-8 w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl" style={{
                animation: 'float 6s ease-in-out infinite'
              }}></div>
              <div className="absolute bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl" style={{
                animation: 'float 6s ease-in-out infinite 1s'
              }}></div>
              <div className="absolute top-1/2 right-8 w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg" style={{
                animation: 'float 6s ease-in-out infinite 0.5s'
              }}></div>
              
              {/* Central content */}
              <div className="text-center z-10">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mb-6 shadow-xl transition-transform duration-500 group-hover:scale-110">
                  <UserPlus className="text-white" size={48} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Join Our Community</h2>
                <p className="text-gray-600 max-w-xs">Create your account and unlock exclusive features and personalized experiences</p>
                
                {/* Feature list */}
                <div className="mt-6 space-y-2 text-left">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span>Secure account protection</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span>Personalized experience</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span>Access to premium features</span>
                  </div>
                </div>
              </div>
              
              {/* Floating particles */}
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gray-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-gray-500 rounded-full animate-ping" style={{animationDelay: '0.7s'}}></div>
              <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-gray-400 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(5deg); }
          66% { transform: translateY(5px) rotate(-3deg); }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;