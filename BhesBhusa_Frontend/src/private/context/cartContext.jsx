import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { userId, token } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Cart Items
  const fetchCart = async () => {
    try {
      const response = await axios.get(`/api/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data.items || []);
    } catch (error) {
      setError("Failed to fetch cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart when userId changes
  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  // Add to Cart with size support
  const addToCart = async (clothes, quantity = 1, size = "") => {
  if (!userId || !clothes) {
    console.error("Missing userId or clothes object");
    setError("Invalid user or clothes");
    return;
  }

  const clothId = typeof clothes === "string" ? clothes : clothes._id;

  try {
    const response = await axios.post(
      "/api/cart/save",
      {
        userId,
        items: [
          {
            cloth: clothId,
            quantity,
            size,
          },
        ],
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setCart(response.data?.items || []);
  } catch (err) {
    console.error("Add to cart failed:", err.response?.data || err.message);
    setError("Failed to add item to cart.");
  }
};

  // Remove from Cart
  const removeFromCart = async (clothId) => {
    try {
      await axios.delete(`/api/cart/${userId}/${clothId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart((prev) => prev.filter((item) => item.cloth?._id !== clothId));
    } catch (error) {
      console.error("Error deleting cart item", error);
      setError("Failed to remove item from cart.");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        loading,
        error,
        addToCart,
        removeFromCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
