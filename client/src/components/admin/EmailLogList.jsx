import AdminTable from "./AdminTable";

export default function EmailLogList({ emails }) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-gray-900">
        Email Logs (last 100)
      </h2>
      <AdminTable
        headers={["Donor", "Email", "Blood", "Hospital", "Sent At", "Status"]}
      >
        {emails.map((email, index) => (
          <tr
            key={email.email_log_id || index}
            className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
          >
            <td className="px-5 py-4 font-medium text-gray-800">
              {email.donor_name}
            </td>
            <td className="px-5 py-4 text-gray-500 text-xs">
              {email.donor_email}
            </td>
            <td className="px-5 py-4">
              <span
                className="font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded text-xs"
                style={{ fontFamily: "var(--font-code)" }}
              >
                {email.blood_group}
              </span>
            </td>
            <td className="px-5 py-4 text-gray-600 text-sm">
              {email.hospital_name}
            </td>
            <td className="px-5 py-4 text-xs text-gray-400">
              {new Date(email.sent_at).toLocaleString("en-NP", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </td>
            <td className="px-5 py-4">
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${email.delivery_status === "sent" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {email.delivery_status}
              </span>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
