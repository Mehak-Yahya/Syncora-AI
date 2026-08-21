import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import AISection from "../components/AISection";
import Integration from "../components/Integration";
import About from "../components/About";
import Footer from "../components/Footer";
import SplashCursor from "../components/SplashCursor/SplashCursor";

const Landing = () => {
  return (
    <main className="relative min-h-screen bg-[#050507]">
      <SplashCursor
        COLOR="#FF5C35"
        RAINBOW_MODE={false}
        SPLAT_FORCE={5000}
        SPLAT_RADIUS={0.2}
        CURL={3}
        DENSITY_DISSIPATION={3.5}
        VELOCITY_DISSIPATION={2}
        SHADING
      />

      <Navbar />
      <Hero />
      <Features />
      <AISection />
      <Integration />
      <About />
      <Footer />
    </main>
  );
};

export default Landing;