import FeaturedOrnament from "../components/FeaturedOrnament";
import Footer from "../components/footer";
import OrnamentShowcase from "../components/imageSection";
import Navbar from "../components/NavBar";
import NewArrivals from "../components/newArrival";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      {/* Hero Section */}
      <div className="relative w-full h-[600px] mt-20 overflow-hidden shadow-md ">
        <OrnamentShowcase />
      </div>

      {/* New Arrival Section*/}
      <section className="py-8 bg-white">
        <div className="mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-dosis font-semibold mb-4">
              New Arrival
            </h2>
          </div>
          <NewArrivals />
        </div>
      </section>

      {/* Featured ornament Section */}
      <section className="py-8 bg-gray-100">
        <div className="mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-dosis font-semibold mb-4">
              Featured Clothes
            </h2>
          </div>
          <FeaturedOrnament />
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Home;
