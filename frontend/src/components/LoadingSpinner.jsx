import React from "react";

const LoadingSpinner = ({ fullPage = false, size = "md", text = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-12 h-12 border-4",
    lg: "w-16 h-16 border-4",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div
        className={`${sizeClasses[size]} border-sky-500 border-t-transparent rounded-full animate-spin`}
      />
      {text && <p className="text-slate-500 dark:text-slate-400 font-medium">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-slate-50/85 dark:bg-slate-950/85 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
