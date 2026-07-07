import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { FaWallet } from "react-icons/fa";

const BudgetBreakdown = ({ estimate }) => {
  if (!estimate) return null;

  const data = [
    { name: "Hotel Cost", value: estimate.hotel_cost, color: "#0ea5e9" },
    { name: "Food Cost", value: estimate.food_cost, color: "#10b981" },
    { name: "Travel Cost", value: estimate.travel_cost, color: "#f59e0b" },
    { name: "Activity Cost", value: estimate.activity_cost, color: "#ec4899" },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-lg">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {payload[0].name}
          </p>
          <p className="text-sm font-bold text-slate-850 dark:text-white mt-1">
            ₹{payload[0].value.toLocaleString("en-IN")}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center md:space-x-6">
      <div className="flex-1 w-full">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
          <FaWallet className="mr-2 text-sky-500" /> Estimated Budget Breakdown
        </h3>
        
        <div className="space-y-3">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div 
                  className="w-3.5 h-3.5 rounded-full" 
                  style={{ backgroundColor: item.color }} 
                />
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-355">
                  {item.name}
                </span>
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-white">
                ₹{item.value.toLocaleString("en-IN")}
              </span>
            </div>
          ))}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex items-center justify-between font-bold text-slate-800 dark:text-white">
            <span>Total Estimated Cost</span>
            <span className="text-lg text-sky-500">
              ₹{estimate.total_cost.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full md:w-60 h-60 flex items-center justify-center mt-6 md:mt-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetBreakdown;
