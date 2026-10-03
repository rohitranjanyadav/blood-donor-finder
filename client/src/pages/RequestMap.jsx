import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import { Droplets, Clock, MapPin, AlertCircle, RefreshCw } from "lucide-react";
import Spinner from "../components/ui/Spinner";
import api from "../api/axios";

const requestIcon = new L.Icon({
  iconUrl: "/assets/markers/marker-request.svg",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -38],
});

const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const urgencyBadge = {
  CRITICAL: "bg-red-100 text-red-700 border-red-200",
  URGENT: "bg-orange-100 text-orange-700 border-orange-200",
  MODERATE: "bg-blue-100 text-blue-700 border-blue-200",
  NORMAL: "bg-green-100 text-green-700 border-green-200",
};

// Kathmandu center
const CENTER = [27.7172, 85.324];

export default function RequestMap() {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBG, setFilterBG] = useState("All");
  const [filterUrg, setFilterUrg] = useState("All");
  const [selected, setSelected] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    let res = [...requests];
    if (filterBG !== "All") res = res.filter((r) => r.blood_group === filterBG);
    if (filterUrg !== "All")
      res = res.filter((r) => r.urgency_label === filterUrg);
    setFiltered(res);
  }, [requests, filterBG, filterUrg]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/requests/active");
      setRequests(data.requests || []);
      setLastRefresh(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const withCoords = filtered.filter((r) => r.latitude && r.longitude);

  return (
    <div
      className="h-[calc(100vh-4rem)] min-h-[680px] flex flex-col bg-gray-50"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Header */}
      <div
        className="bg-white border-b border-gray-100 px-3 sm:px-4 lg:px-6 py-3
              flex flex-col lg:flex-row lg:items-center justify-between gap-3 shrink-0"
      >
        <div>
          <h1 className="font-semibold text-gray-900 text-sm">
            Live Blood Request Map
          </h1>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {filtered.length} active request{filtered.length !== 1 ? "s" : ""} ·
            Updated {lastRefresh.toLocaleTimeString()}
          </p>
        </div>

        <div className="flex items-center gap-2 min-w-0 w-full lg:w-auto overflow-x-auto pb-1">
          {/* Blood group filter */}
          <div className="flex gap-1 shrink-0">
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                onClick={() => setFilterBG(bg)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border
                            transition-all
                            ${
                              filterBG === bg
                                ? "bg-red-700 border-red-700 text-white"
                                : "bg-white border-gray-200 text-gray-600 hover:border-red-300"
                            }`}
              >
                {bg}
              </button>
            ))}
          </div>

          {/* Urgency filter */}
          <select
            value={filterUrg}
            onChange={(e) => setFilterUrg(e.target.value)}
            className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs
                       font-medium text-gray-600 focus:outline-none focus:ring-1
                       focus:ring-red-400 bg-white"
          >
            <option value="All">All Urgency</option>
            <option value="CRITICAL">Critical</option>
            <option value="URGENT">Urgent</option>
            <option value="MODERATE">Moderate</option>
            <option value="NORMAL">Normal</option>
          </select>

          <button
            onClick={fetchRequests}
            className="flex items-center gap-1.5 border border-gray-200
                       px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600
                       hover:border-red-300 hover:text-red-600 transition-all"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        {/* Map */}
        <div className="h-[55vh] min-h-[360px] lg:h-auto lg:flex-1 relative shrink-0">
          {loading ? (
            <div
              className="absolute inset-0 bg-white/80 flex items-center
                            justify-center z-10"
            >
              <Spinner text="Loading requests..." />
            </div>
          ) : null}

          {withCoords.length === 0 && !loading ? (
            <div
              className="absolute inset-0 flex flex-col items-center
                            justify-center z-10 bg-white/60 pointer-events-none"
            >
              <AlertCircle size={40} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-500 font-medium">
                No requests with location data
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Requests without GPS coordinates don't appear on map
              </p>
            </div>
          ) : null}

          <MapContainer
            center={CENTER}
            zoom={12}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {withCoords.map((r) => (
              <Marker
                key={r.request_id}
                position={[r.latitude, r.longitude]}
                icon={requestIcon}
                eventHandlers={{ click: () => setSelected(r) }}
              >
                <Popup>
                  <div
                    style={{ fontFamily: "Inter, sans-serif", minWidth: 200 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "DM Mono, monospace",
                          fontWeight: 700,
                          fontSize: 18,
                          color: "#C0392B",
                          background: "#FADBD8",
                          padding: "2px 8px",
                          borderRadius: 6,
                        }}
                      >
                        {r.blood_group}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 20,
                          background:
                            r.urgency_label === "CRITICAL"
                              ? "#FDEDEC"
                              : "#EBF5FB",
                          color:
                            r.urgency_label === "CRITICAL"
                              ? "#C0392B"
                              : "#2471A3",
                        }}
                      >
                        {r.urgency_label || "OPEN"}
                      </span>
                    </div>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        margin: "0 0 4px",
                        color: "#1B2631",
                      }}
                    >
                      {r.hospital_name}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#7F8C8D",
                        margin: "0 0 4px",
                      }}
                    >
                      📍 {r.address || "Location not specified"}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#7F8C8D",
                        margin: "0 0 10px",
                      }}
                    >
                      {r.quantity} unit{r.quantity > 1 ? "s" : ""} needed ·{" "}
                      {r.hours_remaining !== undefined
                        ? `${r.hours_remaining}h left`
                        : new Date(r.deadline).toLocaleDateString()}
                    </p>
                    <a
                      href={`/requests/${r.request_id}`}
                      style={{
                        display: "block",
                        textAlign: "center",
                        background: "#C0392B",
                        color: "white",
                        padding: "7px 14px",
                        borderRadius: 8,
                        textDecoration: "none",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      View Details →
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Sidebar */}
        <div
          className="flex flex-col w-full lg:w-80 lg:border-l border-gray-100
            bg-white overflow-hidden min-h-0 max-h-[45vh] lg:max-h-none shrink-0"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {filtered.length} Active Request{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                No requests match your filters
              </div>
            ) : (
              filtered.map((r) => (
                <Link
                  key={r.request_id}
                  to={`/requests/${r.request_id}`}
                  className={`block px-4 py-4 border-b border-gray-50
                              hover:bg-gray-50 transition-colors no-underline
                              ${selected?.request_id === r.request_id ? "bg-red-50" : ""}`}
                  onClick={() => setSelected(r)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono font-bold text-red-700
                                        bg-red-50 px-2 py-0.5 rounded text-sm"
                        style={{ fontFamily: "var(--font-code)" }}
                      >
                        {r.blood_group}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5
                                        rounded-full border
                                        ${urgencyBadge[r.urgency_label] || "bg-gray-50 text-gray-500 border-gray-200"}`}
                      >
                        {r.urgency_label || "OPEN"}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1 shrink-0">
                      <Clock size={10} />
                      {r.hours_remaining !== undefined
                        ? `${r.hours_remaining}h`
                        : "—"}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mb-0.5">
                    {r.hospital_name}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={10} />
                    {r.address || "Location not specified"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {r.quantity} unit{r.quantity > 1 ? "s" : ""} needed
                  </p>
                </Link>
              ))
            )}
          </div>

          {/* Legend */}
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p
              className="text-[10px] font-semibold text-gray-400 uppercase
                          tracking-wider mb-2"
            >
              Urgency Legend
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                ["CRITICAL", "#C0392B"],
                ["URGENT", "#D35400"],
                ["MODERATE", "#2471A3"],
                ["NORMAL", "#1E8449"],
              ].map(([l, c]) => (
                <div key={l} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: c }}
                  />
                  <span className="text-[10px] text-gray-600 font-medium">
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
