import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon, MapIcon, CalculatorIcon, DocumentIcon, UserGroupIcon } from "./Icons";

const slides = [
    {
        title: "AI-Powered Assistance",
        description: "Srishti, our AI chatbot, provides instant solutions to your farming queries. Get advice on crop diseases, weather, and more.",
        icon: <SparklesIcon />,
        color: "bg-green-600",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Verified Land Records",
        description: "Connect directly with official State Bhulekh portals. Verify your land boundaries, ownership details, and survey numbers without leaving the platform.",
        icon: <MapIcon />,
        color: "bg-blue-600",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Precision Calculation",
        description: "Calculate accurate profit and loss projections for Kharif, Rabi, and Zaid seasons. Our tool factors in irrigation, seeds, labor, and current market prices.",
        icon: <CalculatorIcon />,
        color: "bg-orange-600",
        image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Smart Reporting",
        description: "Download detailed PDF analysis of your farm's performance. Track history, compare seasons, and make data-driven decisions for future planting.",
        icon: <DocumentIcon />,
        color: "bg-purple-600",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Resource Ecosystem",
        description: "Access a central hub for latest government schemes, e-NAM market prices, and modern agricultural technology updates tailored for Indian farmers.",
        icon: <UserGroupIcon />,
        color: "bg-amber-600",
        image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1000"
    }
];

function InfoSlider() {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 3000);
        return () => clearInterval(timer);
    }, [isPaused]);

    const nextSlide = () => {
        setCurrent(current === slides.length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? slides.length - 1 : current - 1);
    };

    return (
        <div className="w-full bg-transparent py-16 px-4 md:px-8 overflow-hidden">
            <div className="max-w-7xl mx-auto relative">

                {/* Main Slider Container */}
                <div
                    className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-gray-100 min-h-[550px] md:min-h-[500px] cursor-grab active:cursor-grabbing"
                    onMouseDown={() => setIsPaused(true)}
                    onMouseUp={() => setIsPaused(false)}
                    onMouseLeave={() => setIsPaused(false)}
                >

                    {/* Progress Bar (Global for the card) */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 z-30">
                        <div
                            className="h-full bg-green-500 transition-all duration-[3000ms] linear"
                            key={current}
                            style={{ width: '100%' }}
                        />
                    </div>

                    {/* Sliding Track */}
                    <div
                        className="flex transition-transform duration-700 ease-in-out h-full"
                        style={{ transform: `translateX(-${current * 100}%)` }}
                    >
                        {slides.map((slide, index) => (
                            <div key={index} className="w-full flex-shrink-0 flex flex-col md:flex-row min-h-[500px]">
                                {/* Left Side: Content */}
                                <div className="flex-1 p-10 md:p-16 flex flex-col justify-center order-2 md:order-1 bg-white">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`p-4 rounded-2xl text-white shadow-lg ${slide.color}`}>
                                            {slide.icon}
                                        </div>
                                        <div className="h-1 w-12 bg-gray-200 rounded-full" />
                                    </div>

                                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                                        {slide.title}
                                    </h2>

                                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-10">
                                        {slide.description}
                                    </p>
                                </div>

                                {/* Right Side: Image */}
                                <div className="flex-1 relative overflow-hidden order-1 md:order-2 bg-gray-100 min-h-[300px] md:min-h-full">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${slide.image})` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent md:block hidden" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent md:hidden" />
                                    <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Controls (Absolute Positioned over the card) */}
                    <div className="absolute bottom-10 left-10 md:left-16 z-20 flex items-center gap-4 bg-white/80 backdrop-blur-sm p-2 rounded-full border border-gray-100 shadow-sm">
                        <button
                            onClick={prevSlide}
                            className="p-4 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white transition-all shadow-sm active:scale-90"
                        >
                            <ChevronLeftIcon />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="p-4 rounded-full bg-gray-900 text-white hover:bg-black transition-all shadow-lg active:scale-95"
                        >
                            <ChevronRightIcon />
                        </button>

                        <div className="flex gap-2 ml-4">
                            {slides.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-2 rounded-full transition-all duration-300 ${current === i ? 'w-8 bg-green-600' : 'w-2 bg-gray-300'}`}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default InfoSlider;
