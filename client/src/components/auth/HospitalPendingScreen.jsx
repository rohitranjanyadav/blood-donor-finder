import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function HospitalPendingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div
        className="bg-white rounded-2xl shadow-sm border border-gray-100
                   p-10 max-w-md w-full text-center"
      >
        <CheckCircle2 size={52} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          Registration received
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Your hospital account is pending admin verification. You can log in
          once approved — usually within 24 hours.
        </p>
        <Link
          to="/"
          className="inline-block bg-green-700 hover:bg-green-800 text-white
                     px-6 py-2.5 rounded-xl font-semibold text-sm
                     transition-colors no-underline"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
