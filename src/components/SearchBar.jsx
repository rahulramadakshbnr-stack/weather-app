import React, { useState } from "react";
import { Search, MapPin } from "lucide-react";

export const SearchBar = ({ onSearch, onLocation }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex relative items-center w-full max-w-md mx-auto mb-8">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a city..."
        className="w-full pl-5 pr-24 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-300 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all shadow-lg"
      />
      <div className="absolute right-2 flex items-center space-x-1">
        <button
          type="button"
          onClick={onLocation}
          className="p-2 text-white hover:text-blue-200 transition-colors"
          title="Use current location"
        >
          <MapPin size={20} />
        </button>
        <button
          type="submit"
          className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white transition-colors"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
};
