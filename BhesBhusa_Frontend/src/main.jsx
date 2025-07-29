import ReactDOM from "react-dom/client"; // Import createRoot
import App from "./App";
import "./index.css"; // Ensure this file contains Tailwind's directives
import { AuthProvider } from "./private/context/AuthContext";
import { CartProvider } from "./private/context/cartContext";
import { WishlistProvider } from "./private/context/wishlistContext";

const root = ReactDOM.createRoot(document.getElementById("root")); // Use createRoot
root.render(
  <AuthProvider>
    <CartProvider>
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </CartProvider>
  </AuthProvider>
);
