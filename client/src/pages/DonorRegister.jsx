import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

const DonorRegister = () => {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [form, setForm] = useState({
    full_name:   '',
    email:       '',
    password:    '',
    blood_group: '',
    phone:       '',
    address:     '',
  })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handle = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    if (!form.blood_group) {
      setError('Select your blood group')
      return
    }
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register/donor', form)
      login(data.user, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center
                    justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-sm
                        border border-gray-100 p-8">

          {/* Header */}
          <div className="mb-8">
            <div className="w-14 h-14 bg-red-50 rounded-xl
                            flex items-center justify-center
                            text-2xl mb-4">
              🩸
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Register as a Donor
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              You'll get email alerts when a patient near you needs
              your blood group.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-600
                            text-red-800 text-sm px-4 py-3
                            rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">

            {/* Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold
                                  text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={handle}
                  placeholder="Ram Shrestha"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200
                             rounded-xl text-sm focus:outline-none
                             focus:ring-2 focus:ring-red-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold
                                  text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handle}
                  placeholder="ram@example.com"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200
                             rounded-xl text-sm focus:outline-none
                             focus:ring-2 focus:ring-red-500 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold
                                text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handle}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                className="w-full px-4 py-2.5 border border-gray-200
                           rounded-xl text-sm focus:outline-none
                           focus:ring-2 focus:ring-red-500 transition"
              />
            </div>

            {/* Phone + Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold
                                  text-gray-700 mb-1.5">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handle}
                  placeholder="+977-98XXXXXXXX"
                  className="w-full px-4 py-2.5 border border-gray-200
                             rounded-xl text-sm focus:outline-none
                             focus:ring-2 focus:ring-red-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold
                                  text-gray-700 mb-1.5">
                  City / District
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handle}
                  placeholder="Kathmandu, Bagmati"
                  className="w-full px-4 py-2.5 border border-gray-200
                             rounded-xl text-sm focus:outline-none
                             focus:ring-2 focus:ring-red-500 transition"
                />
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-sm font-semibold
                                text-gray-700 mb-2">
                Blood Group{' '}
                <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map(bg => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, blood_group: bg }))}
                    className={`py-2.5 rounded-xl text-sm font-bold
                                border-2 transition-all
                                ${form.blood_group === bg
                                  ? 'bg-red-700 border-red-700 text-white'
                                  : 'bg-white border-gray-200 text-gray-700 hover:border-red-400'
                                }`}>
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-100
                            rounded-xl px-4 py-3 text-sm text-blue-700">
              📧 You'll receive email alerts when someone near you
              needs your blood group. You control when to donate.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 hover:bg-red-800
                         disabled:opacity-60 disabled:cursor-not-allowed
                         text-white font-semibold py-3 rounded-xl
                         transition-colors text-sm">
              {loading ? 'Creating account...' : 'Register as Donor'}
            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already registered?{' '}
            <Link to="/login"
              className="text-red-700 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default DonorRegister