import { CheckCircle2, ShieldCheck, ShieldX } from "lucide-react";
import AdminTable from "./AdminTable";

export default function PendingHospitals({ hospitals, onVerify, onReject }) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-gray-900">
        Pending Hospital Verifications
      </h2>
      {hospitals.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <img
            src="/assets/illustrations/empty-state.svg"
            alt=""
            aria-hidden="true"
            className="w-28 h-28 mx-auto mb-3"
          />
          <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-600 text-sm">All caught up</h3>
          <p className="text-xs text-gray-400 mt-1">
            No hospitals pending verification.
          </p>
        </div>
      ) : (
        <AdminTable
          headers={[
            "Hospital",
            "License No.",
            "Email",
            "Phone",
            "Address",
            "Registered",
            "Actions",
          ]}
        >
          {hospitals.map((hospital) => (
            <tr
              key={hospital.hospital_id}
              className="border-t border-gray-50 hover:bg-gray-50"
            >
              <td className="px-5 py-4 font-semibold text-gray-800">
                {hospital.hospital_name}
              </td>
              <td
                className="px-5 py-4 font-mono text-[11px] text-gray-500"
                style={{ fontFamily: "var(--font-code)" }}
              >
                {hospital.license_no}
              </td>
              <td className="px-5 py-4 text-gray-600 text-xs">
                {hospital.email}
              </td>
              <td className="px-5 py-4 text-gray-500 text-xs">
                {hospital.phone || "—"}
              </td>
              <td className="px-5 py-4 text-gray-500 text-xs">
                {hospital.address || "—"}
              </td>
              <td className="px-5 py-4 text-[11px] text-gray-400">
                {new Date(hospital.created_at).toLocaleDateString()}
              </td>
              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onVerify(hospital.hospital_id)}
                    className="flex items-center gap-1 bg-green-700 hover:bg-green-800
                               text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all"
                  >
                    <ShieldCheck size={11} /> Verify
                  </button>
                  <button
                    onClick={() =>
                      onReject(hospital.hospital_id, hospital.hospital_name)
                    }
                    className="flex items-center gap-1 bg-red-50 hover:bg-red-100
                               text-red-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-red-200 transition-all"
                  >
                    <ShieldX size={11} /> Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}
