import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VerificationCode = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const email = localStorage.getItem("resetEmail") || "";
  const navigate = useNavigate();

  const handleCodeChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 3) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 4) {
      toast.error("Please enter all 4 digits");
      return;
    }

    try {
      toast.success("Code verified");
      localStorage.setItem("resetCode", fullCode);
      navigate("/setNewPassword");
    } catch (err) {
      toast.error("Invalid code or expired");
    }
  };

  const handleResendCode = async () => {
    try {
      await axios.post("/api/auth/forgetpassword", { email });
      toast.success("Code resent to your email");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to resend code");
    }
  };

  return (
    <div className="w-screen h-screen bg-white overflow-hidden font-[Dosis] relative">
      <div className="flex items-center justify-center h-full">
        <div className="bg-white rounded-[6px] p-16 shadow-sm border border-gray-300 w-[650px]">
          <div className="text-center mb-6">
            <div className="mb-6">
              <img
                src="/src/assets/images/forgetPasswordImg.png"
                alt="Forgot Password"
                className="mx-auto w-38 h-34 object-contain"
              />
            </div>
            <h1 className="text-4xl font-dosis font-semibold text-gray-900 mb-2">
              Enter your code
            </h1>
            <p className="text-gray-600 font-dosis font-medium">
              {email} Please enter code to update password
            </p>
          </div>

          <div className="flex justify-center space-x-6 mb-8">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-24 h-20 border border-gray-300 rounded-lg text-center text-2xl font-medium focus:outline-none"
                maxLength={1}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="w-[300px] h-12 bg-[#4B2E2E] font-dosis text-white rounded-[6px] text-lg font-medium hover:bg-[#2D2623] transition-colors mb-6"
            >
              Continue
            </button>
          </div>

          <div className="text-center mb-6 ">
            <span className="text-gray-600 font-dosis font-medium">
              Didn't receive code?{" "}
            </span>
            <button
              onClick={handleResendCode}
              className="text-blue-600 font-dosis font-medium hover:text-blue-700 hover:underline"
            >
              Click here
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-gray-600 font-dosis hover:text-gray-800 flex items-center justify-center mx-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationCode;
