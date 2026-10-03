const columns = [
  ["Platform", ["Donor Portal", "Patient Portal", "Hospital Portal", "Admin"]],
  ["Tech Stack", ["PostgreSQL", "Express.js", "React.js", "Node.js"]],
  ["Algorithms", ["Binary Search", "Haversine Formula", "Greedy Sort", "Priority Queue"]],
];

export function LandingCta() {
  return <section className="py-24" style={{ background: "linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)" }}><div className="max-w-3xl mx-auto px-4 text-center"><h2 className="text-4xl lg:text-5xl text-white mb-5" style={{ fontFamily: "var(--font-heading)" }}>Someone needs your blood right now.</h2><p className="text-red-200 text-lg mb-10">Register. It takes two minutes.</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><a href="/register/donor" className="bg-white text-red-700 font-bold px-8 py-4 rounded-xl hover:bg-red-50 transition-all shadow-xl no-underline">Register as donor</a><a href="/register/hospital" className="border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all no-underline">Register a hospital</a></div></div></section>;
}

export default function LandingFooter() {
  return <footer className="bg-gray-950 text-gray-400 py-16"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="grid md:grid-cols-4 gap-10 mb-12"><div><div className="flex items-center gap-2 mb-4"><div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center"><img src="/assets/brand/logo-mark.svg" alt="JeevanRakta" className="w-5 h-5" /></div><span className="font-bold text-white">JeevanRakta</span></div><p className="text-sm leading-relaxed text-gray-500">Swastik College BCA Final Year Project. Built on the PERN stack.</p></div>{columns.map(([title, links]) => <div key={title}><h3 className="text-white font-semibold text-sm mb-4">{title}</h3><ul className="space-y-2">{links.map((link) => <li key={link}><span className="text-sm text-gray-500">{link}</span></li>)}</ul></div>)}</div><div className="pt-8 border-t border-gray-800 text-xs text-gray-600 text-center">© 2026 JeevanRakta · Built by Rohit Ranjan Yadav & Dil Krishna Laghu · Swastik College, Bhaktapur · Tribhuvan University</div></div></footer>;
}
