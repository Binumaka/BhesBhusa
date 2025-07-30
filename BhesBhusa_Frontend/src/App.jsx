import axios from "axios";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AddClothes from "./admin/addClothes";
import AdminClothesList from "./admin/adminClothesList";
import AdminDashboard from "./admin/adminDashboard";
import AdminNavbar from "./admin/adminNavbar";
import "./App.css";
import ForgotPassword from "./private/Auth/forgetPassword";
import VerificationCode from "./private/Auth/pin";
import SetNewPassword from "./private/Auth/resetpassword";
import AboutUs from "./private/pages/aboutusScreen";
import CheckoutPage from "./private/pages/checkout";
import Clothes from "./private/pages/clothCategory";
import ClothDetails from "./private/pages/clothesDetail";
import Dashboard from "./private/pages/dashboard";
import OrderComplete from "./private/pages/orderComplete";
import OtpVerification from "./private/pages/otp_verification";
import ProfilePage from "./private/pages/profileScreen";
import CartScreen from "./private/pages/shoppingCart";
import SuccessPage from "./private/pages/success";
import Unauthorized from "./private/pages/unauthorizedPage";
import OrderList from "./private/pages/viewOrders";
import WishListScreen from "./private/pages/wishlistDisplay";
import LoginScreen from "./public/Login";
import RegisterPage from "./public/Register";

import AdminProtectedRoute from "./private/routes/AdminProtectedRoute";
import UserProtectedRoute from "./private/routes/UserProtectedRoute";
import ActivityLogPage from "./admin/activityLog";

// Axios config
axios.defaults.baseURL = "https://localhost:3000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        style={{ zIndex: 1000 }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/otp-verify" element={<OtpVerification />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/setNewPassword" element={<SetNewPassword />} />
        <Route path="/pin" element={<VerificationCode />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* User Protected Routes */}
        <Route element={<UserProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clothesDetail/:id" element={<ClothDetails />} />
          <Route path="/wishlist" element={<WishListScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/category" element={<Clothes />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order" element={<OrderComplete />} />
          <Route path="/orderlist" element={<OrderList />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/products" element={<AdminDashboard />} />
          <Route path="/AdminNavbar" element={<AdminNavbar />} />
          <Route path="/adminCloth" element={<AdminClothesList />} />
          <Route path="/addClothes" element={<AddClothes />} />
          <Route path="/userList" element={<ActivityLogPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
