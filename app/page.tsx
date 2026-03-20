import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Ticker from "./components/Ticker";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Gallery from "./components/Gallery";
import CTABanner from "./components/CTABanner";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Ticker />
      <Features />
      <HowItWorks />
      <Gallery />
      <CTABanner />
      <Footer />
    </main>
  );
}
