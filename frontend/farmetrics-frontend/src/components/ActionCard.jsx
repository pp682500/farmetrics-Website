function ActionCard({ title, icon: Icon, onClick, colorClass = "green" }) {
  const themes = {
    green: "bg-green-50 text-green-700 hover:bg-green-700 hover:text-white border-green-200",
    blue: "bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white border-blue-200",
    amber: "bg-amber-50 text-amber-700 hover:bg-amber-700 hover:text-white border-amber-200",
    purple: "bg-purple-50 text-purple-700 hover:bg-purple-700 hover:text-white border-purple-200",
  };

  const iconThemes = {
    green: "text-green-600 group-hover:text-white",
    blue: "text-blue-600 group-hover:text-white",
    amber: "text-amber-600 group-hover:text-white",
    purple: "text-purple-600 group-hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`group w-full p-8 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${themes[colorClass]}`}
    >
      <div className={`text-5xl mb-4 transition-colors duration-300 ${iconThemes[colorClass]}`}>
        {Icon}
      </div>
      <h3 className="font-bold text-lg md:text-xl tracking-tight">{title}</h3>
    </button>
  );
}

export default ActionCard;
