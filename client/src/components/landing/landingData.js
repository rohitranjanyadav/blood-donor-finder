import {
  Activity,
  Award,
  Bell,
  Clock,
  MapPin,
  ShieldCheck,
} from "lucide-react";

export const navLinks = [
  ["Features", "#features"],
  ["How It Works", "#how-it-works"],
  ["FAQ", "#faq"],
];

export const features = [
  [MapPin, "GPS Donor Matching", "bg-red-50 text-red-600", "Donors within 2 km of a request get notified first. Distance and blood type filter simultaneously."],
  [Bell, "Under-60-Second Alerts", "bg-orange-50 text-orange-600", "A patient posts a request. Eligible donors receive an email before the minute ends."],
  [ShieldCheck, "Verified Hospitals Only", "bg-green-50 text-green-600", "Hospitals submit registration documents. Admins verify before the hospital can post a single request."],
  [Activity, "Live Dashboards", "bg-blue-50 text-blue-600", "Donors track requests accepted. Hospitals track units confirmed. Admins monitor everything."],
  [Award, "Donation Records", "bg-purple-50 text-purple-600", "Every donation is logged. Donors see their history and the hospitals they have helped."],
  [Clock, "Deadline Prioritisation", "bg-cyan-50 text-cyan-600", "Requests with shorter deadlines surface higher in donor feeds. Emergency cases get top priority."],
];

export const steps = [
  ["01", "Register in 2 minutes", "Pick your role, set your blood type and location. No documents needed for donors."],
  ["02", "Post or find a request", "Patients and hospitals post what they need. Donors see matching requests nearby."],
  ["03", "System matches you", "Binary search on blood type. Haversine formula sorts by distance. Nearest donor notified first."],
  ["04", "Donate and log it", "Confirm at the hospital. The system records the donation and updates the request status."],
];

export const roleCards = [
  { title: "Donor", href: "/register/donor", color: "bg-red-600", image: "/assets/icons/role-donor.svg", items: ["Nearby requests map", "Availability toggle", "Donation history", "Email alerts"] },
  { title: "Patient", href: "/register/patient", color: "bg-blue-600", image: "/assets/icons/role-patient.svg", items: ["Post request in 3 steps", "Live status updates", "Donor responses", "Request timeline"] },
  { title: "Hospital", href: "/register/hospital", color: "bg-green-600", image: "/assets/icons/role-hospital.svg", items: ["Verified hospital badge", "Multi-unit requests", "Response analytics", "Blood group demand chart"] },
];

export const testimonials = [
  ["Priya Sharma", "Donor, Kathmandu", "PS", "Got a notification at 11 pm for an O+ request nearby. I was at the hospital in 20 minutes."],
  ["Dr. Arjun Mehta", "Bir Hospital", "AM", "We used to spend two hours calling blood banks. Now we post a request and the first donor responds in 15 minutes."],
  ["Ravi Kumar", "Patient, Lalitpur", "RK", "Three donors confirmed within 40 minutes. I did not have to make a single call myself."],
];

export const faqs = [
  ["Who can register as a donor?", "Any adult who meets basic health criteria. You fill in blood type, city, and availability. No documents needed."],
  ["Is my data shared with anyone?", "No. Your contact details are not visible to other users. Hospitals see blood type and approximate distance only."],
  ["How often can I donate?", "Whole blood: every 56 days. The system tracks your last donation and stops sending requests until you are eligible again."],
  ["Can hospitals post emergency requests?", "Yes. Verified hospitals can mark requests as CRITICAL, which bumps them to the top of donor feeds."],
  ["Does it cost anything?", "Free for donors and patients. The platform is open-source and runs at zero cost."],
];
