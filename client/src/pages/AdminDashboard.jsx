import { useEffect, useState } from "react";
import { LayoutDashboard, Users, Hospital, FileText, Mail } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Spinner from "../components/ui/Spinner";
import AdminOverview from "../components/admin/AdminOverview";
import PendingHospitals from "../components/admin/PendingHospitals";
import DonorList from "../components/admin/DonorList";
import RequestList from "../components/admin/RequestList";
import EmailLogList from "../components/admin/EmailLogList";
import api from "../api/axios";

const navItems = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={15} /> },
  { id: "hospitals", label: "Verify Hospitals", icon: <Hospital size={15} /> },
  { id: "donors", label: "Donors", icon: <Users size={15} /> },
  { id: "requests", label: "All Requests", icon: <FileText size={15} /> },
  { id: "emails", label: "Email Logs", icon: <Mail size={15} /> },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [pendingHospitals, setPendingHospitals] = useState([]);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [
          statsResponse,
          donorsResponse,
          requestsResponse,
          hospitalsResponse,
          emailsResponse,
        ] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/donors"),
          api.get("/admin/requests"),
          api.get("/admin/hospitals/pending"),
          api.get("/admin/email-logs"),
        ]);

        setStats(statsResponse.data);
        setDonors(donorsResponse.data.donors || []);
        setRequests(requestsResponse.data.requests || []);
        setPendingHospitals(hospitalsResponse.data.hospitals || []);
        setEmails(emailsResponse.data.logs || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const verifyHospital = async (id) => {
    try {
      const { data } = await api.patch(`/admin/hospitals/${id}/verify`);
      setPendingHospitals((hospitals) =>
        hospitals.filter((hospital) => hospital.hospital_id !== id),
      );
      setStats(
        (currentStats) =>
          currentStats && {
            ...currentStats,
            pending_hospitals: currentStats.pending_hospitals - 1,
            verified_hospitals: currentStats.verified_hospitals + 1,
          },
      );
      showToast(`${data.hospital.hospital_name} verified`);
    } catch {
      showToast("Verification failed");
    }
  };

  const rejectHospital = async (id, name) => {
    if (!window.confirm(`Remove ${name}?`)) return;

    try {
      await api.delete(`/admin/hospitals/${id}`);
      setPendingHospitals((hospitals) =>
        hospitals.filter((hospital) => hospital.hospital_id !== id),
      );
      setStats(
        (currentStats) =>
          currentStats && {
            ...currentStats,
            pending_hospitals: Math.max(0, currentStats.pending_hospitals - 1),
          },
      );
      showToast(`${name} removed`);
    } catch {
      showToast("Failed to remove");
    }
  };

  const deleteDonor = async (id, name) => {
    if (!window.confirm(`Remove donor ${name}?`)) return;

    try {
      await api.delete(`/admin/donors/${id}`);
      setDonors((currentDonors) =>
        currentDonors.filter((donor) => donor.donor_id !== id),
      );
      showToast(`${name} removed`);
    } catch {
      showToast("Failed to remove donor");
    }
  };

  const cancelRequest = async (id) => {
    if (!window.confirm("Cancel this request?")) return;

    try {
      await api.patch(`/admin/requests/${id}/cancel`);
      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.request_id === id
            ? { ...request, status: "cancelled" }
            : request,
        ),
      );
      showToast("Request cancelled");
    } catch {
      showToast("Failed to cancel");
    }
  };

  const navigationItems = navItems.map((item) =>
    item.id === "hospitals"
      ? { ...item, badge: pendingHospitals.length }
      : { ...item, badge: 0 },
  );

  if (loading) {
    return (
      <DashboardLayout
        role="admin"
        roleColor="bg-purple-50 text-purple-700"
        navItems={navigationItems}
        activeTab={tab}
        onTabChange={setTab}
      >
        <Spinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role="admin"
      roleColor="bg-purple-50 text-purple-700"
      navItems={navigationItems}
      activeTab={tab}
      onTabChange={setTab}
      userDetail="Platform Administrator"
    >
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-2xl">
          {toast}
        </div>
      )}

      {tab === "overview" && stats && (
        <AdminOverview
          stats={stats}
          pending={pendingHospitals}
          onReviewHospitals={() => setTab("hospitals")}
          onVerify={verifyHospital}
          onReject={rejectHospital}
        />
      )}
      {tab === "hospitals" && (
        <PendingHospitals
          hospitals={pendingHospitals}
          onVerify={verifyHospital}
          onReject={rejectHospital}
        />
      )}
      {tab === "donors" && <DonorList donors={donors} onDelete={deleteDonor} />}
      {tab === "requests" && (
        <RequestList requests={requests} onCancel={cancelRequest} />
      )}
      {tab === "emails" && <EmailLogList emails={emails} />}
    </DashboardLayout>
  );
}
