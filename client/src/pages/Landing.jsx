import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import AISection from "../components/AISection";
import Integration from "../components/Integration";
import About from "../components/About";
import Footer from "../components/Footer";

const Landing = () => {
  return (
    <main className="min-h-screen bg-[#050507]">
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
