import { Calendar } from "lucide-react";

export default function DonorHistoryTable({ history, compact = false }) {
  const rows = compact ? history.slice(0, 3) : history;

  return (
    <div className={compact ? "overflow-x-auto" : "bg-white border border-gray-100 rounded-2xl overflow-hidden"}>
      <div className={compact ? "" : "overflow-x-auto"}>
        <table className={`${compact ? "w-auto" : "w-full"} text-sm`}>
          <thead className={compact ? "" : "bg-gray-50"}>
            <tr>
              {!compact && <th className="text-left text-[11px] font-semibold text-gray-400 px-5 py-3 uppercase tracking-wide">#</th>}
              <th className={compact ? "text-left text-[11px] font-semibold text-gray-400 pb-3 pr-4 uppercase tracking-wide" : "text-left text-[11px] font-semibold text-gray-400 px-5 py-3 uppercase tracking-wide"}>Hospital</th>
              <th className={compact ? "text-left text-[11px] font-semibold text-gray-400 pb-3 pr-4 uppercase tracking-wide" : "text-left text-[11px] font-semibold text-gray-400 px-5 py-3 uppercase tracking-wide"}>Blood Group</th>
              {!compact && <th className="text-left text-[11px] font-semibold text-gray-400 px-5 py-3 uppercase tracking-wide">Address</th>}
              <th className={compact ? "text-left text-[11px] font-semibold text-gray-400 pb-3 uppercase tracking-wide" : "text-left text-[11px] font-semibold text-gray-400 px-5 py-3 uppercase tracking-wide"}>Date</th>
              {!compact && <th className="text-left text-[11px] font-semibold text-gray-400 px-5 py-3 uppercase tracking-wide">Notes</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((donation, index) => (
              <tr key={donation.donation_id || index} className={compact ? "border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors" : "border-t border-gray-50 hover:bg-gray-50 transition-colors"}>
                {!compact && <td className="px-5 py-4 text-gray-400 text-[11px] font-mono" style={{ fontFamily: "var(--font-code)" }}>{index + 1}</td>}
                <td className={compact ? "py-3 pr-4 font-medium text-gray-800 text-sm" : "px-5 py-4 font-medium text-gray-800"}>{donation.hospital_name || "—"}</td>
                <td className={compact ? "py-3 pr-4" : "px-5 py-4"}><span className="font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded text-xs" style={{ fontFamily: "var(--font-code)" }}>{donation.blood_group}</span></td>
                {!compact && <td className="px-5 py-4 text-gray-500 text-xs">{donation.request_address || "—"}</td>}
                <td className={compact ? "py-3 text-gray-500 text-xs" : "px-5 py-4 text-xs text-gray-500"}><span className="flex items-center gap-1"><Calendar size={11} />{new Date(donation.donated_at).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" })}</span></td>
                {!compact && <td className="px-5 py-4 text-xs text-gray-400">{donation.notes || "—"}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
