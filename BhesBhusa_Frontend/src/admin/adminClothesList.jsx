import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminNavbar from "./adminNavbar";

const AdminClothesList = () => {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const response = await axios.get("/api/clothes");
        setClothes(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching clothes:", error);
        alert("Failed to load clothes. Please try again.");
        setLoading(false);
      }
    };
    fetchClothes();
  }, []);

  const handleDelete = async (clothId) => {
    if (window.confirm("Are you sure you want to delete this clothes?")) {
      try {
        await axios.delete(`/api/clothes/${clothId}`);
        setClothes((prev) => prev.filter((clothes) => clothes._id !== clothId)); // ✅ Corrected
        toast.success("Clothes deleted successfully!");
      } catch (error) {
        console.error("Error deleting clothes:", error);
        toast.error("Failed to delete clothes.");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/editDestination/${id}`);
  };

  const handleAddNew = () => {
    navigate("/addClothes");
  };

  return (
    <div className="ml-64 px-6 min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="flex-1 p-8">
        <div className="mx-auto ">
          <img
            src="/src/assets/images/BBlogo.png"
            alt="Logo"
            className="h-16 w-[90px]"
          />
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-dosis text-gray-800">
              Traditional Clothes Management
            </h1>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <svg
                xmlns="https://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add New Collection
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : clothes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <svg
                xmlns="https://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-xl text-gray-600 mb-4">No clothes available</p>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Your First Collection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {clothes.map((clothes) => (
                <div
                  key={clothes._id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        "https://localhost:3000/clothes_image/" +
                          clothes.image || "https://via.placeholder.com/150"
                      }
                      alt={clothes.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>

                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {clothes.title}
                    </h2>

                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleEdit(clothes._id)}
                        className="flex-1 px-3 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <svg
                          xmlns="https://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(clothes._id);
                        }}
                        className="flex-1 px-3 py-2 bg-white border border-red-500 text-red-500 text-sm rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                      >
                        <svg
                          xmlns="https://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminClothesList;
