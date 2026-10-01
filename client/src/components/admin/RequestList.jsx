import AdminTable from "./AdminTable";

const statusBadge = {
  open: "bg-blue-100 text-blue-700",
  fulfilled: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-600",
};

export default function RequestList({ requests, onCancel }) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-gray-900">
        All Requests ({requests.length})
      </h2>
      <AdminTable
        headers={[
          "ID",
          "Blood",
          "Hospital",
          "Qty",
          "Alerted",
          "Deadline",
          "Status",
          "",
        ]}
      >
        {requests.map((request) => (
          <tr
            key={request.request_id}
            className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
          >
            <td
              className="px-5 py-4 font-mono text-[11px] text-gray-400"
              style={{ fontFamily: "var(--font-code)" }}
            >
              #{request.request_id}
            </td>
            <td className="px-5 py-4">
              <span
                className="font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded text-xs"
                style={{ fontFamily: "var(--font-code)" }}
              >
                {request.blood_group}
              </span>
            </td>
            <td className="px-5 py-4 font-medium text-gray-800 text-sm">
              {request.hospital_name}
            </td>
            <td className="px-5 py-4 text-gray-600">{request.quantity}</td>
            <td className="px-5 py-4 text-gray-600">
              {request.donors_alerted || 0}
            </td>
            <td className="px-5 py-4 text-xs text-gray-500">
              {new Date(request.deadline).toLocaleDateString("en-NP", {
                day: "numeric",
                month: "short",
              })}
            </td>
            <td className="px-5 py-4">
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusBadge[request.status] || "bg-gray-100 text-gray-600"}`}
              >
                {request.status}
              </span>
            </td>
            <td className="px-5 py-4">
              {request.status === "open" && (
                <button
                  onClick={() => onCancel(request.request_id)}
                  className="text-xs text-red-600 font-medium hover:underline"
                >
                  Cancel
                </button>
              )}
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
