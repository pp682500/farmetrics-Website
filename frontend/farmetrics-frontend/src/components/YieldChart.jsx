import { Bar } from "react-chartjs-2";
import "../charts/chartConfig";

function YieldChart({ area, totalYield }) {
  const data = {
    labels: ["Area (Acres)", "Total Yield"],
    datasets: [
      {
        label: "Yield Overview",
        data: [area, totalYield],
        backgroundColor: ["#86efac", "#22c55e"]
      }
    ]
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-bold text-green-700 mb-4">
        Yield Analysis
      </h3>
      <Bar data={data} />
    </div>
  );
}

export default YieldChart;
