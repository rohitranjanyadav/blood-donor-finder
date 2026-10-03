import { Inbox, Droplets } from "lucide-react";

export default function DonorEmptyState({ type, bloodGroup }) {
  const history = type === "history";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
      {history ? (
        <Droplets size={40} className="text-red-200 mx-auto mb-3" />
      ) : (
        <Inbox size={40} className="text-gray-300 mx-auto mb-3" aria-hidden="true" />
      )}
      <h3 className="font-semibold text-gray-600 text-sm">
        {history ? "No donations yet" : `No active requests for ${bloodGroup}`}
      </h3>
      <p className="text-xs text-gray-400 mt-1">
        {history
          ? "After you confirm a donation at a hospital, it'll appear here."
          : "You'll get an email alert the moment one is posted."}
      </p>
    </div>
  );
}
