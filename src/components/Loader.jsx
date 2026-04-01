import React from "react";
import { Loader2 } from "lucide-react";

export const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 size={48} className="animate-spin text-blue-400 mb-4" />
      <p className="text-lg font-medium text-blue-100 animate-pulse">
        Fetching weather data...
      </p>
    </div>
  );
};

export const ErrorMessage = ({ message }) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex flex-col items-center justify-center text-center mt-4">
      <span className="text-3xl mb-2">🌧️</span>
      <h3 className="text-lg font-semibold text-red-100 mb-1">Oops!</h3>
      <p className="text-sm text-red-200 capitalize">{message}</p>
    </div>
  );
};
