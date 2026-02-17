import React from "react";

const StatsCard = ({ title, value }) => {
  return (
    <div
      className="p-6 rounded-2xl bg-[#1b0a24] 
      border border-pink-700/40 
      shadow-lg shadow-pink-900/20 
      transition transform hover:scale-[1.03] hover:shadow-pink-700/40"
    >
      <h3 className="text-lg font-semibold text-pink-300">
        {title}
      </h3>

      <p className="mt-2 text-3xl font-bold text-white drop-shadow">
        {value}
      </p>
    </div>
  );
};

export default StatsCard;
