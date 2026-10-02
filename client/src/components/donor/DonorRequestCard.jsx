import { Droplets } from "lucide-react";
import { Link } from "react-router-dom";

const urgencyColor = {
  CRITICAL: "bg-red-100 text-red-700",
  URGENT: "bg-orange-100 text-orange-700",
  MODERATE: "bg-blue-100 text-blue-700",
  NORMAL: "bg-green-100 text-green-700",
};

export default function DonorRequestCard({ request, compact = false }) {
  return (
    <Link
      to={`/requests/${request.request_id}`}
      className={`flex items-center justify-between gap-4 border border-gray-100 rounded-xl hover:border-red-200 hover:bg-red-50/30 transition-all no-underline group ${compact ? "p-3.5" : "p-4"}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
          <Droplets size={17} className="text-red-600" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-800 truncate">
            {request.hospital_name}
          </div>
          <div className="text-xs text-gray-500 mt-0.5 truncate">
            {request.address || "Location not specified"} · {request.quantity} unit
            {request.quantity > 1 ? "s" : ""} needed
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${urgencyColor[request.urgency_label] || "bg-gray-100 text-gray-600"}`}>
          {request.urgency_label || "OPEN"}
        </span>
        <span className="font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded text-xs" style={{ fontFamily: "var(--font-code)" }}>
          {request.blood_group}
        </span>
      </div>
    </Link>
  );
}
