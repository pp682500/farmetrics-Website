import { useState, useEffect } from "react";
import ActionCard from "../components/ActionCard";
import InfoSlider from "../components/InfoSlider";
import { CalculatorIcon, MapIcon, FolderIcon, DocumentIcon } from "../components/Icons";

const heroSlides = [
  {
    title: "What is the Farmetrics Calculator?",
    subtitle: "A comprehensive, farmer-friendly tool to calculate crop yield, profit, loss and seasonal performance.",
    bg: "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?auto=format&fit=crop&w=2000&q=80"
  },
  {
    title: "Revolutionizing Farm Management",
    subtitle: "Empowering Indian farmers with data-driven insights and official land record integrations.",
    bg: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=2000"
  },
  {
    title: "Smart Solutions for Agriculture",
    subtitle: "From yield forecasting to government scheme access, everything you need is right here.",
    bg: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=2000"
  }
];

function Home({ setPage }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div className="w-full">
      {/* ================= HERO SECTION ================= */}
      <section
        className="relative w-full h-[500px] md:h-[600px] overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out bg-cover bg-center bg-no-repeat flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-16`}
            style={{
              backgroundImage: `url('${slide.bg}')`,
              transform: `translateY(${(index - currentSlide) * 100}%)`,
              opacity: currentSlide === index ? 1 : 0,
              visibility: Math.abs(index - currentSlide) <= 1 ? "visible" : "hidden"
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />

            {/* Hero Content */}
            <div className="relative z-10 max-w-3xl mx-auto text-white">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 md:mb-6 leading-tight animate-in slide-in-from-bottom-8 duration-700">
                {slide.title}
              </h1>
              <p className="text-base sm:text-lg md:text-2xl leading-relaxed max-w-2xl font-medium text-white/90 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-1.5 transition-all duration-500 rounded-full ${currentSlide === i ? 'h-12 bg-green-500' : 'h-3 bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* ================= INFO SLIDER SECTION ================= */}
      <InfoSlider />

      {/* ================= ACTION TILES SECTION ================= */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative overflow-hidden">
        {/* Dynamic Color Blobs for "Colorful" feel */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-200/50 rounded-full blur-[100px] animate-pulse pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-200/50 rounded-full blur-[100px] animate-pulse pointer-events-none" delay-700 />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-100/40 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Explore Our Tools</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 mx-auto rounded-full mb-6" />
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">Precision agricultural tools designed to maximize your yield and simplify farm management.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <ActionCard
              title="Start Calculator"
              icon={<CalculatorIcon />}
              onClick={() => setPage("calculator")}
              colorClass="green"
            />
            <ActionCard
              title="Land Records"
              icon={<MapIcon />}
              onClick={() => setPage("bhulekh")}
              colorClass="blue"
            />
            <ActionCard
              title="Resources"
              icon={<FolderIcon />}
              onClick={() => setPage("resources")}
              colorClass="amber"
            />
            <ActionCard
              title="My Reports"
              icon={<DocumentIcon />}
              onClick={() => setPage("dashboard")}
              colorClass="purple"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
