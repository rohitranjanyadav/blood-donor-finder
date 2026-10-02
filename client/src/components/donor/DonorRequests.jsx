import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import DonorRequestCard from "./DonorRequestCard";
import DonorEmptyState from "./DonorEmptyState";

export default function DonorRequests({ requests, bloodGroup }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">Requests matching your blood group</h2>
          <p className="text-xs text-gray-400 mt-0.5">Blood group: <span className="font-mono font-bold text-red-700" style={{ fontFamily: "var(--font-code)" }}>{bloodGroup}</span></p>
        </div>
        <Link to="/map" className="flex items-center gap-1.5 border border-gray-200 text-sm font-medium px-3 py-2 rounded-xl hover:border-red-300 hover:text-red-600 transition-all no-underline text-gray-700"><MapPin size={14} /> Open Map</Link>
      </div>
      {requests.length === 0 ? <DonorEmptyState type="requests" bloodGroup={bloodGroup} /> : <div className="space-y-3">{requests.map((request) => <DonorRequestCard key={request.request_id} request={request} />)}</div>}
    </div>
  );
}
