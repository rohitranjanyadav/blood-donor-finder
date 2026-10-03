import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { navLinks } from "./landingData";

export default function LandingHeader({ menuOpen, onToggleMenu, onCloseMenu }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <img src="/assets/brand/logo-mark.svg" alt="JeevanRakta" className="w-6 h-6" />
            </span>
            <span className="font-bold text-lg tracking-tight text-gray-900">JeevanRakta</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(([label, href]) => (
              <a key={label} href={href} className="text-[15px] font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                {label}
              </a>
            ))}
            <Link to="/map" className="text-[15px] font-semibold text-gray-600 hover:text-gray-900 transition-colors">Live Map</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2">Sign in</Link>
            <Link to="/register/donor" className="text-sm font-semibold bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors no-underline">Register</Link>
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={onToggleMenu} aria-label="Toggle menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {navLinks.map(([label, href]) => (
            <a key={label} href={href} onClick={onCloseMenu} className="block text-sm text-gray-700 py-2.5 border-b border-gray-50 last:border-0">{label}</a>
          ))}
          <Link
            to="/map"
            onClick={onCloseMenu}
            className="block text-sm text-gray-700 py-2.5 border-b border-gray-50 no-underline"
          >
            Live Map
          </Link>
          <div className="flex gap-2 pt-3">
            <Link to="/login" onClick={onCloseMenu} className="flex-1 border border-gray-200 text-sm font-medium py-2.5 rounded-xl text-center no-underline text-gray-700">Sign in</Link>
            <Link to="/register/donor" onClick={onCloseMenu} className="flex-1 bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl text-center no-underline">Register</Link>
          </div>
        </div>
      )}
    </header>
  );
}
