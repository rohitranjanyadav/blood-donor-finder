import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Mail,
  ShieldCheck,
  ShieldX,
  Users,
} from "lucide-react";

const statCards = [
  ["Total Donors", "total_donors", "text-red-600 bg-red-50", Users],
  ["Active Requests", "active_requests", "text-blue-600 bg-blue-50", FileText],
  [
    "Total Donations",
    "total_donations",
    "text-green-600 bg-green-50",
    CheckCircle2,
  ],
  [
    "Verified Hospitals",
    "verified_hospitals",
    "text-green-600 bg-green-50",
    ShieldCheck,
  ],
  [
    "Pending Verification",
    "pending_hospitals",
    "text-orange-600 bg-orange-50",
    AlertCircle,
  ],
  ["Emails Sent", "total_emails_sent", "text-purple-600 bg-purple-50", Mail],
];

export default function AdminOverview({
  stats,
  pending,
  onReviewHospitals,
  onVerify,
  onReject,
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(([label, key, color, Icon]) => (
          <div
            key={label}
            className="bg-white border border-gray-100 rounded-2xl p-5"
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${color}`}
            >
              <Icon size={15} />
            </div>
            <div
              className="font-mono text-2xl font-bold text-gray-900 mb-0.5"
              style={{ fontFamily: "var(--font-code)" }}
            >
              {stats[key]}
            </div>
            <div className="text-xs text-gray-400">{label}</div>
          </div>
        ))}
      </div>

      {pending.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-orange-900 text-sm flex items-center gap-2">
              <AlertCircle size={15} />
              {pending.length} hospital{pending.length > 1 ? "s" : ""} awaiting
              verification
            </h3>
            <button
              onClick={onReviewHospitals}
              className="text-xs text-orange-700 font-semibold hover:underline"
            >
              Review all
            </button>
          </div>
          {pending.slice(0, 2).map((hospital) => (
            <div
              key={hospital.hospital_id}
              className="flex items-center justify-between bg-white rounded-xl px-4 py-3 mb-2 last:mb-0"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {hospital.hospital_name}
                </p>
                <p className="text-xs text-gray-400">
                  {hospital.license_no} · {hospital.address}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onVerify(hospital.hospital_id)}
                  className="flex items-center gap-1 bg-green-700 hover:bg-green-800
                             text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                >
                  <ShieldCheck size={12} /> Verify
                </button>
                <button
                  onClick={() =>
                    onReject(hospital.hospital_id, hospital.hospital_name)
                  }
                  className="flex items-center gap-1 bg-red-50 hover:bg-red-100
                             text-red-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                >
                  <ShieldX size={12} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
