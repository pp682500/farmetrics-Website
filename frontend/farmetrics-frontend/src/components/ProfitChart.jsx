import { Bar } from "react-chartjs-2";
import "../charts/chartConfig";

function ProfitChart({ revenue, cost }) {
  const data = {
    labels: ["Revenue", "Cost"],
    datasets: [
      {
        label: "Profit / Loss",
        data: [revenue, cost],
        backgroundColor: ["#4ade80", "#f87171"]
      }
    ]
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-bold text-green-700 mb-4">
        Profit vs Cost
      </h3>
      <Bar data={data} />
    </div>
  );
}

export default ProfitChart;
