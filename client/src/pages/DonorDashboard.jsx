import { useEffect, useState } from "react";
import { Activity, CheckCircle2, Droplets } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Spinner from "../components/ui/Spinner";
import DonorOverview from "../components/donor/DonorOverview";
import DonorHistory from "../components/donor/DonorHistory";
import DonorRequests from "../components/donor/DonorRequests";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { id: "overview", label: "Overview", icon: <Activity size={15} /> },
  {
    id: "history",
    label: "Donation History",
    icon: <CheckCircle2 size={15} />,
  },
  { id: "requests", label: "Nearby Requests", icon: <Droplets size={15} /> },
];

export default function DonorDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("overview");
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [profileResponse, historyResponse, requestsResponse] =
          await Promise.all([
            api.get("/donors/me"),
            api.get("/donors/me/history"),
            api.get("/requests/active"),
          ]);

        const donorProfile = profileResponse.data;
        setProfile(donorProfile);
        setHistory(historyResponse.data.history || []);
        setRequests(
          (requestsResponse.data.requests || []).filter(
            (request) => request.blood_group === donorProfile.blood_group,
          ),
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const toggleStatus = async () => {
    setToggling(true);
    try {
      const { data } = await api.patch("/donors/me/status");
      setProfile((currentProfile) => ({
        ...currentProfile,
        is_active: data.is_active,
      }));
      showToast(data.message);
    } catch {
      showToast("Failed to update status");
    } finally {
      setToggling(false);
    }
  };

  const dashboardNavItems = navItems.map((item) =>
    item.id === "requests"
      ? { ...item, badge: requests.length }
      : { ...item, badge: 0 },
  );

  const layoutProps = {
    role: "donor",
    roleColor: "bg-red-50 text-red-700",
    navItems: dashboardNavItems,
    activeTab: tab,
    onTabChange: setTab,
    userDetail: `Blood Group: ${profile?.blood_group || user?.blood_group || "—"}`,
  };

  if (loading) {
    return (
      <DashboardLayout {...layoutProps}>
        <Spinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout {...layoutProps}>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-2xl">
          {toastMessage}
        </div>
      )}
      {tab === "overview" && (
        <DonorOverview
          profile={profile}
          history={history}
          requests={requests}
          toggling={toggling}
          onToggleStatus={toggleStatus}
          onTabChange={setTab}
        />
      )}
      {tab === "history" && <DonorHistory history={history} />}
      {tab === "requests" && (
        <DonorRequests requests={requests} bloodGroup={profile?.blood_group} />
      )}
    </DashboardLayout>
  );
}
