import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Users, Hospital, FileText, Mail,
  ShieldCheck, ShieldX, Trash2, AlertCircle, CheckCircle2,
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Spinner from '../components/ui/Spinner'
import api from '../api/axios'

const navItems = [
  { id: 'overview',  label: 'Overview',         icon: <LayoutDashboard size={15} />, badge: 0 },
  { id: 'hospitals', label: 'Verify Hospitals',  icon: <Hospital size={15} />,        badge: 0 },
  { id: 'donors',    label: 'Donors',            icon: <Users size={15} />,           badge: 0 },
  { id: 'requests',  label: 'All Requests',      icon: <FileText size={15} />,        badge: 0 },
  { id: 'emails',    label: 'Email Logs',        icon: <Mail size={15} />,            badge: 0 },
]

const statusBadge = {
  open:      'bg-blue-100 text-blue-700',
  fulfilled: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-600',
}

export default function AdminDashboard() {
  const [tab,      setTab]     = useState('overview')
  const [stats,    setStats]   = useState(null)
  const [donors,   setDonors]  = useState([])
  const [requests, setReqs]    = useState([])
  const [pending,  setPending] = useState([])
  const [emails,   setEmails]  = useState([])
  const [loading,  setLoading] = useState(true)
  const [toast,    setToast]   = useState('')

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [sRes, dRes, rRes, pRes, eRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/donors'),
        api.get('/admin/requests'),
        api.get('/admin/hospitals/pending'),
        api.get('/admin/email-logs'),
      ])
      setStats(sRes.data)
      setDonors(dRes.data.donors || [])
      setReqs(rRes.data.requests || [])
      setPending(pRes.data.hospitals || [])
      setEmails(eRes.data.logs || [])
      navItems[1].badge = pRes.data.total || 0
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const verifyHospital = async id => {
    try {
      const { data } = await api.patch(`/admin/hospitals/${id}/verify`)
      setPending(p => p.filter(h => h.hospital_id !== id))
      showToast(`${data.hospital.hospital_name} verified`)
      navItems[1].badge = Math.max(0, (navItems[1].badge || 0) - 1)
      if (stats) setStats(s => ({ ...s, pending_hospitals: s.pending_hospitals - 1,
                                         verified_hospitals: s.verified_hospitals + 1 }))
    } catch { showToast('Verification failed') }
  }

  const rejectHospital = async (id, name) => {
    if (!window.confirm(`Remove ${name}?`)) return
    try {
      await api.delete(`/admin/hospitals/${id}`)
      setPending(p => p.filter(h => h.hospital_id !== id))
      showToast(`${name} removed`)
    } catch { showToast('Failed to remove') }
  }

  const deleteDonor = async (id, name) => {
    if (!window.confirm(`Remove donor ${name}?`)) return
    try {
      await api.delete(`/admin/donors/${id}`)
      setDonors(d => d.filter(x => x.donor_id !== id))
      showToast(`${name} removed`)
    } catch { showToast('Failed to remove donor') }
  }

  const cancelRequest = async id => {
    if (!window.confirm('Cancel this request?')) return
    try {
      await api.patch(`/admin/requests/${id}/cancel`)
      setReqs(r => r.map(x => x.request_id === id ? { ...x, status:'cancelled' } : x))
      showToast('Request cancelled')
    } catch { showToast('Failed to cancel') }
  }

  if (loading) return (
    <DashboardLayout role="admin" roleColor="bg-purple-50 text-purple-700"
      navItems={navItems} activeTab={tab} onTabChange={setTab}>
      <Spinner />
    </DashboardLayout>
  )

  return (
    <DashboardLayout
      role="admin"
      roleColor="bg-purple-50 text-purple-700"
      navItems={navItems}
      activeTab={tab}
      onTabChange={setTab}
      userDetail="Platform Administrator"
    >
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white
                        text-sm px-4 py-3 rounded-xl shadow-2xl">
          {toast}
        </div>
      )}

      {/* ── OVERVIEW ───────────────────────────────────────── */}
      {tab === 'overview' && stats && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label:'Total Donors',        value: stats.total_donors,       color:'text-red-600 bg-red-50',    icon: Users          },
              { label:'Active Requests',     value: stats.active_requests,    color:'text-blue-600 bg-blue-50',  icon: FileText       },
              { label:'Total Donations',     value: stats.total_donations,    color:'text-green-600 bg-green-50',icon: CheckCircle2   },
              { label:'Verified Hospitals',  value: stats.verified_hospitals, color:'text-green-600 bg-green-50',icon: ShieldCheck    },
              { label:'Pending Verification',value: stats.pending_hospitals,  color:'text-orange-600 bg-orange-50',icon: AlertCircle  },
              { label:'Emails Sent',         value: stats.total_emails_sent,  color:'text-purple-600 bg-purple-50',icon: Mail         },
            ].map(s => (
              <div key={s.label}
                className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className={`w-8 h-8 rounded-xl flex items-center
                                  justify-center mb-3 ${s.color}`}>
                  <s.icon size={15} />
                </div>
                <div className="font-mono text-2xl font-bold text-gray-900 mb-0.5"
                     style={{ fontFamily: 'var(--font-code)' }}>
                  {s.value}
                </div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Pending hospitals quick card */}
          {pending.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-orange-900 text-sm flex items-center gap-2">
                  <AlertCircle size={15} />
                  {pending.length} hospital{pending.length > 1 ? 's' : ''} awaiting verification
                </h3>
                <button onClick={() => setTab('hospitals')}
                  className="text-xs text-orange-700 font-semibold hover:underline">
                  Review all
                </button>
              </div>
              {pending.slice(0, 2).map(h => (
                <div key={h.hospital_id}
                  className="flex items-center justify-between bg-white
                             rounded-xl px-4 py-3 mb-2 last:mb-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{h.hospital_name}</p>
                    <p className="text-xs text-gray-400">{h.license_no} · {h.address}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => verifyHospital(h.hospital_id)}
                      className="flex items-center gap-1 bg-green-700 hover:bg-green-800
                                 text-white text-xs font-semibold px-3 py-1.5
                                 rounded-lg transition-all">
                      <ShieldCheck size={12} /> Verify
                    </button>
                    <button onClick={() => rejectHospital(h.hospital_id, h.hospital_name)}
                      className="flex items-center gap-1 bg-red-50 hover:bg-red-100
                                 text-red-700 text-xs font-semibold px-3 py-1.5
                                 rounded-lg transition-all">
                      <ShieldX size={12} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── HOSPITALS ──────────────────────────────────────── */}
      {tab === 'hospitals' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-gray-900">
            Pending Hospital Verifications
          </h2>
          {pending.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
              <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-600 text-sm">All caught up</h3>
              <p className="text-xs text-gray-400 mt-1">No hospitals pending verification.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Hospital','License No.','Email','Phone','Address','Registered','Actions'].map(h => (
                        <th key={h} className="text-left text-[11px] font-semibold
                                               text-gray-400 px-5 py-3 uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pending.map(h => (
                      <tr key={h.hospital_id}
                        className="border-t border-gray-50 hover:bg-gray-50">
                        <td className="px-5 py-4 font-semibold text-gray-800">
                          {h.hospital_name}
                        </td>
                        <td className="px-5 py-4 font-mono text-[11px] text-gray-500"
                            style={{ fontFamily: 'var(--font-code)' }}>
                          {h.license_no}
                        </td>
                        <td className="px-5 py-4 text-gray-600 text-xs">{h.email}</td>
                        <td className="px-5 py-4 text-gray-500 text-xs">{h.phone || '—'}</td>
                        <td className="px-5 py-4 text-gray-500 text-xs">{h.address || '—'}</td>
                        <td className="px-5 py-4 text-[11px] text-gray-400">
                          {new Date(h.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => verifyHospital(h.hospital_id)}
                              className="flex items-center gap-1 bg-green-700 hover:bg-green-800
                                         text-white text-xs font-semibold px-2.5 py-1.5
                                         rounded-lg transition-all">
                              <ShieldCheck size={11} /> Verify
                            </button>
                            <button onClick={() => rejectHospital(h.hospital_id, h.hospital_name)}
                              className="flex items-center gap-1 bg-red-50 hover:bg-red-100
                                         text-red-700 text-xs font-semibold px-2.5 py-1.5
                                         rounded-lg border border-red-200 transition-all">
                              <ShieldX size={11} /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── DONORS ─────────────────────────────────────────── */}
      {tab === 'donors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">
              All Donors ({donors.length})
            </h2>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Name','Email','Blood','Address','Status','Donations','Joined',''].map(h => (
                      <th key={h} className="text-left text-[11px] font-semibold
                                             text-gray-400 px-5 py-3 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {donors.map(d => (
                    <tr key={d.donor_id}
                      className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-medium text-gray-800">{d.full_name}</td>
                      <td className="px-5 py-4 text-gray-500 text-xs">{d.email}</td>
                      <td className="px-5 py-4">
                        <span className="font-mono font-bold text-red-700 bg-red-50
                                          px-2 py-0.5 rounded text-xs"
                              style={{ fontFamily: 'var(--font-code)' }}>
                          {d.blood_group}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs">{d.address || '—'}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full
                                          ${d.is_active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-500'}`}>
                          {d.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-gray-700"
                          style={{ fontFamily: 'var(--font-code)' }}>
                        {d.total_donations || 0}
                      </td>
                      <td className="px-5 py-4 text-[11px] text-gray-400">
                        {new Date(d.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => deleteDonor(d.donor_id, d.full_name)}
                          className="p-1.5 text-gray-300 hover:text-red-500
                                     hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── REQUESTS ───────────────────────────────────────── */}
      {tab === 'requests' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-gray-900">
            All Requests ({requests.length})
          </h2>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['ID','Blood','Hospital','Qty','Alerted','Deadline','Status',''].map(h => (
                      <th key={h} className="text-left text-[11px] font-semibold
                                             text-gray-400 px-5 py-3 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requests.map(r => (
                    <tr key={r.request_id}
                      className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-mono text-[11px] text-gray-400"
                          style={{ fontFamily: 'var(--font-code)' }}>
                        #{r.request_id}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono font-bold text-red-700 bg-red-50
                                          px-2 py-0.5 rounded text-xs"
                              style={{ fontFamily: 'var(--font-code)' }}>
                          {r.blood_group}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium text-gray-800 text-sm">
                        {r.hospital_name}
                      </td>
                      <td className="px-5 py-4 text-gray-600">{r.quantity}</td>
                      <td className="px-5 py-4 text-gray-600">
                        {r.donors_alerted || 0}
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500">
                        {new Date(r.deadline).toLocaleDateString('en-NP', {
                          day:'numeric', month:'short',
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[11px] font-semibold px-2 py-0.5
                                          rounded-full ${statusBadge[r.status] || 'bg-gray-100 text-gray-600'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {r.status === 'open' && (
                          <button onClick={() => cancelRequest(r.request_id)}
                            className="text-xs text-red-600 font-medium hover:underline">
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── EMAIL LOGS ─────────────────────────────────────── */}
      {tab === 'emails' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-gray-900">
            Email Logs (last 100)
          </h2>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Donor','Email','Blood','Hospital','Sent At','Status'].map(h => (
                      <th key={h} className="text-left text-[11px] font-semibold
                                             text-gray-400 px-5 py-3 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {emails.map((e, i) => (
                    <tr key={i}
                      className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-medium text-gray-800">{e.donor_name}</td>
                      <td className="px-5 py-4 text-gray-500 text-xs">{e.donor_email}</td>
                      <td className="px-5 py-4">
                        <span className="font-mono font-bold text-red-700 bg-red-50
                                          px-2 py-0.5 rounded text-xs"
                              style={{ fontFamily: 'var(--font-code)' }}>
                          {e.blood_group}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-sm">{e.hospital_name}</td>
                      <td className="px-5 py-4 text-xs text-gray-400">
                        {new Date(e.sent_at).toLocaleString('en-NP', {
                          day:'numeric', month:'short', hour:'2-digit', minute:'2-digit',
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full
                                          ${e.delivery_status === 'sent'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'}`}>
                          {e.delivery_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}