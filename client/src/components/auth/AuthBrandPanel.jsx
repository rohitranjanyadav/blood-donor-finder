import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AuthBrandPanel({ view, donors }) {
  const stats = [
    [donors, "Registered donors"],
    ["< 60s", "Alert speed"],
    ["93%", "Requests fulfilled"],
  ];

  return (
    <div className="hidden lg:flex lg:w-[42%] bg-red-600 flex-col justify-between p-12">
      <div>
        <Link
          to="/"
          className="flex items-center gap-2 text-red-300 hover:text-white
                     transition-colors mb-14 text-sm font-medium no-underline"
        >
          <ArrowLeft size={14} />
          Back
        </Link>
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <img src="../../public/logo.jpg" alt="JeevanRakta Logo" />
          </div>
          <span className="text-xl font-bold text-white">JeevanRakta</span>
        </div>
        <h2
          className="text-4xl text-white mb-4 leading-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {view === "login"
            ? "Good to have\nyou back."
            : "Login and view the requests."}
        </h2>
        <p className="text-red-200 text-base leading-relaxed max-w-xs">
          {view === "login"
            ? "Your dashboard is waiting. Sign in to see requests near you."
            : "Set up takes two minutes. Donors can respond to requests the same day."}
        </p>
      </div>

      <div>
        {stats.map(([value, label]) => (
          <div
            key={label}
            className="flex items-center justify-between py-3.5
                       border-b border-red-500/40 last:border-0"
          >
            <span className="text-red-200 text-sm">{label}</span>
            <span
              className="font-mono font-bold text-white"
              style={{ fontFamily: "var(--font-code)" }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
