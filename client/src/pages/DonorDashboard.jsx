import { useState, useEffect } from 'react'
import {
  Droplets, Activity, Clock, CheckCircle2, ToggleLeft,
  ToggleRight, MapPin, Calendar, Plus, AlertCircle,
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Spinner from '../components/ui/Spinner'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const navItems = [
  { id: 'overview', label: 'Overview', icon: <Activity size={15} />, badge: 0 },
  { id: 'history', label: 'Donation History', icon: <CheckCircle2 size={15} />, badge: 0 },
  { id: 'requests', label: 'Nearby Requests', icon: <Droplets size={15} />, badge: 0 },
]

const urgencyColor = {
  CRITICAL: 'bg-red-100 text-red-700',
  URGENT: 'bg-orange-100 text-orange-700',
  MODERATE: 'bg-blue-100 text-blue-700',
  NORMAL: 'bg-green-100 text-green-700',
}

export default function DonorDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('overview')
  const [profile, setProfile] = useState(null)
  const [history, setHistory] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const toast = msg => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000) }

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [pRes, hRes, rRes] = await Promise.all([
        api.get('/donors/me'),
        api.get('/donors/me/history'),
        api.get('/requests/active'),
      ])
      setProfile(pRes.data)
      setHistory(hRes.data.history || [])
      // Only requests matching donor's blood group
      const compatible = rRes.data.requests?.filter(
        r => r.blood_group === pRes.data.blood_group
      ) || []
      setRequests(compatible)
      navItems[2].badge = compatible.length
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async () => {
    setToggling(true)
    try {
      const { data } = await api.patch('/donors/me/status')
      setProfile(p => ({ ...p, is_active: data.is_active }))
      toast(data.message)
    } catch {
      toast('Failed to update status')
    } finally {
      setToggling(false)
    }
  }

  if (loading) return <DashboardLayout role="donor" roleColor="bg-red-50 text-red-700"
    navItems={navItems} activeTab={tab} onTabChange={setTab}
    userDetail={`Blood Group: ${user?.blood_group || '—'}`}>
    <Spinner />
  </DashboardLayout>

  return (
    <DashboardLayout
      role="donor"
      roleColor="bg-red-50 text-red-700"
      navItems={navItems}
      activeTab={tab}
      onTabChange={setTab}
      userDetail={`Blood Group: ${profile?.blood_group || '—'}`}
    >
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white
                        text-sm px-4 py-3 rounded-xl shadow-2xl">
          {toastMsg}
        </div>
      )}

      {/* ── OVERVIEW ───────────────────────────────────────── */}
      {tab === 'overview' && (
        <div className="space-y-5">

          {/* Status + blood group hero */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6
                          flex flex-col md:flex-row md:items-center
                          justify-between gap-5">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase
                            tracking-wider mb-2">
                Your Donor Profile
              </p>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {profile?.full_name}
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono font-bold text-red-700 bg-red-50
                                  px-3 py-1 rounded-lg text-lg"
                  style={{ fontFamily: 'var(--font-code)' }}>
                  {profile?.blood_group}
                </span>
                {profile?.address && (
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={13} /> {profile.address}
                  </span>
                )}
              </div>
            </div>

            {/* Availability toggle */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Availability
              </p>
              <button
                onClick={toggleStatus}
                disabled={toggling}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl
                            font-semibold text-sm transition-all border-2
                            ${profile?.is_active
                    ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                  } ${toggling ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {profile?.is_active
                  ? <><ToggleRight size={20} className="text-green-600" /> Active — Receiving Alerts</>
                  : <><ToggleLeft size={20} className="text-gray-400" /> Inactive — Not Receiving</>
                }
              </button>
              <p className="text-[11px] text-gray-400 text-center">
                {profile?.is_active
                  ? 'You receive email alerts for matching requests'
                  : 'Toggle on to start receiving donation alerts'}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Donations', value: history.length,
                icon: CheckCircle2, color: 'text-green-600 bg-green-50'
              },
              {
                label: 'Matching Requests', value: requests.length,
                icon: Droplets, color: 'text-red-600 bg-red-50'
              },
              {
                label: 'Blood Group', value: profile?.blood_group || '—',
                icon: Activity, color: 'text-red-600 bg-red-50', mono: true
              },
              {
                label: 'Status', value: profile?.is_active ? 'Active' : 'Inactive',
                icon: Clock,
                color: profile?.is_active ? 'text-green-600 bg-green-50' : 'text-gray-500 bg-gray-50'
              },
            ].map(s => (
              <div key={s.label}
                className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className={`w-8 h-8 rounded-xl flex items-center
                                  justify-center mb-3 ${s.color}`}>
                  <s.icon size={15} />
                </div>
                <div className={`text-2xl font-bold text-gray-900 mb-0.5 ${s.mono ? 'font-mono' : ''}`}
                  style={s.mono ? { fontFamily: 'var(--font-code)' } : {}}>
                  {s.value}
                </div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Nearby compatible requests */}
          {requests.length > 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-sm">
                  Requests matching your blood group
                </h3>
                <button onClick={() => setTab('requests')}
                  className="text-xs text-red-600 font-medium hover:underline">
                  See all
                </button>
              </div>
              <div className="space-y-3">
                {requests.slice(0, 3).map(r => (
                  <Link key={r.request_id} to={`/requests/${r.request_id}`}
                    className="flex items-center justify-between p-3.5
                               border border-gray-100 rounded-xl hover:border-red-200
                               hover:bg-red-50/30 transition-all no-underline group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center
                                      justify-center group-hover:bg-red-100 transition-colors">
                        <Droplets size={17} className="text-red-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          {r.hospital_name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {r.address || 'Location not specified'} ·{' '}
                          {r.quantity} unit{r.quantity > 1 ? 's' : ''} needed
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5
                                        rounded-full ${urgencyColor[r.urgency_label] || 'bg-gray-100 text-gray-600'}`}>
                        {r.urgency_label || 'OPEN'}
                      </span>
                      <span className="font-mono font-bold text-red-700 bg-red-50
                                        px-2 py-0.5 rounded text-xs"
                        style={{ fontFamily: 'var(--font-code)' }}>
                        {r.blood_group}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
              <CheckCircle2 size={36} className="text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700 text-sm">
                No active requests for {profile?.blood_group}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                You'll get an email alert the moment one is posted.
              </p>
            </div>
          )}

          {/* Recent history */}
          {history.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-sm">
                  Recent donations
                </h3>
                <button onClick={() => setTab('history')}
                  className="text-xs text-red-600 font-medium hover:underline">
                  See all
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Hospital', 'Blood Group', 'Date'].map(h => (
                        <th key={h} className="text-left text-[11px] font-semibold
                                               text-gray-400 pb-3 pr-4 uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice(0, 3).map((d, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0
                                             hover:bg-gray-50 transition-colors">
                        <td className="py-3 pr-4 font-medium text-gray-800 text-sm">
                          {d.hospital_name || '—'}
                        </td>
                        <td className="py-3 pr-4">
                          <span className="font-mono font-bold text-red-700
                                            bg-red-50 px-2 py-0.5 rounded text-xs"
                            style={{ fontFamily: 'var(--font-code)' }}>
                            {d.blood_group}
                          </span>
                        </td>
                        <td className="py-3 text-gray-500 text-xs">
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {new Date(d.donated_at).toLocaleDateString('en-NP', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                          </span>
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

      {/* ── HISTORY ────────────────────────────────────────── */}
      {tab === 'history' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-gray-900">Donation History</h2>

          {history.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
              <Droplets size={40} className="text-red-200 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-600 text-sm">No donations yet</h3>
              <p className="text-xs text-gray-400 mt-1">
                After you confirm a donation at a hospital, it'll appear here.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['#', 'Hospital', 'Blood Group', 'Address', 'Date', 'Notes'].map(h => (
                        <th key={h} className="text-left text-[11px] font-semibold
                                               text-gray-400 px-5 py-3 uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((d, i) => (
                      <tr key={i} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 text-gray-400 text-[11px] font-mono"
                          style={{ fontFamily: 'var(--font-code)' }}>
                          {i + 1}
                        </td>
                        <td className="px-5 py-4 font-medium text-gray-800">
                          {d.hospital_name || '—'}
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-mono font-bold text-red-700
                                            bg-red-50 px-2 py-0.5 rounded text-xs"
                            style={{ fontFamily: 'var(--font-code)' }}>
                            {d.blood_group}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-500 text-xs">
                          {d.request_address || '—'}
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-500">
                          {new Date(d.donated_at).toLocaleDateString('en-NP', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-400">
                          {d.notes || '—'}
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

      {/* ── NEARBY REQUESTS ────────────────────────────────── */}
      {tab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Requests matching your blood group
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Blood group:{' '}
                <span className="font-mono font-bold text-red-700"
                  style={{ fontFamily: 'var(--font-code)' }}>
                  {profile?.blood_group}
                </span>
              </p>
            </div>
            <Link to="/map"
              className="flex items-center gap-1.5 border border-gray-200
                         text-sm font-medium px-3 py-2 rounded-xl hover:border-red-300
                         hover:text-red-600 transition-all no-underline text-gray-700">
              <MapPin size={14} /> Open Map
            </Link>
          </div>

          {requests.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
              <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-600 text-sm">
                No active requests for {profile?.blood_group}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                You'll get an email alert the moment one is posted.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map(r => (
                <Link key={r.request_id} to={`/requests/${r.request_id}`}
                  className="flex items-center justify-between bg-white
                             border border-gray-100 rounded-2xl p-5
                             hover:border-red-200 hover:shadow-lg hover:shadow-red-50/60
                             transition-all no-underline group">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center
                                    justify-center group-hover:bg-red-100 transition-colors">
                      <Droplets size={20} className="text-red-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {r.hospital_name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <MapPin size={11} />
                          {r.address || 'Location not specified'}
                        </span>
                        <span>·</span>
                        <span>{r.quantity} unit{r.quantity > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className={`text-[11px] font-bold px-2.5 py-1
                                        rounded-full block mb-1.5
                                        ${urgencyColor[r.urgency_label] || 'bg-gray-100 text-gray-600'}`}>
                        {r.urgency_label || 'OPEN'}
                      </span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Clock size={10} />
                        {r.hours_remaining !== undefined
                          ? `${r.hours_remaining}h left`
                          : new Date(r.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-red-700 bg-red-50
                                      px-2.5 py-1.5 rounded-lg text-sm"
                      style={{ fontFamily: 'var(--font-code)' }}>
                      {r.blood_group}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}