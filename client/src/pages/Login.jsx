import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Droplets, Eye, EyeOff, ArrowLeft, Heart, Users, Hospital,
  CheckCircle2, AlertCircle,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

const roles = [
  { id: 'donor', label: 'Donor', sub: 'I want to donate', icon: Heart },
  { id: 'patient', label: 'Patient', sub: 'I need blood', icon: Users },
  { id: 'hospital', label: 'Hospital', sub: 'Representing a hospital', icon: Hospital },
]

const roleRedirect = {
  donor: '/dashboard',
  patient: '/my-requests',
  hospital: '/my-requests',
  admin: '/admin',
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const isRegister = window.location.pathname.includes('register')

  // Detect which register page we're on from URL
  const pathRole = window.location.pathname.includes('donor') ? 'donor'
    : window.location.pathname.includes('patient') ? 'patient'
      : window.location.pathname.includes('hospital') ? 'hospital'
        : null

  const [showPw, setShowPw] = useState(false)
  const [selectedRole, setSelectedRole] = useState(pathRole || 'donor')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [hospitalPending, setHospitalPending] = useState(false)

  const [form, setForm] = useState({
    email: '', password: '', confirm_password: '',
    full_name: '', phone: '', address: '',
    blood_group: '', hospital_name: '', license_no: '',
  })

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const view = pathRole !== null ? 'register' : 'login'

  const submit = async e => {
    e.preventDefault()
    setError('')

    if (view === 'register' && form.password !== form.confirm_password) {
      setError('Passwords do not match'); return
    }
    if (view === 'register' && selectedRole === 'donor' && !form.blood_group) {
      setError('Select your blood group'); return
    }

    setLoading(true)
    try {
      if (view === 'login') {
        const { data } = await api.post('/auth/login', {
          email: form.email, password: form.password,
        })
        login(data.user, data.token)
        setSuccess(true)
        setTimeout(() => navigate(roleRedirect[data.user.role] || '/'), 800)
      } else {
        const payload = selectedRole === 'donor'
          ? {
            full_name: form.full_name, email: form.email, password: form.password,
            blood_group: form.blood_group, phone: form.phone, address: form.address
          }
          : selectedRole === 'patient'
            ? { full_name: form.full_name, email: form.email, password: form.password, phone: form.phone }
            : {
              hospital_name: form.hospital_name, email: form.email, password: form.password,
              phone: form.phone, address: form.address, license_no: form.license_no
            }

        const { data } = await api.post(`/auth/register/${selectedRole}`, payload)

        if (selectedRole === 'hospital') {
          setHospitalPending(true)
        } else {
          login(data.user, data.token)
          setSuccess(true)
          setTimeout(() => navigate(roleRedirect[selectedRole]), 800)
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Hospital pending screen
  if (hospitalPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100
                        p-10 max-w-md w-full text-center">
          <CheckCircle2 size={52} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-3">Registration received</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your hospital account is pending admin verification.
            You can log in once approved — usually within 24 hours.
          </p>
          <Link to="/"
            className="inline-block bg-green-700 hover:bg-green-800 text-white
                       px-6 py-2.5 rounded-xl font-semibold text-sm
                       transition-colors no-underline">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: 'var(--font-body)' }}>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[42%] bg-red-600 flex-col justify-between p-12">
        <div>
          <Link to="/"
            className="flex items-center gap-2 text-red-300 hover:text-white
                       transition-colors mb-14 text-sm font-medium no-underline">
            <ArrowLeft size={14} />
            Back
          </Link>
          <div className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Droplets size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">BloodNet</span>
          </div>
          <h2 className="text-4xl text-white mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}>
            {view === 'login' ? 'Good to have\nyou back.' : 'Join the\nnetwork.'}
          </h2>
          <p className="text-red-200 text-base leading-relaxed max-w-xs">
            {view === 'login'
              ? 'Your dashboard is waiting. Sign in to see requests near you.'
              : 'Set up takes two minutes. Donors can respond to requests the same day.'}
          </p>
        </div>

        <div>
          {[['1,200+', 'Registered donors'], ['< 60s', 'Alert speed'], ['93%', 'Requests fulfilled']].map(([v, l]) => (
            <div key={l} className="flex items-center justify-between py-3.5
                                     border-b border-red-500/40 last:border-0">
              <span className="text-red-200 text-sm">{l}</span>
              <span className="font-mono font-bold text-white"
                style={{ fontFamily: 'var(--font-code)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-14 xl:px-20">
        <div className="max-w-md w-full mx-auto">

          <Link to="/"
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700
                       mb-8 lg:hidden text-sm no-underline">
            <ArrowLeft size={13} /> Back
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {view === 'login' ? 'Sign in' : 'Create account'}
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            {view === 'login' ? 'No account? ' : 'Already registered? '}
            <Link to={view === 'login' ? '/register/donor' : '/login'}
              className="text-red-600 font-semibold hover:underline no-underline">
              {view === 'login' ? 'Register here' : 'Sign in'}
            </Link>
          </p>

          {success ? (
            <div className="flex flex-col items-center py-14">
              <CheckCircle2 size={52} className="text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {view === 'login' ? 'Signed in' : 'Account created'}
              </h3>
              <p className="text-gray-500 text-sm">Taking you to your dashboard...</p>
            </div>
          ) : (
            <>
              {/* Role selector — only on register pages without a fixed role */}
              {view === 'register' && !pathRole && (
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Register as
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {roles.map(r => (
                      <button key={r.id} type="button"
                        onClick={() => setSelectedRole(r.id)}
                        className={`border-2 rounded-xl p-3 text-center transition-all
                                    ${selectedRole === r.id
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-100 hover:border-gray-200'}`}>
                        <r.icon size={18}
                          className={`mx-auto mb-1.5 ${selectedRole === r.id ? 'text-red-600' : 'text-gray-400'}`} />
                        <div className={`text-xs font-bold ${selectedRole === r.id ? 'text-red-700' : 'text-gray-600'}`}>
                          {r.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border-l-4 border-red-600
                                text-red-800 text-sm px-4 py-3 rounded-lg mb-5">
                  {error}
                </div>
              )}

              <form onSubmit={submit} className="space-y-4">
                {/* Register-only fields */}
                {view === 'register' && (
                  <>
                    {selectedRole === 'hospital' ? (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Hospital Name
                        </label>
                        <input name="hospital_name" value={form.hospital_name}
                          onChange={handle} required placeholder="Bir Hospital"
                          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5
                                     text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20
                                     focus:border-red-400 transition-all" />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Full Name
                        </label>
                        <input name="full_name" value={form.full_name}
                          onChange={handle} required placeholder="Ram Shrestha"
                          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5
                                     text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20
                                     focus:border-red-400 transition-all" />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Phone
                      </label>
                      <input name="phone" value={form.phone} onChange={handle}
                        placeholder="+977-98XXXXXXXX"
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5
                                   text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20
                                   focus:border-red-400 transition-all" />
                    </div>
                  </>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Email
                  </label>
                  <input type="email" name="email" value={form.email}
                    onChange={handle} required placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5
                               text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20
                               focus:border-red-400 transition-all" />
                </div>

                {/* Role-specific register fields */}
                {view === 'register' && selectedRole === 'donor' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        City / District
                      </label>
                      <input name="address" value={form.address} onChange={handle}
                        placeholder="Kathmandu, Bagmati"
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5
                                   text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20
                                   focus:border-red-400 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">
                        Blood Group <span className="text-red-600">*</span>
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {BLOOD_GROUPS.map(bg => (
                          <button key={bg} type="button"
                            onClick={() => setForm(f => ({ ...f, blood_group: bg }))}
                            className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all
                                        ${form.blood_group === bg
                                ? 'bg-red-700 border-red-700 text-white'
                                : 'bg-white border-gray-200 text-gray-700 hover:border-red-400'}`}>
                            {bg}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {view === 'register' && selectedRole === 'hospital' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Address
                      </label>
                      <input name="address" value={form.address} onChange={handle}
                        placeholder="Mahaboudha, Kathmandu"
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5
                                   text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20
                                   focus:border-red-400 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        License / Registration No. <span className="text-red-600">*</span>
                      </label>
                      <input name="license_no" value={form.license_no}
                        onChange={handle} required placeholder="NMC-2024-XXXXX"
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5
                                   text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20
                                   focus:border-red-400 transition-all" />
                    </div>
                    <div className="flex items-start gap-2.5 bg-amber-50 border
                                    border-amber-200 rounded-xl p-3.5">
                      <AlertCircle size={15} className="text-amber-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-800 leading-relaxed">
                        Hospital accounts need admin approval before you can post requests.
                        Expect a decision within 24 hours.
                      </p>
                    </div>
                  </>
                )}

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-600">Password</label>
                  </div>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'}
                      name="password" value={form.password}
                      onChange={handle} required placeholder="Min. 8 characters"
                      minLength={8}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5
                                 text-sm pr-10 focus:outline-none focus:ring-2
                                 focus:ring-red-500/20 focus:border-red-400 transition-all" />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2
                                 text-gray-300 hover:text-gray-500 transition-colors">
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {view === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Confirm Password
                    </label>
                    <input type="password" name="confirm_password"
                      value={form.confirm_password} onChange={handle}
                      required placeholder="••••••••"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5
                                 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20
                                 focus:border-red-400 transition-all" />
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full bg-red-600 text-white font-semibold py-3 rounded-xl
                             hover:bg-red-700 transition-all shadow-lg shadow-red-100
                             disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor"
                          strokeWidth="3" strokeDasharray="30 70" />
                      </svg>
                      One moment...
                    </>
                  ) : view === 'login' ? 'Sign in' : 'Create account'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}