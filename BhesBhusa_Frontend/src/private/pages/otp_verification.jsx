import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const OtpVerifyPage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("pendingEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.error("No email found for verification");
      navigate("/register");
    }
  }, [navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/verify-otp", { email, otp });

      toast.success("OTP verified. You can now login.");
      localStorage.removeItem("pendingEmail");

      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleVerify} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Verify OTP</h2>
        <p className="text-sm text-gray-600 mb-4">OTP sent to: {email}</p>

        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          className="border p-2 mb-3 w-full"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button type="submit" className="bg-green-600 text-white py-2 w-full rounded">
          Verify
        </button>
      </form>
    </div>
  );
};

export default OtpVerifyPage;
