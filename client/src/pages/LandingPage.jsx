import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MapPin,
  Bell,
  ShieldCheck,
  Users,
  Hospital,
  ChevronDown,
  Star,
  Menu,
  X,
  Droplets,
  Clock,
  CheckCircle2,
  ArrowRight,
  Activity,
  Award,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "GPS Donor Matching",
    color: "bg-red-50 text-red-600",
    desc: "Donors within 2 km of a request get notified first. Distance and blood type filter simultaneously.",
  },
  {
    icon: Bell,
    title: "Under-60-Second Alerts",
    color: "bg-orange-50 text-orange-600",
    desc: "A patient posts a request. Eligible donors receive an email before the minute ends.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Hospitals Only",
    color: "bg-green-50 text-green-600",
    desc: "Hospitals submit registration documents. Admins verify before the hospital can post a single request.",
  },
  {
    icon: Activity,
    title: "Live Dashboards",
    color: "bg-blue-50 text-blue-600",
    desc: "Donors track requests accepted. Hospitals track units confirmed. Admins monitor everything.",
  },
  {
    icon: Award,
    title: "Donation Records",
    color: "bg-purple-50 text-purple-600",
    desc: "Every donation is logged. Donors see their history and the hospitals they have helped.",
  },
  {
    icon: Clock,
    title: "Deadline Prioritisation",
    color: "bg-cyan-50 text-cyan-600",
    desc: "Requests with shorter deadlines surface higher in donor feeds. Emergency cases get top priority.",
  },
];

const steps = [
  {
    num: "01",
    title: "Register in 2 minutes",
    desc: "Pick your role, set your blood type and location. No documents needed for donors.",
  },
  {
    num: "02",
    title: "Post or find a request",
    desc: "Patients and hospitals post what they need. Donors see matching requests nearby.",
  },
  {
    num: "03",
    title: "System matches you",
    desc: "Binary search on blood type. Haversine formula sorts by distance. Nearest donor notified first.",
  },
  {
    num: "04",
    title: "Donate and log it",
    desc: "Confirm at the hospital. The system records the donation and updates the request status.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Donor, Kathmandu",
    avatar: "PS",
    rating: 5,
    text: "Got a notification at 11 pm for an O+ request nearby. I was at the hospital in 20 minutes.",
  },
  {
    name: "Dr. Arjun Mehta",
    role: "Bir Hospital",
    avatar: "AM",
    rating: 5,
    text: "We used to spend two hours calling blood banks. Now we post a request and the first donor responds in 15 minutes.",
  },
  {
    name: "Ravi Kumar",
    role: "Patient, Lalitpur",
    avatar: "RK",
    rating: 5,
    text: "Three donors confirmed within 40 minutes. I did not have to make a single call myself.",
  },
];

