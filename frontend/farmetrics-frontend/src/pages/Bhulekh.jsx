import { useState } from "react";
import { MapIcon } from "../components/Icons";

const STATE_DATA = [
    { name: "Andhra Pradesh", bhulekh: "http://meebhoomi.ap.gov.in/", revenue: "https://revenue.ap.gov.in/", label: "MeeBhoomi" },
    { name: "Assam", bhulekh: "https://revenueassam.nic.in/", revenue: "https://revenueassam.nic.in/", label: "Dharitree" },
    { name: "Bihar", bhulekh: "http://biharbhumi.bihar.gov.in/", revenue: "https://revenue.bihar.gov.in/", label: "Bihar Bhumi" },
    { name: "Chhattisgarh", bhulekh: "https://bhuiyan.cg.nic.in/", revenue: "https://revenue.cg.nic.in/", label: "Bhuiyan" },
    { name: "Delhi", bhulekh: "https://dlrc.delhi.gov.in/", revenue: "https://revenue.delhi.gov.in/", label: "Delhi Land Records" },
    { name: "Gujarat", bhulekh: "https://anyror.gujarat.gov.in/", revenue: "https://revenuedepartment.gujarat.gov.in/", label: "AnyROR" },
    { name: "Haryana", bhulekh: "https://jamabandi.nic.in/", revenue: "https://revenueharyana.gov.in/", label: "Jamabandi" },
    { name: "Himachal Pradesh", bhulekh: "https://himbhoomi.nic.in/", revenue: "https://himachal.nic.in/revenue", label: "Himbhoomi" },
    { name: "Jharkhand", bhulekh: "https://jharbhoomi.nic.in/", revenue: "https://revenue.jharkhand.gov.in/", label: "Jharbhoomi" },
    { name: "Karnataka", bhulekh: "https://landrecords.karnataka.gov.in/", revenue: "https://revenue.karnataka.gov.in/", label: "Bhoomi" },
    { name: "Kerala", bhulekh: "http://erekhale.kerala.gov.in/", revenue: "https://kerala.gov.in/revenue-department", label: "E-Rekha" },
    { name: "Madhya Pradesh", bhulekh: "https://mpbhulekh.gov.in/", revenue: "https://revenue.mp.gov.in/", label: "MP Bhulekh" },
    { name: "Maharashtra", bhulekh: "https://bhulekh.mahabhumi.gov.in/", revenue: "https://maharashtra.gov.in/", label: "Mahabhulekh" },
    { name: "Odisha", bhulekh: "http://bhulekh.ori.nic.in/", revenue: "https://revenue.odisha.gov.in/", label: "Bhulekh Odisha" },
    { name: "Punjab", bhulekh: "http://jamabandi.punjab.gov.in/", revenue: "https://revenue.punjab.gov.in/", label: "Jamabandi PLRS" },
    { name: "Rajasthan", bhulekh: "https://apnakhata.rajasthan.gov.in/", revenue: "https://bor.rajasthan.gov.in/", label: "Apna Khata" },
    { name: "Tamil Nadu", bhulekh: "https://eservices.tn.gov.in/", revenue: "https://revenue.tn.gov.in/", label: "Patta Chitta" },
    { name: "Telangana", bhulekh: "https://dharani.telangana.gov.in/", revenue: "https://revenue.telangana.gov.in/", label: "Dharani" },
    { name: "Uttar Pradesh", bhulekh: "https://upbhulekh.gov.in/", revenue: "https://bor.up.nic.in/", label: "UP Bhulekh" },
    { name: "Uttarakhand", bhulekh: "https://bhulekh.uk.gov.in/", revenue: "https://revenue.uk.gov.in/", label: "Bhulekh UK" },
    { name: "West Bengal", bhulekh: "https://banglarbhumi.gov.in/", revenue: "https://revenue.wb.gov.in/", label: "Banglarbhumi" },
];

