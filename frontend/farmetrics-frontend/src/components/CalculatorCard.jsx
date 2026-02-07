import { useState } from "react";
import YieldChart from "./YieldChart";
import ProfitChart from "./ProfitChart";



function CalculatorCard() {
  const [form, setForm] = useState({
    crop: "",
    season: "Kharif",
    area: "",
    yieldPerAcre: "",
    cost: "",
    price: ""
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculate = () => {
    const area = Number(form.area);
    const yieldPerAcre = Number(form.yieldPerAcre);
    const cost = Number(form.cost);
    const price = Number(form.price);

    if (!area || !yieldPerAcre || !cost || !price) {
      alert("Please fill all numeric fields");
      return;
    }

    const totalYield = area * yieldPerAcre;
    const revenue = totalYield * price;
    const profit = revenue - cost;

    setResult({
      totalYield,
      revenue,
      profit
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
      <h3 className="text-2xl font-bold text-green-700 mb-6">
        Crop Calculator
      </h3>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="crop"
          placeholder="Crop Name"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <select
          name="season"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        >
          <option>Kharif</option>
          <option>Rabi</option>
          <option>Zaid</option>
        </select>

        <input
          name="area"
          placeholder="Area (acres)"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          name="yieldPerAcre"
          placeholder="Yield per Acre"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          name="cost"
          placeholder="Total Cost (₹)"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          name="price"
          placeholder="Selling Price per Unit (₹)"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
      </div>

      {/* BUTTON */}
      <button
        onClick={calculate}
        className="mt-6 w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800"
      >
        Calculate
      </button>

      {/* RESULT */}
      {result && (
  <>
    <div className="mt-6 bg-green-50 p-5 rounded-lg">
      <p><strong>Total Yield:</strong> {result.totalYield}</p>
      <p><strong>Revenue:</strong> ₹{result.revenue}</p>

      <p
        className={`mt-2 font-bold ${
          result.profit >= 0 ? "text-green-700" : "text-red-600"
        }`}
      >
        {result.profit >= 0
          ? `Profit: ₹${result.profit}`
          : `Loss: ₹${Math.abs(result.profit)}`}
      </p>
    </div>

    {/* CHARTS */}
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <YieldChart
        area={Number(form.area)}
        totalYield={result.totalYield}
      />

      <ProfitChart
        revenue={result.revenue}
        cost={Number(form.cost)}
      />
    </div>
  </>
)}

    </div>
  );
}

export default CalculatorCard;