const faqs = [
  {
    q: "Who can register as a donor?",
    a: "Any adult who meets basic health criteria. You fill in blood type, city, and availability. No documents needed.",
  },
  {
    q: "Is my data shared with anyone?",
    a: "No. Your contact details are not visible to other users. Hospitals see blood type and approximate distance only.",
  },
  {
    q: "How often can I donate?",
    a: "Whole blood: every 56 days. The system tracks your last donation and stops sending requests until you are eligible again.",
  },
  {
    q: "Can hospitals post emergency requests?",
    a: "Yes. Verified hospitals can mark requests as CRITICAL, which bumps them to the top of donor feeds.",
  },
  {
    q: "Does it cost anything?",
    a: "Free for donors and patients. The platform is open-source and runs at zero cost.",
  },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* ── Navbar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <img src="../../public/logo.jpg" alt="" />
              </div>
              <span className="font-bold text-lg tracking-tight text-gray-900">
                JeevanRakta
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {[
                ["Features", "#features"],
                ["How It Works", "#how-it-works"],
                ["FAQ", "#faq"],
              ].map(([l, h]) => (
                <a
                  key={l}
                  href={h}
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {l}
                </a>
              ))}
              <Link
                to="/map"
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Live Map
              </Link>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2"
              >
                Sign in
              </Link>
              <Link
                to="/register/donor"
                className="text-sm font-semibold bg-red-600 text-white px-4 py-2
                           rounded-lg hover:bg-red-700 transition-colors no-underline"
              >
                Register
              </Link>
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
            {[
              ["Features", "#features"],
              ["How It Works", "#how-it-works"],
              ["FAQ", "#faq"],
            ].map(([l, h]) => (
              <a
                key={l}
                href={h}
                onClick={() => setMenuOpen(false)}
                className="block text-sm text-gray-700 py-2.5 border-b border-gray-50 last:border-0"
              >
                {l}
              </a>
            ))}
            <div className="flex gap-2 pt-3">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 border border-gray-200 text-sm font-medium
                           py-2.5 rounded-xl text-center no-underline text-gray-700"
              >
                Sign in
              </Link>
              <Link
                to="/register/donor"
                onClick={() => setMenuOpen(false)}
                className="flex-1 bg-red-600 text-white text-sm font-semibold
                           py-2.5 rounded-xl text-center no-underline"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden pt-20 pb-28"
        style={{
          background:
            "linear-gradient(135deg, #fef2f2 0%, #fff 50%, #f8fafc 100%)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, #fca5a5, transparent)",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div
                className="inline-flex items-center gap-2 bg-white border border-red-100
                              text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full
                              mb-8 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Nepal's Blood Donor Platform
              </div>

              <h1
                className="font-heading text-5xl lg:text-[3.75rem] text-gray-900
                             leading-[1.1] mb-6"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Blood, when
                <br />
                <em className="text-red-600 not-italic">it is needed</em>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-md">
                BloodNet connects donors to patients in under 60 seconds. Post a
                request, get matched by blood type and location, confirm a donor
                — no phone calls.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-12">
                <Link
                  to="/register/donor"
                  className="flex items-center justify-center gap-2 bg-red-600 text-white
                             font-semibold px-6 py-3.5 rounded-xl hover:bg-red-700
                             transition-all shadow-lg shadow-red-100 no-underline"
                >
                  <Heart size={17} />
                  Register as donor
                </Link>
                <Link
                  to="/register/patient"
                  className="flex items-center justify-center gap-2 border-2 border-gray-200
                             text-gray-800 font-semibold px-6 py-3.5 rounded-xl
                             hover:border-red-200 hover:text-red-700 transition-all no-underline"
                >
                  Request blood
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                {[
                  ["< 60s", "Alert speed"],
                  ["100%", "Free to use"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <div
                      className="font-mono text-xl font-bold text-gray-900"
                      style={{ fontFamily: "var(--font-code)" }}
                    >
                      {v}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — live request card */}
            <div className="relative">
              <div
                className="bg-white rounded-2xl shadow-2xl shadow-gray-100
                              border border-gray-100 p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-semibold text-green-700">
                      Active request
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">
                    2 min ago
                  </span>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 bg-red-600 rounded-xl flex items-center
                                    justify-center shrink-0"
                    >
                      <Droplets size={17} className="text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        O+ needed · 2 units
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Bir Hospital, Kathmandu · 1.4 km
                      </div>
                      <div className="flex items-center gap-2 mt-2.5">
                        <span
                          className="text-[10px] bg-red-600 text-white px-2 py-0.5
                                         rounded-full font-bold tracking-wide uppercase"
                        >
                          CRITICAL
                        </span>
                        <span className="text-xs text-gray-400">
                          4h deadline
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  {[
                    {
                      name: "Rohit Y.",
                      bg: "O+",
                      dist: "0.8 km",
                      status: "Confirmed",
                      color: "text-green-700 bg-green-50",
                    },
                    {
                      name: "Dil K.",
                      bg: "O+",
                      dist: "2.1 km",
                      status: "En route",
                      color: "text-blue-700 bg-blue-50",
                    },
                    {
                      name: "Sita T.",
                      bg: "O+",
                      dist: "3.0 km",
                      status: "Notified",
                      color: "text-orange-700 bg-orange-50",
                    },
                  ].map((d) => (
                    <div
                      key={d.name}
                      className="flex items-center justify-between
                                                  py-2 border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center
                                        justify-center text-[11px] font-bold text-gray-600"
                        >
                          {d.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            {d.name}
                          </div>
                          <div
                            className="text-[11px] text-gray-400 font-mono"
                            style={{ fontFamily: "var(--font-code)" }}
                          >
                            {d.bg} · {d.dist}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${d.color}`}
                      >
                        {d.status}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/login"
                  className="block w-full bg-red-600 text-white text-sm font-semibold
                             py-3 rounded-xl hover:bg-red-700 transition-colors text-center
                             no-underline"
                >
                  Respond to this request
                </Link>
              </div>

              <div
                className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl
                              border border-gray-100 px-4 py-3 flex items-center gap-2.5"
              >
                <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-gray-800">
                    Request fulfilled
                  </div>
                  <div className="text-[11px] text-gray-400">
                    2 donors · 18 min total
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────── */}
      <section className="bg-red-600 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { v: "1,200+", l: "Registered Donors", icon: Users },
              { v: "< 60s", l: "Alert Speed", icon: Bell },
              { v: "4", l: "DSA Algorithms", icon: Activity },
              { v: "93%", l: "Requests Fulfilled", icon: Heart },
            ].map(({ v, l, icon: Icon }) => (
              <div key={l}>
                <Icon size={24} className="text-red-300 mx-auto mb-2" />
                <div
                  className="font-mono text-3xl font-bold text-white"
                  style={{ fontFamily: "var(--font-code)" }}
                >
                  {v}
                </div>
                <div className="text-red-200 text-sm mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-14">
            <h2
              className="text-4xl text-gray-900 mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Six tools. One network.
            </h2>
            <p className="text-gray-500 text-lg">
              Each one cuts a specific friction point between a donor and a
              patient.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="border border-gray-100 rounded-2xl p-6 hover:border-red-100
                           hover:shadow-lg hover:shadow-red-50/60 transition-all cursor-default"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}
                >
                  <f.icon size={20} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-[15px]">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-14">
            <h2
              className="text-4xl text-gray-900 mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Four steps. No phone calls.
            </h2>
            <p className="text-gray-500 text-lg">
              The whole process runs through the platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-7 left-full w-full h-px
                                   bg-gradient-to-r from-red-200 to-transparent z-0"
                  />
                )}
                <div className="relative z-10">
                  <div
                    className="font-mono text-5xl font-bold text-red-100 mb-4 leading-none"
                    style={{ fontFamily: "var(--font-code)" }}
                  >
                    {step.num}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-[15px]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-14">
            <Link
              to="/register/donor"
              className="inline-flex items-center gap-2 bg-red-600 text-white font-semibold
                         px-7 py-3.5 rounded-xl hover:bg-red-700 transition-all
                         shadow-lg shadow-red-100 no-underline"
            >
              Create your account
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Role Cards ─────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-14">
            <h2
              className="text-4xl text-gray-900 mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Pick your role
            </h2>
            <p className="text-gray-500 text-lg">
              Each role gets a dashboard built around what that person does.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Donor",
                href: "/register/donor",
                color: "bg-red-600",
                items: [
                  "Nearby requests map",
                  "Availability toggle",
                  "Donation history",
                  "Email alerts",
                ],
              },
              {
                title: "Patient",
                href: "/register/patient",
                color: "bg-blue-600",
                items: [
                  "Post request in 3 steps",
                  "Live status updates",
                  "Donor responses",
                  "Request timeline",
                ],
              },
              {
                title: "Hospital",
                href: "/register/hospital",
                color: "bg-green-600",
                items: [
                  "Verified hospital badge",
                  "Multi-unit requests",
                  "Response analytics",
                  "Blood group demand chart",
                ],
              },
            ].map((card) => (
              <div
                key={card.title}
                className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all"
              >
                <div className={`${card.color} p-8`}>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {card.title}
                  </h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-2.5 mb-6">
                    {card.items.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2.5 text-sm text-gray-600"
                      >
                        <CheckCircle2
                          size={14}
                          className="text-green-500 shrink-0"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={card.href}
                    className="block w-full border-2 border-gray-200 text-sm font-semibold
                               py-2.5 rounded-xl hover:border-red-200 hover:text-red-700
                               transition-all text-center no-underline text-gray-800"
                  >
                    Join as {card.title}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-14">
            <h2
              className="text-4xl text-gray-900 mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              From donors and patients
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className="text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 bg-red-100 rounded-full flex items-center
                                   justify-center text-xs font-bold text-red-700"
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {t.name}
                    </div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <h2
              className="text-4xl text-gray-900 mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Common questions
            </h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4
                             text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 text-sm pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={15}
                    className={`text-gray-400 shrink-0 transition-transform
                                ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section
        className="py-24"
        style={{
          background: "linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2
            className="text-4xl lg:text-5xl text-white mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Someone needs your blood right now.
          </h2>
          <p className="text-red-200 text-lg mb-10">
            Register. It takes two minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register/donor"
              className="bg-white text-red-700 font-bold px-8 py-4 rounded-xl
                         hover:bg-red-50 transition-all shadow-xl no-underline"
            >
              Register as donor
            </Link>
            <Link
              to="/register/hospital"
              className="border-2 border-white/30 text-white font-semibold px-8 py-4
                         rounded-xl hover:bg-white/10 transition-all no-underline"
            >
              Register a hospital
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-gray-950 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
                  <Droplets size={13} className="text-white" />
                </div>
                <span className="font-bold text-white">JeevanRakta</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-500">
                Swastik College BCA Final Year Project. Built on the PERN stack.
              </p>
            </div>
            {[
              {
                title: "Platform",
                links: [
                  "Donor Portal",
                  "Patient Portal",
                  "Hospital Portal",
                  "Admin",
                ],
              },
              {
                title: "Tech Stack",
                links: ["PostgreSQL", "Express.js", "React.js", "Node.js"],
              },
              {
                title: "Algorithms",
                links: [
                  "Binary Search",
                  "Haversine Formula",
                  "Greedy Sort",
                  "Priority Queue",
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <span className="text-sm text-gray-500">{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-gray-800 text-xs text-gray-600 text-center">
            © 2026 JeevanRakta · Built by Rohit Ranjan Yadav & Dil Krishna Laghu
            · Swastik College, Bhaktapur · Tribhuvan University
          </div>
        </div>
      </footer>
    </div>
  );
}