function Bhulekh({ setPage }) {
    const [selectedState, setSelectedState] = useState("");
    const [hectares, setHectares] = useState("");
    const [convertedAcres, setConvertedAcres] = useState(null);

    const handleStateChange = (e) => setSelectedState(e.target.value);
    const selectedData = STATE_DATA.find((s) => s.name === selectedState);

    const convertToAcres = () => {
        if (!hectares) return;
        const acres = parseFloat(hectares) * 2.47105;
        setConvertedAcres(acres.toFixed(3));
    };

    return (
        <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black text-gray-900 mb-4 flex items-center justify-center gap-4">
                        <span className="text-green-600 bg-green-100 p-3 rounded-2xl shadow-sm">
                            <MapIcon size={40} />
                        </span>
                        Verified Land Records
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
                        Access official Bhulekh portals and Board of Revenue records across all Indian states.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT PANEL: Selector & Portal Links */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl border border-white/50">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="text-blue-600">📍</span>
                                Select Your Location
                            </h2>

                            <div className="relative mb-10">
                                <select
                                    value={selectedState}
                                    onChange={handleStateChange}
                                    className="w-full h-16 pl-6 pr-12 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-green-600 outline-none transition-all font-bold text-lg appearance-none shadow-sm"
                                >
                                    <option value="">Choose a State...</option>
                                    {STATE_DATA.map((state) => (
                                        <option key={state.name} value={state.name}>
                                            {state.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    ▼
                                </div>
                            </div>

                            {selectedData ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                                    {/* Bhulekh Section */}
                                    <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-[2rem] border border-green-100 shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex items-center gap-3 mb-4 text-green-700">
                                            <span className="p-2 bg-green-100 rounded-lg group-hover:scale-110 transition-transform">📜</span>
                                            <span className="text-sm font-black uppercase tracking-widest">Bhulekh Portal</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-2">{selectedData.label}</h3>
                                        <p className="text-gray-500 mb-6 font-medium text-sm leading-relaxed">
                                            Download Khatauni (ROR), check Khasra numbers and verify land ownership maps.
                                        </p>
                                        <a
                                            href={selectedData.bhulekh}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-green-900 text-white px-6 py-4 rounded-2xl font-black hover:bg-black transition transform active:scale-95 shadow-lg w-full justify-center"
                                        >
                                            OPEN BHULEKH ↗
                                        </a>
                                    </div>

                                    {/* Revenue Board Section */}
                                    <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-[2rem] border border-blue-100 shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex items-center gap-3 mb-4 text-blue-700">
                                            <span className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">🏛️</span>
                                            <span className="text-sm font-black uppercase tracking-widest">Revenue Board</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-2">राजस्व परिषद</h3>
                                        <p className="text-gray-500 mb-6 font-medium text-sm leading-relaxed">
                                            Access revenue court cases, management systems and official departmental orders.
                                        </p>
                                        <a
                                            href={selectedData.revenue}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-blue-900 text-white px-6 py-4 rounded-2xl font-black hover:bg-black transition transform active:scale-95 shadow-lg w-full justify-center"
                                        >
                                            OPEN REVENUE ↗
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                                    <p className="text-gray-400 font-bold text-lg">
                                        Select a state above to view official links
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Quick State Grid (All States) */}
                        <div className="bg-white/40 p-1 rounded-[2.5rem]">
                            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-xl border border-white/50">
                                <h3 className="text-xl font-black text-gray-900 mb-6">Directory of Available States</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {STATE_DATA.map((state) => (
                                        <button
                                            key={state.name}
                                            onClick={() => setSelectedState(state.name)}
                                            className={`p-3 rounded-xl text-sm font-bold transition-all border ${selectedState === state.name ? 'bg-green-600 text-white border-green-600 shadow-lg' : 'bg-white text-gray-600 border-gray-100 hover:border-green-400 hover:text-green-700'}`}
                                        >
                                            {state.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Area Converter & Info */}
                    <div className="space-y-8">
                        {/* Converter */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-white/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <MapIcon size={80} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-6">Area Converter</h2>
                            <p className="text-gray-500 mb-8 font-medium">
                                Convert official land units (Hectares) to Acreage for the Farmetrics Calculator.
                            </p>

                            <div className="space-y-6">
                                <div className="group">
                                    <label className="block text-sm font-black text-gray-400 mb-2 ml-1">HECTARES</label>
                                    <input
                                        type="number"
                                        value={hectares}
                                        onChange={(e) => setHectares(e.target.value)}
                                        placeholder="e.g. 1.25"
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-green-600 outline-none transition-all font-black text-xl"
                                    />
                                </div>
                                <button
                                    onClick={convertToAcres}
                                    className="w-full py-5 rounded-2xl bg-green-600 hover:bg-black text-white font-black text-lg shadow-xl transition-all active:scale-95"
                                >
                                    CONVERT TO ACRES
                                </button>

                                {convertedAcres && (
                                    <div className="p-6 bg-green-50 rounded-2xl border-2 border-green-100 animate-in zoom-in-95 duration-300">
                                        <div className="text-center">
                                            <span className="block text-xs font-black text-green-600 mb-1 uppercase tracking-widest">Calculated Area</span>
                                            <span className="text-3xl font-black text-green-900">{convertedAcres} <span className="text-lg">Acres</span></span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Next Actions */}
                        <div className="bg-green-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
                            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
                            <h2 className="text-2xl font-black mb-4">Start Calculating</h2>
                            <p className="opacity-80 mb-8 font-medium leading-relaxed">
                                Use your verified land area from Bhulekh to calculate precise yield and profit projections.
                            </p>
                            <button
                                onClick={() => setPage("calculator")}
                                className="w-full py-5 bg-white text-green-900 font-black rounded-2xl shadow-xl hover:bg-green-50 transition-colors active:scale-95"
                            >
                                OPEN CALCULATOR →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Back Button */}
                <div className="mt-16 text-center">
                    <button
                        onClick={() => setPage("home")}
                        className="px-8 py-3 rounded-full bg-gray-200 text-gray-700 font-black hover:bg-gray-900 hover:text-white transition-all active:scale-95 shadow-sm"
                    >
                        ← BACK TO HOME
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Bhulekh;
