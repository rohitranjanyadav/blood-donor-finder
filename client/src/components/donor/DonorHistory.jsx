import DonorEmptyState from "./DonorEmptyState";
import DonorHistoryTable from "./DonorHistoryTable";

export default function DonorHistory({ history }) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-gray-900">Donation History</h2>
      {history.length === 0 ? <DonorEmptyState type="history" /> : <DonorHistoryTable history={history} />}
    </div>
  );
}
