import { ArrowRight, CheckCircle2, Droplets, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const donors = [
  ["Rohit Y.", "0.8 km", "Confirmed", "text-green-700 bg-green-50"],
  ["Dil K.", "2.1 km", "En route", "text-blue-700 bg-blue-50"],
  ["Sita T.", "3.0 km", "Notified", "text-orange-700 bg-orange-50"],
];

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-28" style={{ background: "linear-gradient(135deg, #fef2f2 0%, #fff 50%, #f8fafc 100%)" }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-125 h-125 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #fca5a5, transparent)" }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-red-100 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Nepal's Blood Donor Platform
            </div>
            <h1 className="font-heading text-5xl lg:text-[3.75rem] text-gray-900 leading-[1.1] mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Blood, when<br /><em className="text-red-600 not-italic">it is needed</em>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-md">JeevanRakta connects donors to patients in under 60 seconds. Post a request, get matched by blood type and location, confirm a donor — no phone calls.</p>
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Link to="/register/donor" className="flex items-center justify-center gap-2 bg-red-600 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100 no-underline"><Heart size={17} /> Register as donor</Link>
              <Link to="/register/patient" className="flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-800 font-semibold px-6 py-3.5 rounded-xl hover:border-red-200 hover:text-red-700 transition-all no-underline">Request blood <ArrowRight size={15} /></Link>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-100">
              {[['< 60s', 'Alert speed'], ['100%', 'Free to use']].map(([value, label]) => <div key={label}><div className="font-mono text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-code)" }}>{value}</div><div className="text-xs text-gray-500 mt-0.5">{label}</div></div>)}
            </div>
          </div>

          <div className="relative">
            <img src="/assets/illustrations/hero-illustration.svg" alt="Blood donor matching map" className="w-full max-w-lg mx-auto mb-5" />
            <div className="bg-white rounded-2xl shadow-2xl shadow-gray-100 border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /><span className="text-xs font-semibold text-green-700">Active request</span></div><span className="text-xs text-gray-400 font-mono">2 min ago</span></div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5"><div className="flex items-start gap-3"><div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shrink-0"><Droplets size={17} className="text-white" /></div><div><div className="font-semibold text-gray-900 text-sm">O+ needed · 2 units</div><div className="text-xs text-gray-500 mt-0.5">Bir Hospital, Kathmandu · 1.4 km</div><div className="flex items-center gap-2 mt-2.5"><span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold tracking-wide uppercase">CRITICAL</span><span className="text-xs text-gray-400">4h deadline</span></div></div></div></div>
              <div className="space-y-3 mb-5">{donors.map(([name, distance, status, color]) => <div key={name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[11px] font-bold text-gray-600">{name[0]}</div><div><div className="text-sm font-medium text-gray-800">{name}</div><div className="text-[11px] text-gray-400 font-mono" style={{ fontFamily: "var(--font-code)" }}>O+ · {distance}</div></div></div><span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${color}`}>{status}</span></div>)}</div>
              <Link to="/login" className="block w-full bg-red-600 text-white text-sm font-semibold py-3 rounded-xl hover:bg-red-700 transition-colors text-center no-underline">Respond to this request</Link>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl border border-gray-100 px-4 py-3 flex items-center gap-2.5"><CheckCircle2 size={18} className="text-green-500 shrink-0" /><div><div className="text-xs font-semibold text-gray-800">Request fulfilled</div><div className="text-[11px] text-gray-400">2 donors · 18 min total</div></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
