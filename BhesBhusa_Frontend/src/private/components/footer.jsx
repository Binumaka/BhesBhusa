import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#9e7d7d] text-white py-10 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Contact */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-7">
            <img
              src="/src/assets/images/BBlogo.png"
              alt="Logo"
              className="w-24 object-contain"
            />
          </div>
          <div className="text-md space-y-4">
            <p className="flex items-center font-dosis font-medium gap-2">
              <FaMapMarkerAlt /> Bhaktapur, Nepal
            </p>
            <p className="flex items-center font-dosis font-medium gap-2">
              <FaPhoneAlt /> 9876543210
            </p>
            <p className="flex items-center font-dosis font-medium gap-2">
              <FaEnvelope /> bhesbhusa@gmail.com
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-[22px] font-dosis font-semibold mb-3 mt-14">Quick Links</h3>
          <ul className="space-y-2 text-md">
            <li><a href="#" className="hover:underline font-dosis font-medium">About Us</a></li>
            <li><a href="#" className="hover:underline font-dosis font-medium">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline font-dosis font-medium">Terms of Service</a></li>
            <li><a href="/category" className="hover:underline font-dosis font-medium">Clothes</a></li>
            <li><a href="/orderlist" className="hover:underline font-dosis font-medium">Orders</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-[22px] font-dosis font-semibold mb-3 mt-14">Stay Connected</h3>
          <div className="flex gap-4 text-xl">
            <a href="#" className="hover:text-gray-300"><FaFacebookF /></a>
            <a href="#" className="hover:text-gray-300"><FaTwitter /></a>
            <a href="#" className="hover:text-gray-300"><FaInstagram /></a>
          </div>
        </div>

        {/* Subscribe Section */}
        <div>
          <h3 className="text-[22px] font-dosis font-semibold mb-3 mt-14">Get our latest updates.</h3>
          <input
            type="email"
            placeholder="Enter your email address here ..."
            className="w-full bg-transparent border-b border-white py-2 placeholder-white font-dosis text-sm mb-4 focus:outline-none"
          />
          <button className="bg-[#4b2e2e] text-white py-2 px-6 rounded hover:bg-[#6b3f3f] transition font-dosis text-sm">
            SUBSCRIBE
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
