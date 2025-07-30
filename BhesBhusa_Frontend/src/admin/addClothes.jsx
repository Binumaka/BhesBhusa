import axios from "axios";
import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import AdminNavbar from "./adminNavbar";

const AddClothes = () => {
  const [clothesData, setClothesData] = useState({
    title: "",
    price: "",
    rating: "",
    quality: "",
    category: "",
    tags: "",
    description: "",
    available: "",
    section: "NewArrival",
    image: null,
    image1: null,
    image2: null,
  });

  const [imagePreviews, setImagePreviews] = useState({
    image: null,
    image1: null,
    image2: null,
  });

  const [isFreeSize, setIsFreeSize] = useState(true);
  const [availableSizes, setAvailableSizes] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const sizeOptions = ['34"', '36"', '38"', '40"', '42"', '44"', '46"'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClothesData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setClothesData((prev) => ({ ...prev, [name]: files[0] }));
      setImagePreviews((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(files[0]),
      }));
    }
  };

  const removeImage = (fieldName) => {
    setClothesData((prev) => ({ ...prev, [fieldName]: null }));
    setImagePreviews((prev) => ({ ...prev, [fieldName]: null }));
    const fileInput = document.querySelector(`input[name="${fieldName}"]`);
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);

    const formData = new FormData();
    Object.entries(clothesData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        if (key === "tags") {
          value.split(",").forEach((tag) => formData.append("tags", tag.trim()));
        } else {
          formData.append(key, value);
        }
      }
    });

    formData.append("isFreeSize", isFreeSize);
    if (!isFreeSize) {
      availableSizes.forEach((size) => formData.append("availableSizes", size));
    }

    try {
      await axios.post("/api/clothes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setClothesData({
        title: "",
        price: "",
        rating: "",
        quality: "",
        category: "",
        tags: "",
        description: "",
        available: "",
        section: "NewArrival",
        image: null,
        image1: null,
        image2: null,
      });
      setImagePreviews({ image: null, image1: null, image2: null });
      setIsFreeSize(true);
      setAvailableSizes([]);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload clothes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="w-full flex-1 overflow-y-auto h-screen bg-white">
        <div className="bg-white shadow-md overflow-hidden">
          <div className="bg-indigo-500 py-6 px-8">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Upload className="mr-2" size={24} />
              Add New Clothes
            </h2>
            <p className="text-blue-100 mt-1">Fill in the details to add new clothing items</p>
          </div>

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6">
              <p className="text-sm text-green-700">Clothes uploaded successfully!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["title", "price", "rating", "quality", "category", "tags", "available"].map((name) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </label>
                  <input
                    type={name === "price" || name === "rating" ? "number" : "text"}
                    name={name}
                    value={clothesData[name]}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={clothesData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Size Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Size Type</label>
                <div className="flex gap-6 mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sizeType"
                      value="free"
                      checked={isFreeSize}
                      onChange={() => {
                        setIsFreeSize(true);
                        setAvailableSizes([]);
                      }}
                    />
                    Free Size
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sizeType"
                      value="multiple"
                      checked={!isFreeSize}
                      onChange={() => setIsFreeSize(false)}
                    />
                    Multiple Sizes
                  </label>
                </div>

                {!isFreeSize && (
                  <div className="grid grid-cols-3 gap-3">
                    {sizeOptions.map((size) => (
                      <label key={size} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={size}
                          checked={availableSizes.includes(size)}
                          onChange={(e) => {
                            const selected = e.target.checked;
                            setAvailableSizes((prev) =>
                              selected ? [...prev, size] : prev.filter((s) => s !== size)
                            );
                          }}
                        />
                        {size}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Section Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <select
                  name="section"
                  value={clothesData.section}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="NewArrival">New Arrival</option>
                  <option value="FeaturedOrnament">Featured Ornament</option>
                </select>
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Upload Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["image", "image1", "image2"].map((imgField, idx) => (
                    <div
                      key={imgField}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative"
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {idx === 0 ? "Main Image" : `Additional Image ${idx}`}
                      </label>
                      {imagePreviews[imgField] ? (
                        <div className="relative">
                          <img
                            src={imagePreviews[imgField]}
                            alt="Preview"
                            className="h-48 w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(imgField)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="py-8">
                          <input
                            type="file"
                            name={imgField}
                            onChange={handleFileChange}
                            required={imgField === "image"}
                            className="hidden"
                            id={imgField}
                            accept="image/*"
                          />
                          <label
                            htmlFor={imgField}
                            className="cursor-pointer flex flex-col items-center justify-center"
                          >
                            <Upload className="h-10 w-10 text-gray-400" />
                            <span className="mt-2 text-sm text-gray-500">Upload image</span>
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${
                  isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                } text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin mr-3 h-5 w-5 text-white"
                      xmlns="https://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  "Add Clothes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddClothes;
