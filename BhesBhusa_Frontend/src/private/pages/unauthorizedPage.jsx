import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <Lock size={64} className="text-red-500 mb-4" />
      <h1 className="text-4xl font-bold mb-2 text-gray-800">Unauthorized</h1>
      <p className="text-gray-600 mb-6">
        You do not have permission to view this page.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
      >
        Go to Login
      </button>
    </div>
  );
};

export default UnauthorizedPage;
