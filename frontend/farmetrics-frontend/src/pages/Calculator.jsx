import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { CalculatorIcon, CalendarIcon, Square3Stack3DIcon, CurrencyRupeeIcon, SparklesIcon } from "../components/Icons";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Calculator({ setCalculationResult }) {
  const [season, setSeason] = useState("Kharif");
  const [area, setArea] = useState("");
  const [yieldPerAcre, setYieldPerAcre] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [costPerAcre, setCostPerAcre] = useState("");
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const defaults = {
      Kharif: { yield: 20, cost: 15000 },
      Rabi: { yield: 25, cost: 18000 },
      Zaid: { yield: 15, cost: 12000 },
    };
    setYieldPerAcre(defaults[season].yield);
    setCostPerAcre(defaults[season].cost);
  }, [season]);

  const calculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const totalYield = parseFloat(area || 0) * parseFloat(yieldPerAcre || 0);
      const revenue = totalYield * parseFloat(pricePerUnit || 0);
      const cost = parseFloat(area || 0) * parseFloat(costPerAcre || 0);
      const profit = revenue - cost;

      const data = { totalYield, revenue, cost, profit };
      setResult(data);
      setCalculationResult?.(data);
      setIsCalculating(false);
    }, 600);
  };

  const seasonThemes = {
    Kharif: "from-orange-500 to-amber-600 bg-orange-50",
    Rabi: "from-green-600 to-emerald-700 bg-green-50",
    Zaid: "from-blue-500 to-sky-600 bg-blue-50",
  };

  const yieldChartData = result && {
    labels: ["Target Area", "Est. Total Yield"],
    datasets: [
      {
        label: "Yield Progress",
        data: [area, result.totalYield],
        backgroundColor: ["#10b981", "#059669"],
        borderRadius: 8,
      },
    ],
  };

  const profitChartData = result && {
    labels: ["Projected Revenue", "Total Cost"],
    datasets: [
      {
        label: "Financial Overview (₹)",
        data: [result.revenue, result.cost],
        backgroundColor: ["#10b981", "#ef4444"],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className={`p-8 md:p-12 bg-gradient-to-r text-white ${seasonThemes[season].split(' bg-')[0]}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 mb-2">
                  <span className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <CalculatorIcon />
                  </span>
                  Farmetrics Calculator
                </h1>
                <p className="text-white/80 font-medium">Precision tools for modern agriculture</p>
              </div>
              <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
                {["Kharif", "Rabi", "Zaid"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeason(s)}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${season === s ? "bg-white text-gray-900 shadow-lg scale-100" : "hover:bg-white/10 text-white scale-95"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-6">
                  <InputGroup
                    label="Cultivation Area"
                    icon={<Square3Stack3DIcon />}
                    placeholder="Acres"
                    value={area}
                    onChange={setArea}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup
                      label="Yield / Acre"
                      icon={<SparklesIcon />}
                      placeholder="Units"
                      value={yieldPerAcre}
                      onChange={setYieldPerAcre}
                    />
                    <InputGroup
                      label="Price / Unit"
                      icon={<CurrencyRupeeIcon />}
                      placeholder="₹"
                      value={pricePerUnit}
                      onChange={setPricePerUnit}
                    />
                  </div>
                  <InputGroup
                    label="Current Cost per Acre"
                    icon={<CalendarIcon />}
                    placeholder="₹"
                    value={costPerAcre}
                    onChange={setCostPerAcre}
                  />
                </div>

                <button
                  onClick={calculate}
                  disabled={isCalculating}
                  className={`w-full py-5 rounded-2xl font-black text-xl tracking-wide transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${isCalculating
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-gray-900 hover:bg-black text-white hover:shadow-2xl"
                    }`}
                >
                  {isCalculating ? (
                    <div className="h-6 w-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "PRODUCE REPORT"
                  )}
                </button>
              </div>

              <div className="lg:col-span-7">
                {result ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <ResultCard title="Total Yield" value={`${result.totalYield.toFixed(1)}`} unit="Units" color="emerald" />
                      <ResultCard title="Gross Revenue" value={`₹${result.revenue.toLocaleString()}`} unit="Total" color="blue" />
                      <ResultCard
                        title="Net Outcome"
                        value={`₹${Math.abs(result.profit).toLocaleString()}`}
                        unit={result.profit >= 0 ? "Profit" : "Loss"}
                        color={result.profit >= 0 ? "indigo" : "rose"}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span className="text-emerald-600"><SparklesIcon /></span> Yield Analysis
                        </h3>
                        <Bar data={yieldChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                      </div>
                      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span className="text-rose-600"><CurrencyRupeeIcon /></span> Profit vs Cost
                        </h3>
                        <Bar data={profitChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[400px] border-4 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-gray-300 p-12 text-center group">
                    <div className="bg-gray-50 p-8 rounded-full mb-6 group-hover:scale-110 group-hover:bg-green-50 transition-all duration-500">
                      <CalculatorIcon />
                    </div>
                    <h3 className="text-2xl font-black text-gray-400 mb-2">Ready to Calculate</h3>
                    <p className="max-w-xs text-gray-400">Enter your details on the left to generate your live agricultural performance report.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, icon, value, onChange, placeholder }) {
  return (
    <div className="group">
      <label className="block text-sm font-bold text-gray-500 mb-2 ml-1 group-focus-within:text-gray-900 transition-colors">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors w-6 h-6">
          {icon}
        </div>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-gray-900 outline-none transition-all font-bold text-lg"
        />
      </div>
    </div>
  );
}

function ResultCard({ title, value, unit, color }) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <div className={`p-6 rounded-3xl border-2 transition-transform hover:scale-105 ${colors[color]}`}>
      <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">{title}</p>
      <p className="text-2xl font-black mb-1">{value}</p>
      <p className="text-xs font-bold opacity-80">{unit}</p>
    </div>
  );
}

export default Calculator;
