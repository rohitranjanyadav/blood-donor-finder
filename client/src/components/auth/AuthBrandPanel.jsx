export default function AuthBrandPanel({ view, donors }) {
  const stats = [
    [donors, "Registered donors"],
    ["< 60s", "Alert speed"],
    ["93%", "Requests fulfilled"],
  ];

  return (
    <div className="hidden lg:flex lg:w-[42%] bg-red-600 flex-col justify-between p-12 relative overflow-hidden">
      <img
        src="/assets/illustrations/auth-bg.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <img
              src="/assets/brand/logo-mark.svg"
              alt="JeevanRakta Logo"
              className="w-6 h-6"
            />
          </div>
          <span className="text-xl font-bold text-white">JeevanRakta</span>
        </div>
        <h2
          className="text-4xl text-white mb-4 leading-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {view === "login"
            ? "Good to have\nyou back."
            : "Join our community of donors."}
        </h2>
        <p className="text-red-200 text-base leading-relaxed max-w-xs">
          {view === "login"
            ? "Your dashboard is waiting. Sign in to see requests near you."
            : "Set up takes two minutes. Donors can respond to requests the same day."}
        </p>
      </div>

      <div className="relative z-10 max-w-xs">
        {stats.map(([value, label]) => (
          <div
            key={label}
            className="flex items-center gap-3 py-3.5
                       border-b border-red-500/40 last:border-0"
          >
            <span className="text-red-200 text-sm">{label}</span>
            <span className="flex-1 border-t border-dotted border-red-300/60" aria-hidden="true" />
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
