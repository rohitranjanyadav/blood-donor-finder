import { useState } from "react";
import {
  Droplets,
  Bell,
  ChevronDown,
  Menu,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar({
  role,
  roleColor,
  navItems,
  activeTab,
  onTabChange,
  onClose,
  onLogout,
}) {
  return (
    <div
      className="flex flex-col h-full"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100">
        <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
          <Droplets size={14} className="text-white" />
        </div>
        <span className="font-bold text-gray-900">JeevanRakta</span>
      </div>
      <div className="px-4 py-3.5 border-b border-gray-100">
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full capitalize tracking-wide ${roleColor}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
          {role}
        </span>
      </div>
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? "bg-red-50 text-red-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={
                      activeTab === item.id ? "text-red-600" : "text-gray-400"
                    }
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </div>
                {item.badge > 0 && (
                  <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded-full min-w-4.5 text-center leading-none">
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  role,
  roleColor,
  navItems,
  activeTab,
  onTabChange,
  children,
  userDetail,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const userName =
    user?.full_name || user?.hospital_name || user?.username || "User";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      className="h-screen flex bg-gray-50 overflow-hidden"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-56 bg-white
                        border-r border-gray-100 shrink-0"
      >
        <Sidebar
          role={role}
          roleColor={roleColor}
          navItems={navItems}
          activeTab={activeTab}
          onTabChange={onTabChange}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/25 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-56 bg-white h-full shadow-2xl">
            <Sidebar
              role={role}
              roleColor={roleColor}
              navItems={navItems}
              activeTab={activeTab}
              onTabChange={onTabChange}
              onClose={() => setSidebarOpen(false)}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header
          className="bg-white border-b border-gray-100 px-4 lg:px-6
                           py-3 flex items-center justify-between shrink-0"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={17} />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-gray-900">
                {navItems.find((n) => n.id === activeTab)?.label || "Dashboard"}
              </h1>
              {userDetail && (
                <p className="text-[11px] text-gray-400 mt-0.5">{userDetail}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setProfileOpen(false);
                }}
                className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Bell size={17} className="text-gray-500" />
                <span
                  className="absolute top-1.5 right-1.5 w-1.5 h-1.5
                                  bg-red-500 rounded-full"
                />
              </button>
              {notifOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-72 bg-white
                                rounded-2xl shadow-2xl border border-gray-100
                                z-50 overflow-hidden"
                >
                  <div
                    className="px-4 py-3 border-b border-gray-100
                                  flex items-center justify-between"
                  >
                    <span className="text-sm font-semibold text-gray-900">
                      Notifications
                    </span>
                    <button className="text-xs text-red-600 font-medium">
                      Mark all read
                    </button>
                  </div>
                  <div className="px-4 py-8 text-center text-sm text-gray-400">
                    No new notifications
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5
                           rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div
                  className="w-7 h-7 bg-red-100 rounded-full flex items-center
                                justify-center text-[11px] font-bold text-red-700"
                >
                  {initials}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {userName.split(" ")[0]}
                </span>
                <ChevronDown size={13} className="text-gray-400" />
              </button>
              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-44 bg-white
                                rounded-2xl shadow-2xl border border-gray-100
                                z-50 py-1.5"
                >
                  <button
                    className="w-full flex items-center gap-2.5 px-4 py-2.5
                                     text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User size={14} className="text-gray-400" /> Profile
                  </button>
                  <button
                    className="w-full flex items-center gap-2.5 px-4 py-2.5
                                     text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings size={14} className="text-gray-400" /> Settings
                  </button>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5
                                 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
