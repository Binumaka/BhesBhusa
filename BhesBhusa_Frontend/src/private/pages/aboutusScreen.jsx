import { Award, Heart, Phone, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { MdCall, MdEmail } from "react-icons/md";
import NavBar from "../components/NavBar";
import Footer from "../components/footer";

const AboutUs = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const images = [
    "/src/assets/images/Hakupatasi.png",
    "/src/assets/images/Hakupatasi1.png",
    "/src/assets/images/Lungi.png",
    "/src/assets/images/Hakupatasi2.png",
    "/src/assets/images/Newari_cholo.png",
    "/src/assets/images/Newari_cholo1.png",
  ];

  // Change image every 3 seconds
  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="min-h-screen">
      <NavBar />
      {/* Hero Section */}
      <div
        className={`relative overflow-hidden mt-20 transition-all duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 to-transparent z-10"></div>
        <div className="relative z-20 mx-auto px-4 py-4">
          <div
            className={`text-center transition-all duration-1000 delay-300 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="text-5xl font-dosis font-bold text-gray-900 mb-6">
              About <span className="font-dosis text-orange-600">Us</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Enhanced Slideshow */}
          <div
            className={`transition-all duration-1000 delay-500 ${
              isLoaded
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <div className="relative group px-8">
              {/* Main slideshow container */}
              <div className="relative w-full h-[700px] rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>

                {/* Image slideshow */}
                <div className="relative w-full h-full">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-1000 ${
                        index === currentImageIndex
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-105"
                      }`}
                    >
                      <div
                        className="w-full h-full bg-cover bg-center bg-gray-200"
                        style={{ backgroundImage: `url(${image})` }}
                      >
                      </div>
                    </div>
                  ))}
                </div>

                {/* Image indicators */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="flex space-x-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentImageIndex
                            ? "bg-white scale-125"
                            : "bg-white/50 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Navigation arrows */}
                <button
                  onClick={() =>
                    setCurrentImageIndex(
                      currentImageIndex === 0
                        ? images.length - 1
                        : currentImageIndex - 1
                    )
                  }
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200"
                >
                  ←
                </button>
                <button
                  onClick={() =>
                    setCurrentImageIndex(
                      currentImageIndex === images.length - 1
                        ? 0
                        : currentImageIndex + 1
                    )
                  }
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200"
                >
                  →
                </button>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
            </div>
          </div>

          {/* Right side - Content */}
          <div
            className={`space-y-8 transition-all duration-1000 delay-700 ${
              isLoaded
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
          >
            {/* Main content card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Our Mission
                </h2>
              </div>

              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                Choose{" "}
                <span className="font-semibold text-orange-600">BhesBhusa</span> for
                purchasing traditional Nepali Clothes used in various
                cultural and ceremonial occasions. We aim to preserve heritage
                while offering users easy online access to authentic clothes.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Cloth Types</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Star className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">4.9</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>

              {/* Character Image */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <span className="text-3xl text-white font-bold">T</span>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-gray-100 rounded-2xl shadow-lg p-8 text-black">
              <h3 className="text-xl font-bold mb-6 flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span>Get In Touch</span>
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors duration-200">
                  <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                    <MdEmail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Us</p>
                    <p className="font-semibold">bhesbhusa@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors duration-200">
                  <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                    <MdCall className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Call Us</p>
                    <p className="font-semibold">9876543210</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div
        className={`bg-gray-50 py-16 transition-all duration-1000 delay-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose BhesBhusa?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Authentic Heritage
              </h3>
              <p className="text-gray-600">
                Genuine traditional Clothes with cultural significance
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Access
              </h3>
              <p className="text-gray-600">
                Convenient online platform for purchasing
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quality Assured
              </h3>
              <p className="text-gray-600">
                Carefully curated collection with quality guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {/* Mock Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>
            &copy; 2025 BhesBhusa. Preserving traditions, one attire at a time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
