import { useState, useEffect } from "react";
import InfoCard from "../components/InfoCard";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { CalculatorIcon, FolderIcon } from "../components/Icons";
import { supabase } from "../supabaseClient";

function Dashboard({ calculationResult, user }) {
  const shareReport = async () => {
    if (!user) {
      alert("Please login to share/save reports.");
      return;
    }
    if (!calculationResult) return;

    const { error } = await supabase.from("reports").insert({
      user_id: user.id,
      title: `Report - ${new Date().toLocaleString()}`,
      report_data: calculationResult,
    });

    if (error) {
      alert("Error saving report: " + error.message);
    } else {
      alert("Report saved successfully! You can view it in your history.");
    }
  };

  const downloadPDF = () => {
    if (!calculationResult) return;

    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(21, 128, 61); // Green color
    doc.text("Farmetrics Report", 14, 22);

    // Subtitle / Date
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    // Section: Summary
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Financial Summary", 14, 45);

    const summaryData = [
      ["Total Yield", `${calculationResult.totalYield?.toFixed(2) || 0} units`],
      ["Total Revenue", `Rs. ${calculationResult.revenue?.toFixed(2) || 0}`],
      ["Total Profit/Loss", `Rs. ${calculationResult.profit?.toFixed(2) || 0}`]
    ];

    doc.autoTable({
      startY: 50,
      head: [["Metric", "Value"]],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [22, 163, 74] }, // Green-600
    });

    // Section: Expense Breakdown
    // We need to access expenses, if they are part of calculationResult structure.
    // Assuming calculationResult might have 'expenses' or inputs used to calculate.
    // Use fallback if detailed breakdown isn't passed yet.

    // For now, let's just save the file.
    doc.save(`Farmetrics_Report_${Date.now()}.pdf`);
  };

  const [savedReports, setSavedReports] = useState([]);

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setSavedReports(data);
  };
  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!calculationResult || calculationResult.totalYield === null ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <InfoCard title="Dashboard">
              <div className="text-center py-8">
                <div className="text-6xl mb-4 text-green-600 animate-bounce">
                  <CalculatorIcon />
                </div>
                <p className="text-xl text-gray-600 font-medium">
                  No calculation performed yet
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Use the Calculator to perform calculations and view results here
                </p>
              </div>
            </InfoCard>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <InfoCard title="Summary">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-lg text-gray-700">Total Yield:</span>
                    <span className="text-lg font-bold text-gray-800">
                      {calculationResult.totalYield.toFixed(2)} units
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-lg text-gray-700">Revenue:</span>
                    <span className="text-lg font-bold text-gray-800">
                      ₹{calculationResult.revenue.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-lg text-gray-700">
                      {calculationResult.profit >= 0 ? "Profit:" : "Loss:"}
                    </span>
                    <span className={`text-lg font-bold ${calculationResult.profit >= 0 ? "text-green-700" : "text-red-700"
                      }`}>
                      ₹{Math.abs(calculationResult.profit).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </InfoCard>

              <InfoCard title="Breakdown of Emissions and Sequestration">
                <div className="h-80 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500">
                  <div className="text-center group cursor-pointer">
                    <div className="text-5xl mb-2 text-green-500 group-hover:scale-110 transition-transform">
                      <CalculatorIcon />
                    </div>
                    <p className="text-sm font-medium group-hover:text-green-600 transition-colors">Visual analysis will appear here</p>
                  </div>
                </div>
              </InfoCard>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <InfoCard title="Report Actions">
                <div className="space-y-3">
                  <button className="w-full bg-green-700 hover:bg-green-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm">
                    Edit Data
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={shareReport}
                    className="w-full bg-green-100 hover:bg-green-200 text-green-900 font-medium py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm"
                  >
                    Share Report (Save)
                  </button>
                </div>
              </InfoCard>

              <InfoCard title="Net Result">
                <div className="pt-2">
                  <p className={`text-5xl font-bold mb-2 ${calculationResult.profit >= 0 ? "text-green-700" : "text-red-700"
                    }`}>
                    {calculationResult.profit >= 0 ? "+" : "-"}
                    {Math.abs(calculationResult.profit).toLocaleString("en-IN", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">
                    INR {calculationResult.profit >= 0 ? "profit" : "loss"}
                  </p>
                </div>
              </InfoCard>
            </div>
          </div>
        )}

        {/* SAVED REPORTS HISTORY SECTION */}
        <div className="mt-12 border-t border-green-200 pt-8">
          <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
            <span className="text-green-600"><FolderIcon /></span>
            Saved Reports History
          </h2>

          {!user ? (
            <p className="text-gray-500 italic">Please login to view your saved reports.</p>
          ) : savedReports.length === 0 ? (
            <p className="text-gray-500 italic">No saved reports found. Calculate and click "Share Report (Save)" to add one.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedReports.map((report) => (
                <div key={report.id} className="bg-white p-5 rounded-xl shadow border border-green-100 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-green-900 line-clamp-1">{report.title}</h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(report.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="text-sm space-y-1 text-gray-600">
                    <p>Profit: <span className={report.report_data.profit >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>₹{report.report_data.profit}</span></p>
                    <p>Revenue: ₹{report.report_data.revenue}</p>
                    <p>Yield: {report.report_data.totalYield}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
