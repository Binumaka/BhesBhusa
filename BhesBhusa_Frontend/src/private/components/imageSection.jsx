import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ornaments = [
  {
    title: "Chaubandi_Cholo",
    description:
      "The Chaubandi Cholo is a staple for any Nepali wardrobe. Made from soft, durable cotton, its fitted design and vibrant floral patterns make it a versatile piece for everyday wear or festive occasions. ",
    mainImage: "src/assets/images/Chaubandi _Cholo.png",
    smallImage: "src/assets/images/Chaubandi _Cholo.png",
  },
  {
    title: "Chaubandi_cholo",
    description:
      "The Chaubandi Cholo is a staple for any Nepali wardrobe. Made from soft, durable cotton, its fitted design and vibrant floral patterns make it a versatile piece for everyday wear or festive occasions. ",
    mainImage: "src/assets/images/Chaubandi _Cholo1.png",
    smallImage: "src/assets/images/Chaubandi _Cholo1.png",
  },
  {
    title: "Hakupatasi",
    description:
      "Haku Patasi is a traditional Newari dress worn by Newari women in Nepal. It is a two-piece outfit consisting of a saree and a blouse. The original translation of the word : “Haku” means Black and “Patasi” means Sari.",
    mainImage: "src/assets/images/Hakupatasi.png",
    smallImage: "src/assets/images/Hakupatasi.png",
  },
  {
    title: "Newari_Cholo",
    description:
      "A Newari blouse, often part of the traditional Haku Patasi attire, is a fitted garment worn by Newari women, typically made of cotton or wool. It is often brightly colored and may feature patterns or embroidery.",
    mainImage: "src/assets/images/Newari_cholo.png",
    smallImage: "src/assets/images/Newari_cholo.png",
  },
  {
    title: "Lungi",
    description:
      "Designed with the vibrant spirit of the Magar and Gurung communities, this lungi is a cultural statement piece. Its soft cotton fabric is perfect for everyday wear or ceremonial occasions, ensuring durability without compromising on comfort.",
    mainImage: "src/assets/images/Lungi.png",
    smallImage: "src/assets/images/Lungi.png",
  },
];

const OrnamentShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % ornaments.length);
        setIsVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const item = ornaments[currentIndex];

  return (
    <div className="min-h-screen m-0 p-0 relative overflow-hidden">
      <div className="relative z-10 grid grid-cols-12 mt-12">
        {/* Left Section */}
        <div className="col-span-6 flex flex-col justify-center px-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="text-sm font-mono text-gray-500 tracking-widest">
              {String(currentIndex + 1).padStart(2, "0")} /{" "}
              {String(ornaments.length).padStart(2, "0")}
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-300 to-transparent" />
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden">
              <h1
                className={`text-6xl font-bold text-gray-800 transition-all duration-700 ${
                  isVisible
                    ? "transform translate-y-0 opacity-100"
                    : "transform translate-y-full opacity-0"
                }`}
              >
                {item.title.split("").map((char, index) => (
                  <span
                    key={index}
                    className="inline-block transition-all duration-500"
                    style={{
                      transitionDelay: `${index * 50}ms`,
                      transform: isVisible ? "translateY(0)" : "translateY(100%)",
                    }}
                  >
                    {char}
                  </span>
                ))}
              </h1>
            </div>

            <div className="overflow-hidden">
              <p
                className={`text-lg text-gray-600 leading-relaxed max-w-md transition-all duration-700 delay-300 ${
                  isVisible
                    ? "transform translate-x-0 opacity-100"
                    : "transform translate-x-8 opacity-0"
                }`}
              >
                {item.description}
              </p>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            {ornaments.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => {
                    setCurrentIndex(index);
                    setIsVisible(true);
                  }, 300);
                }}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? "w-12 h-3 bg-amber-500 rounded-full"
                    : "w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <div className="pt-20">
            <button
              className="group relative px-8 py-4 bg-gray-900 text-white rounded-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              onClick={() => {navigate("/category")}}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></div>
              <span className="relative z-10 flex items-center font-semibold">
                Explore Collection
                <svg
                  className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-span-6 flex items-center justify-center relative">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-amber-400 rounded-full animate-ping"></div>
            <div
              className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-orange-400 rounded-full animate-ping"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/6 w-2 h-2 bg-yellow-400 rounded-full animate-ping"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 -m-8">
              <div
                className="w-full h-full border-2 border-dashed border-amber-300 rounded-full opacity-30 animate-spin"
                style={{ animationDuration: "20s" }}
              ></div>
            </div>

            <div
              className={`relative transition-all duration-700 ${
                isVisible
                  ? "transform scale-100 rotate-0 opacity-100"
                  : "transform scale-75 rotate-12 opacity-0"
              }`}
            >
              <div className="w-80 h-96 bg-white/40 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-all duration-500">
                <img
                  src={item.mainImage}
                  alt="Main Ornament"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>

              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/60 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl overflow-hidden animate-float">
                <img
                  src={item.smallImage}
                  alt="Small ornament"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute top-8 -left-8 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-orbit"></div>
              <div className="absolute bottom-8 -right-8 w-4 h-4 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full animate-orbit-reverse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(60px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(60px) rotate(-360deg);
          }
        }

        @keyframes orbit-reverse {
          0% {
            transform: rotate(360deg) translateX(80px) rotate(360deg);
          }
          100% {
            transform: rotate(0deg) translateX(80px) rotate(0deg);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-orbit {
          animation: orbit 8s linear infinite;
        }

        .animate-orbit-reverse {
          animation: orbit-reverse 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default OrnamentShowcase;
