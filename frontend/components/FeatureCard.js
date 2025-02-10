const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white text-white p-6 rounded-lg shadow-md">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
  
  export default FeatureCard;
  