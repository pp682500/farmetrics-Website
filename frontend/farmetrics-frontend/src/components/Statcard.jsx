function StatCard({ title, value, icon }) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <p className="text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-green-700">{value}</h3>
        </div>
      </div>
    );
  }
  
  export default StatCard;
  