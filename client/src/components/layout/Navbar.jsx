import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Map, Menu, Settings, User, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const isActive = (path) => location.pathname === path;
  const closeMenu = () => setMenuOpen(false);

  const linkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors no-underline ${
      isActive(path)
        ? "bg-red-50 text-red-700"
        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
    }`;

  return (
    <nav
      className="bg-white/95 backdrop-blur-sm border-b border-gray-100
                 px-4 sm:px-6 lg:px-8 h-16 flex items-center
                 justify-between sticky top-0 z-50"
    >
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 text-gray-900
                   no-underline font-bold text-lg hover:opacity-90"
      >
        <span className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
          <img
            src="/assets/brand/logo-mark.svg"
            alt="JeevanRakta"
            className="w-6 h-6"
          />
        </span>
        <span className="tracking-wide">JeevanRakta</span>
      </Link>

      {/* Right side links */}
      <div className="hidden md:flex items-center gap-1 sm:gap-2">
        <Link to="/map" className={linkClass("/map")}>
          <span className="flex items-center gap-1.5">
            <Map size={15} /> Live Map
          </span>
        </Link>

        {/* Guest */}
        {!user && (
          <>
            <Link to="/login" className={linkClass("/login")}>
              Login
            </Link>
            <Link
              to="/register/donor"
              className="bg-red-600 hover:bg-red-700 text-white
                         px-4 py-2 rounded-lg text-sm font-semibold
                         no-underline transition-colors"
            >
              Register as Donor
            </Link>
          </>
        )}

        {/* Donor */}
        {user?.role === "donor" && (
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>
        )}

        {/* Patient / Hospital */}
        {(user?.role === "patient" || user?.role === "hospital") && (
          <Link to="/requests/new" className={linkClass("/requests/new")}>
            + Post Request
          </Link>
        )}

        {/* Admin */}
        {user?.role === "admin" && (
          <Link to="/admin" className={linkClass("/admin")}>
            <span className="flex items-center gap-1.5">
              <Settings size={15} /> Admin
            </span>
          </Link>
        )}

        {/* Logged in user */}
        {user && (
          <div className="flex items-center gap-3 ml-2">
            <div
              className="flex items-center gap-2 bg-gray-50 border border-gray-100
                         text-gray-700 px-3 py-1.5 rounded-lg text-sm"
            >
              <User size={14} className="text-gray-400" />
              <span>{user.full_name?.split(" ")[0] || user.username}</span>
              {user.blood_group && (
                <span
                  className="bg-red-600 text-white text-xs
                                  font-bold px-2 py-0.5 rounded"
                >
                  {user.blood_group}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-gray-500 hover:text-red-700 border
                         border-gray-200 hover:border-red-200
                         px-3 py-1.5 rounded-lg text-sm
                         cursor-pointer transition-colors bg-white"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50"
        aria-label="Toggle navigation menu"
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {menuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white border-b border-gray-100 shadow-lg p-3 space-y-1">
          <Link to="/map" onClick={closeMenu} className={`${linkClass("/map")} flex items-center gap-2`}><Map size={15} /> Live Map</Link>
          {!user && <>
            <Link to="/login" onClick={closeMenu} className={linkClass("/login")}>Login</Link>
            <Link to="/register/donor" onClick={closeMenu} className="block bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold no-underline">Register as Donor</Link>
          </>}
          {user?.role === "donor" && <Link to="/dashboard" onClick={closeMenu} className={linkClass("/dashboard")}>Dashboard</Link>}
          {(user?.role === "patient" || user?.role === "hospital") && <Link to="/requests/new" onClick={closeMenu} className={linkClass("/requests/new")}>+ Post Request</Link>}
          {user?.role === "admin" && <Link to="/admin" onClick={closeMenu} className={linkClass("/admin")}>Admin</Link>}
          {user && <button onClick={() => { closeMenu(); handleLogout(); }} className="w-full text-left flex items-center gap-2 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50"><LogOut size={15} /> Logout</button>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
