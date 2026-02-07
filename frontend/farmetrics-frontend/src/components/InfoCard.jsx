function InfoCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <h3 className="text-lg font-bold text-green-800 mb-4">
        {title}
      </h3>
      <div className="text-gray-700">
        {children}
      </div>
    </div>
  );
}

export default InfoCard;
  