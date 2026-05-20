import React from "react";

const StatsCard = ({ title, value, icon: Icon, colorClass = "from-pink-500/10 to-purple-500/10" }) => {
  return (
    <div className={`relative overflow-hidden group p-6 rounded-[2rem] bg-[#1b0a24]/40 border border-white/5 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-pink-500/30`}>
      <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${colorClass} blur-3xl group-hover:scale-150 transition-transform duration-700`} />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">
            {title}
          </h3>
          <p className="text-3xl font-black text-white tracking-tighter">
            {value}
          </p>
        </div>

        {Icon && (
          <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-pink-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="w-1 h-1 rounded-full bg-pink-500 animate-pulse" />
        <span className="text-[9px] font-bold text-pink-500/60 uppercase tracking-widest italic">Live Analytics</span>
      </div>
    </div>
  );
};

export default StatsCard;
