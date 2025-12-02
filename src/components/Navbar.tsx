import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full backdrop-blur-xl bg-gray-900/40 border-b border-cyan-500/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse shadow-cyan-500 group-hover:shadow-lg group-hover:shadow-cyan-500 transition-all"></div>
          <h1 className="text-xl font-bold tracking-wide text-cyan-300 group-hover:text-cyan-400 transition-all">
            CyberIntel Suite
          </h1>
        </div>

        {/* NAV LINKS */}
        <div className="hidden md:flex gap-8 text-gray-300 font-medium">
          <a
            href="#"
            className="hover:text-cyan-300 transition-all duration-200 hover:scale-105"
          >
            Home
          </a>
          <a
            href="#"
            className="hover:text-cyan-300 transition-all duration-200 hover:scale-105"
          >
            Validator
          </a>
          <a
            href="#"
            className="hover:text-cyan-300 transition-all duration-200 hover:scale-105"
          >
            AI Analysis
          </a>
          <a
            href="#"
            className="hover:text-cyan-300 transition-all duration-200 hover:scale-105"
          >
            Docs
          </a>
        </div>

        {/* CTA BUTTON */}
        <button
          className="px-4 py-2 bg-cyan-500 text-black font-semibold rounded-lg shadow-cyan-500/50 
                     shadow-md hover:shadow-lg hover:shadow-cyan-500 hover:bg-cyan-400 
                     transition-all duration-300 hover:scale-105"
        >
          Launch App
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
