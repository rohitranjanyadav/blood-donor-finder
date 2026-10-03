import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Droplets,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  Calendar,
} from "lucide-react";
import Spinner from "../components/ui/Spinner";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const urgencyBadge = {
  CRITICAL: "bg-red-100 text-red-700 border-red-200",
  URGENT: "bg-orange-100 text-orange-700 border-orange-200",
  MODERATE: "bg-blue-100 text-blue-700 border-blue-200",
  NORMAL: "bg-green-100 text-green-700 border-green-200",
};

export default function RequestDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donating, setDonating] = useState(false);
  const [notes, setNotes] = useState("");
  const [donated, setDonated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/requests/${id}`);
        setRequest(data);
      } catch {
        setError("Request not found");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const confirmDonation = async () => {
    setDonating(true);
    try {
      await api.post("/donations", { request_id: parseInt(id), notes });
      setDonated(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to record donation");
    } finally {
      setDonating(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    );
  if (error && !request)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <AlertCircle size={48} className="text-red-400" />
        <p className="text-gray-600 font-medium">{error}</p>
        <Link
          to="/map"
          className="text-red-600 text-sm font-semibold hover:underline no-underline"
        >
          ← Back to map
        </Link>
      </div>
    );

  const statusColor = {
    open: "bg-blue-100 text-blue-700",
    fulfilled: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-600",
  };

  return (
    <div
      className="min-h-screen bg-gray-50 px-4 py-10"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link
          to="/map"
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800
                     text-sm mb-6 no-underline transition-colors"
        >
          <ArrowLeft size={14} /> Back to map
        </Link>

        {/* Header card */}
        <div
          className="bg-white border border-gray-100 rounded-2xl p-6 mb-5
                        shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 bg-red-50 rounded-2xl flex items-center
                              justify-center shrink-0"
              >
                <Droplets size={24} className="text-red-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className="font-mono font-bold text-red-700 bg-red-50
                                    px-3 py-1 rounded-lg text-xl"
                    style={{ fontFamily: "var(--font-code)" }}
                  >
                    {request.blood_group}
                  </span>
                  {request.urgency_label && (
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full
                                      border ${urgencyBadge[request.urgency_label]}`}
                    >
                      {request.urgency_label}
                    </span>
                  )}
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full
                                    ${statusColor[request.status] || "bg-gray-100 text-gray-600"}`}
                  >
                    {request.status?.toUpperCase()}
                  </span>
                </div>
                <h1 className="text-lg font-bold text-gray-900">
                  {request.hospital_name}
                </h1>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <p className="text-xs text-gray-400 mb-1">Donors alerted</p>
              <p
                className="font-mono text-2xl font-bold text-gray-900"
                style={{ fontFamily: "var(--font-code)" }}
              >
                {request.donors_alerted || 0}
              </p>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Droplets,
                label: "Quantity",
                value: `${request.quantity} unit${request.quantity > 1 ? "s" : ""}`,
              },
              {
                icon: Clock,
                label: "Time Left",
                value:
                  request.hours_remaining !== undefined
                    ? `${request.hours_remaining}h`
                    : "—",
              },
              {
                icon: MapPin,
                label: "Location",
                value: request.address || "Not specified",
              },
              {
                icon: Calendar,
                label: "Deadline",
                value: new Date(request.deadline).toLocaleDateString("en-NP", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3.5">
                <div className="flex items-center gap-1.5 text-gray-400 mb-1.5">
                  <Icon size={12} />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    {label}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Notes */}
          {request.notes && (
            <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p
                className="text-xs font-semibold text-amber-700 uppercase
                            tracking-wider mb-1"
              >
                Message from requester
              </p>
              <p className="text-sm text-amber-900 leading-relaxed">
                {request.notes}
              </p>
            </div>
          )}
        </div>

        {/* Map */}
        {request.latitude && request.longitude && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
              <MapPin size={14} className="text-red-600" /> Hospital Location
            </h3>
            <div className="rounded-xl overflow-hidden" style={{ height: 220 }}>
              <MapContainer
                center={[request.latitude, request.longitude]}
                zoom={15}
                style={{ width: "100%", height: "100%" }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[request.latitude, request.longitude]} />
                <Circle
                  center={[request.latitude, request.longitude]}
                  radius={500}
                  pathOptions={{
                    color: "#C0392B",
                    fillColor: "#C0392B",
                    fillOpacity: 0.08,
                    weight: 1.5,
                  }}
                />
              </MapContainer>
            </div>
          </div>
        )}

        {/* Donor confirm donation */}
        {user?.role === "donor" && request.status === "open" && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            {donated ? (
              <div className="text-center py-4">
                <CheckCircle2
                  size={44}
                  className="text-green-500 mx-auto mb-3"
                />
                <h3 className="font-bold text-gray-900 mb-1">
                  Donation recorded
                </h3>
                <p className="text-sm text-gray-500">
                  Thank you. This has been added to your history.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-gray-900 text-sm mb-4 flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-green-600" />
                  Confirm your donation
                </h3>
                {error && (
                  <div
                    className="bg-red-50 border-l-4 border-red-500 text-red-700
                                  text-sm px-4 py-2.5 rounded-lg mb-4"
                  >
                    {error}
                  </div>
                )}
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional: notes about the donation (ward, time, etc.)"
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5
                             text-sm focus:outline-none focus:ring-2
                             focus:ring-green-500/20 focus:border-green-400
                             transition-all resize-none mb-4"
                />
                <button
                  onClick={confirmDonation}
                  disabled={donating}
                  className="w-full bg-green-700 hover:bg-green-800 text-white
                             font-semibold py-3 rounded-xl transition-all
                             disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {donating ? "Recording..." : "Confirm I Donated"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
