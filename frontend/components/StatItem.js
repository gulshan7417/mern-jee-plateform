const StatItem = ({ number, label }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-3xl font-bold text-blue-900">{number}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
  
  export default StatItem;
  