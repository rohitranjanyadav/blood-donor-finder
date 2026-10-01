import { Trash2 } from "lucide-react";
import AdminTable from "./AdminTable";

export default function DonorList({ donors, onDelete }) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-gray-900">
        All Donors ({donors.length})
      </h2>
      <AdminTable
        headers={[
          "Name",
          "Email",
          "Blood",
          "Address",
          "Status",
          "Donations",
          "Joined",
          "",
        ]}
      >
        {donors.map((donor) => (
          <tr
            key={donor.donor_id}
            className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
          >
            <td className="px-5 py-4 font-medium text-gray-800">
              {donor.full_name}
            </td>
            <td className="px-5 py-4 text-gray-500 text-xs">{donor.email}</td>
            <td className="px-5 py-4">
              <span
                className="font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded text-xs"
                style={{ fontFamily: "var(--font-code)" }}
              >
                {donor.blood_group}
              </span>
            </td>
            <td className="px-5 py-4 text-gray-500 text-xs">
              {donor.address || "—"}
            </td>
            <td className="px-5 py-4">
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${donor.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
              >
                {donor.is_active ? "Active" : "Inactive"}
              </span>
            </td>
            <td
              className="px-5 py-4 font-mono text-gray-700"
              style={{ fontFamily: "var(--font-code)" }}
            >
              {donor.total_donations || 0}
            </td>
            <td className="px-5 py-4 text-[11px] text-gray-400">
              {new Date(donor.created_at).toLocaleDateString()}
            </td>
            <td className="px-5 py-4">
              <button
                onClick={() => onDelete(donor.donor_id, donor.full_name)}
                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                aria-label={`Delete ${donor.full_name}`}
              >
                <Trash2 size={13} />
              </button>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
