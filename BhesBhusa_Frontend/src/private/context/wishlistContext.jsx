import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { userId, token } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Wishlist Items
  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`/api/wishlist/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(response.data?.items || []);
    } catch (error) {
      setError("Failed to fetch Wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWishlist();
    }
  }, [userId]);

  // Add to Wishlist
  const addToWishlist = async (clothId) => {
    try {
      console.log("Adding to wishlist:", { userId, clothId });

      const response = await axios.post(
        "/api/wishlist/save",
        {
          userId,
          items: [{ cloth: clothId }],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Wishlist updated:", response.data);
      setWishlist(response.data?.items || []);
    } catch (err) {
      console.error("Add to Wishlist failed:", err.response?.data || err.message);
      setError("Failed to add item to Wishlist.");
    }
  };

  // Remove from Wishlist
  const removeFromWishlist = async (clothId) => {
    try {
      const response = await axios.delete(`/api/wishlist/${userId}/${clothId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { clothId },
      });
      setWishlist(response.data?.items || []);
    } catch (error) {
      console.error("Remove from Wishlist failed:", error);
      setError("Failed to remove item from Wishlist.");
    }
  };

  // Toggle Wishlist
  const toggleWishlist = async (clothId) => {
    const isWishlisted = wishlist.some(
      (item) => item.cloth?._id === clothId || item._id === clothId
    );
    if (isWishlisted) {
      await removeFromWishlist(clothId);
    } else {
      await addToWishlist(clothId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        setWishlist,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        fetchWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
