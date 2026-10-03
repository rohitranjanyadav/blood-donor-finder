import { CheckCircle2, Droplets, MapPin, ToggleLeft, ToggleRight } from "lucide-react";
import DonorRequestCard from "./DonorRequestCard";
import DonorHistoryTable from "./DonorHistoryTable";
import DonorEmptyState from "./DonorEmptyState";

export default function DonorOverview({ profile, history, requests, toggling, onToggleStatus, onTabChange }) {
  const stats = [
    ["Total Donations", history.length, CheckCircle2, "text-green-600 bg-green-50"],
    ["Matching Requests", requests.length, Droplets, "text-red-600 bg-red-50"],
  ];

  return (
    <div className="space-y-5">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">Your donor profile</p>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{profile?.full_name}</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono font-bold text-red-700 bg-red-50 px-3 py-1 rounded-lg text-lg" style={{ fontFamily: "var(--font-code)" }}>{profile?.blood_group}</span>
            {profile?.address && <span className="flex items-center gap-1 text-sm text-gray-500"><MapPin size={13} /> {profile.address}</span>}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-semibold text-gray-500">Availability</p>
          <button onClick={onToggleStatus} disabled={toggling} className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border-2 ${profile?.is_active ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"} ${toggling ? "opacity-60 cursor-not-allowed" : ""}`}>
            {profile?.is_active ? <><ToggleRight size={20} className="text-green-600" /> Active — Receiving Alerts</> : <><ToggleLeft size={20} className="text-gray-400" /> Inactive — Not Receiving</>}
          </button>
          <p className="text-xs text-gray-500 text-center">{profile?.is_active ? "You receive email alerts for matching requests" : "Toggle on to start receiving donation alerts"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-xl">{stats.map(([label, value, Icon, color]) => <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5"><div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${color}`}><Icon size={15} /></div><div className="text-2xl font-bold text-gray-900 mb-0.5">{value}</div><div className="text-xs text-gray-500">{label}</div></div>)}</div>

      {requests.length > 0 ? <div className="bg-white border border-gray-100 rounded-2xl p-5"><div className="flex items-center gap-3 mb-4"><h3 className="font-semibold text-gray-900 text-sm">Requests matching your blood group</h3><button onClick={() => onTabChange("requests")} className="text-xs text-red-600 font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 rounded">See all</button></div><div className="space-y-3">{requests.slice(0, 3).map((request) => <DonorRequestCard key={request.request_id} request={request} compact />)}</div></div> : <DonorEmptyState type="requests" bloodGroup={profile?.blood_group} />}

      {history.length > 0 && <div className="bg-white border border-gray-100 rounded-2xl p-5"><div className="flex items-center gap-3 mb-4"><h3 className="font-semibold text-gray-900 text-sm">Recent donations</h3><button onClick={() => onTabChange("history")} className="text-xs text-red-600 font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 rounded">See all</button></div><DonorHistoryTable history={history} compact /></div>}
    </div>
  );
}
