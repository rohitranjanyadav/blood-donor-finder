import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CheckCircle2, MapPin, AlertCircle } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: '/assets/markers/marker-me.svg',
  iconRetinaUrl: '/assets/markers/marker-me.svg',
  shadowUrl: '',
})

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
const CENTER = [27.7172, 85.3240]

function LocationPicker({ onPick }) {
  useMapEvents({ click: e => onPick(e.latlng) })
  return null
}

export default function PostRequest() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    blood_group: '',
    quantity: 1,
    deadline: '',
    hospital_name: user?.hospital_name || '',
    address: '',
    notes: '',
  })
  const [pin, setPin] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    if (!form.blood_group) { setError('Select the required blood group'); return }
    if (!form.deadline) { setError('Set a deadline for the request'); return }
    setError('')
    setLoading(true)
    try {
      const payload = {
        ...form,
        quantity: parseInt(form.quantity),
        latitude: pin?.lat || null,
        longitude: pin?.lng || null,
      }
      const { data } = await api.post('/requests', payload)
      setSuccess(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post request')
    } finally {
      setLoading(false)
    }
  }

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
        style={{ fontFamily: 'var(--font-body)' }}>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm
                        p-10 max-w-md w-full text-center">
          <img
            src="/assets/illustrations/success.svg"
            alt=""
            aria-hidden="true"
            className="w-32 h-32 mx-auto mb-2"
          />
          <CheckCircle2 size={52} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Request posted
          </h2>
          <p className="text-gray-500 text-sm mb-2">
            <span className="font-semibold text-red-700">
              {success.donors_alerted} donor{success.donors_alerted !== 1 ? 's' : ''}
            </span>{' '}
            with blood group{' '}
            <span className="font-mono font-bold text-red-700"
              style={{ fontFamily: 'var(--font-code)' }}>
              {form.blood_group}
            </span>{' '}
            have been alerted via email.
          </p>

          {success.nearest_donor?.name && (
            <p className="text-xs text-gray-400 mb-6">
              Nearest donor: {success.nearest_donor.name}
              {success.nearest_donor.distance_km &&
                ` — ${success.nearest_donor.distance_km} km away`}
            </p>
          )}

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-left mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase
                          tracking-wider mb-2">
              Priority
            </p>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold px-3 py-1 rounded-full
                                ${success.priority?.urgency_label === 'CRITICAL'
                  ? 'bg-red-100 text-red-700'
                  : success.priority?.urgency_label === 'URGENT'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-blue-100 text-blue-700'}`}>
                {success.priority?.urgency_label || 'OPEN'}
              </span>
              <span className="text-xs text-gray-500">
                {success.priority?.hours_remaining}h remaining
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate('/map')}
              className="flex-1 border border-gray-200 text-sm font-semibold
                         py-2.5 rounded-xl hover:border-red-200 hover:text-red-600
                         transition-all text-gray-700">
              View on Map
            </button>
            <button
              onClick={() => navigate(`/requests/${success.request.request_id}`)}
              className="flex-1 bg-red-700 hover:bg-red-800 text-white text-sm
                         font-semibold py-2.5 rounded-xl transition-all">
              View Request
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10"
      style={{ fontFamily: 'var(--font-body)' }}>
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Post an urgent blood request
          </h1>
          <p className="text-gray-500 text-sm">
            Matching donors will receive an email alert within 60 seconds.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 text-red-800
                          text-sm px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">

          {/* Blood group */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Required Blood Group <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_GROUPS.map(bg => (
                <button key={bg} type="button"
                  onClick={() => setForm(f => ({ ...f, blood_group: bg }))}
                  className={`py-3 rounded-xl text-sm font-bold border-2 transition-all
                              ${form.blood_group === bg
                      ? 'bg-red-700 border-red-700 text-white shadow-lg shadow-red-100'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-red-300'}`}>
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm">Request Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Quantity (units)
                </label>
                <input type="number" name="quantity" min={1} max={10}
                  value={form.quantity} onChange={handle}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5
                             text-sm focus:outline-none focus:ring-2
                             focus:ring-red-500/20 focus:border-red-400 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Deadline <span className="text-red-600">*</span>
                </label>
                <input type="datetime-local" name="deadline"
                  value={form.deadline} onChange={handle} required
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5
                             text-sm focus:outline-none focus:ring-2
                             focus:ring-red-500/20 focus:border-red-400 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Hospital Name
              </label>
              <input name="hospital_name" value={form.hospital_name} onChange={handle}
                placeholder="Bir Hospital, Kathmandu"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5
                           text-sm focus:outline-none focus:ring-2
                           focus:ring-red-500/20 focus:border-red-400 transition-all" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Address
              </label>
              <input name="address" value={form.address} onChange={handle}
                placeholder="Ward No. 3, Mahaboudha, Kathmandu"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5
                           text-sm focus:outline-none focus:ring-2
                           focus:ring-red-500/20 focus:border-red-400 transition-all" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Notes for donors
              </label>
              <textarea name="notes" value={form.notes} onChange={handle} rows={3}
                placeholder="Patient in ICU, contact Dr. Sharma on arrival..."
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5
                           text-sm focus:outline-none focus:ring-2
                           focus:ring-red-500/20 focus:border-red-400 transition-all resize-none" />
            </div>
          </div>

          {/* Location picker */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  Pin Location on Map
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Click the map to set the hospital location. Used to notify nearby donors first.
                </p>
              </div>
              {pin && (
                <div className="flex items-center gap-1.5 text-xs text-green-700
                                bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                  <MapPin size={11} />
                  Pinned
                </div>
              )}
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-100"
              style={{ height: 260 }}>
              <MapContainer center={CENTER} zoom={12}
                style={{ width: '100%', height: '100%' }}>
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker onPick={latlng => setPin(latlng)} />
                {pin && <Marker position={[pin.lat, pin.lng]} />}
              </MapContainer>
            </div>
            {pin && (
              <p className="text-[11px] text-gray-400 mt-2 font-mono"
                style={{ fontFamily: 'var(--font-code)' }}>
                {pin.lat.toFixed(5)}, {pin.lng.toFixed(5)}
              </p>
            )}
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold
                       py-3.5 rounded-xl transition-all shadow-lg shadow-red-100
                       disabled:opacity-70 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor"
                    strokeWidth="3" strokeDasharray="30 70" />
                </svg>
                Posting & Alerting Donors...
              </>
            ) : 'Post Request & Notify Donors'}
          </button>
        </form>
      </div>
    </div>
  )
}