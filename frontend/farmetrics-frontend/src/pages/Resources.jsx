import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { BuildingLibraryIcon, SparklesIcon, CurrencyRupeeIcon } from "../components/Icons";

function Resources({ setPage }) {
    const [dynamicSchemes, setDynamicSchemes] = useState([]);

    useEffect(() => {
        fetchSchemes();
    }, []);

    const fetchSchemes = async () => {
        const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
        if (data) setDynamicSchemes(data);
    };

    const resourceCategories = [
        {
            title: "Government Schemes",
            icon: <BuildingLibraryIcon />,
            color: "bg-blue-600",
            hoverColor: "hover:bg-blue-700",
            items: [
                {
                    name: "PM-KISAN",
                    desc: "Income support of ₹6,000 per year.",
                    link: "https://pmkisan.gov.in/",
                },
                {
                    name: "Soil Health Card",
                    desc: "Check soil nutrient status.",
                    link: "https://soilhealth.dac.gov.in/",
                },
                {
                    name: "Kisan Credit Card (KCC)",
                    desc: "Affordable credit for farmers.",
                    link: "https://myscheme.gov.in/schemes/kcc",
                },
            ],
        },
        {
            title: "Crops & Farming",
            icon: <SparklesIcon />,
            color: "bg-green-600",
            hoverColor: "hover:bg-green-700",
            items: [
                {
                    name: "Farming Tech (ICAR)",
                    desc: "Latest agricultural technologies.",
                    link: "https://icar.org.in/",
                },
                {
                    name: "Organic Farming",
                    desc: "Guide to chemical-free farming.",
                    link: "https://agri.up.nic.in/",
                },
                {
                    name: "Weather Forecast",
                    desc: "IMD Weather updates.",
                    link: "https://mausam.imd.gov.in/",
                },
            ],
        },
        {
            title: "Market & Prices (Mandi)",
            icon: <CurrencyRupeeIcon />,
            color: "bg-amber-600",
            hoverColor: "hover:bg-amber-700",
            items: [
                {
                    name: "eNAM Market",
                    desc: "Real-time commodity prices.",
                    link: "https://enam.gov.in/web/",
                },
                {
                    name: "Agmarknet",
                    desc: "Daily mandi price updates.",
                    link: "https://agmarknet.gov.in/",
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">
                    Farmer Resources 📚
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resourceCategories.map((category) => (
                        <div
                            key={category.title}
                            className="group bg-white rounded-xl shadow-lg overflow-hidden border border-green-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className={`${category.color} ${category.hoverColor} p-5 flex items-center gap-4 transition-colors duration-300`}>
                                <div className="text-white group-hover:scale-110 transition-transform duration-300">
                                    {category.icon}
                                </div>
                                <h2 className="text-xl font-bold text-white">
                                    {category.title}
                                </h2>
                            </div>
                            <div className="p-4 space-y-4">
                                {category.items.map((item) => (
                                    <div key={item.name} className="group">
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                                        >
                                            <h3 className="font-semibold text-green-900 group-hover:text-green-700 flex justify-between items-center">
                                                {item.name}
                                                <span className="text-green-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                    ↗
                                                </span>
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* DYNAMIC SECTION */}
                <div className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-green-800">🚀 New Schemes & Community Updates</h2>
                    </div>

                    {dynamicSchemes.length === 0 ? (
                        <p className="text-gray-500 italic">No new updates yet. Be the first to add one!</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {dynamicSchemes.map((scheme) => (
                                <div key={scheme.id} className="bg-white p-5 rounded-xl shadow border border-green-100 hover:shadow-md transition">
                                    <h3 className="font-bold text-lg text-green-900 mb-2">{scheme.title}</h3>
                                    <p className="text-gray-600 text-sm mb-3">{scheme.description}</p>
                                    <a
                                        href={scheme.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-700 hover:text-green-900 font-medium text-sm flex items-center gap-1"
                                    >
                                        Visit Link ↗
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>



                <div className="mt-12 text-center">
                    <button
                        onClick={() => setPage("home")}
                        className="bg-white border border-green-600 text-green-700 font-medium py-2 px-6 rounded-lg hover:bg-green-50 transition"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Resources;
