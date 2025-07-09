import axios from "axios";
import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!email.includes("@")) {
      newErrors.email = "Invalid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const res = await axios.post("api/auth/forgetpassword", { email });
      localStorage.setItem("resetEmail", email);
      toast.success(res.data.message || "Reset code sent!");
      navigate("/pin");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send reset code");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-white overflow-hidden relative">
      <div className="flex items-center justify-center h-full">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[6px] p-16 shadow-sm border border-gray-300 w-[650px] "
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mb-6">
              <img
                src="/src/assets/images/forgetPasswordImg.png"
                alt="Forgot Password"
                className="mx-auto w-38 h-34 object-contain"
              />
            </div>

            <h1 className="text-4xl font-dosis font-semibold text-gray-900 mb-2">
              Forgot Password
            </h1>
            <p className="text-gray-600 font-dosis font-medium">
              Enter your Email so that we can send reset code
            </p>
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-lm font-dosis font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg font-dosis text-base bg-white focus:outline-none focus:border-gray-400"
                placeholder=""
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-[300px] h-12 bg-[#4B2E2E] font-dosis text-white rounded-[6px] text-lg font-dosis font-medium ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#2D2623]"
              } transition-colors mb-6`}
            >
              {isSubmitting ? "Sending..." : "Send Email"}
            </button>
          </div>
          {/* Back to Login */}
          <div className="text-center">
            <button
              onClick={() => navigate("/login")}
              type="button"
              className="text-gray-600 font-dosis hover:text-gray-800 transition-colors flex items-center justify-center mx-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
