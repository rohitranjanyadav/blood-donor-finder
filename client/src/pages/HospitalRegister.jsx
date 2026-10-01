import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const HospitalRegister = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    hospital_name: '',
    email:         '',
    password:      '',
    phone:         '',
    address:       '',
    license_no:    '',
  })
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState(false)
  const [loading,  setLoading]  = useState(false)

  const handle = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/register/hospital', form)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center
                      justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border
                        border-gray-100 p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Registration received
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Your hospital account is pending admin verification.
            You'll be able to log in once approved. This usually
            takes less than 24 hours.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-700 hover:bg-green-800 text-white
                       px-6 py-2.5 rounded-xl font-semibold text-sm
                       transition-colors">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center
                    justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-sm
                        border border-gray-100 p-8">

          <div className="mb-8">
            <div className="w-14 h-14 bg-green-50 rounded-xl
                            flex items-center justify-center
                            text-2xl mb-4">
              🏥
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Register your hospital
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Post urgent blood requests that instantly alert
              compatible donors in your area.
            </p>
          </div>

          {/* Pending notice */}
          <div className="bg-amber-50 border border-amber-200
                          rounded-xl px-4 py-3 text-sm text-amber-800 mb-6">
            ⚠ Hospital accounts require admin verification before
            login access. Registration takes under a minute.
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-600
                            text-red-800 text-sm px-4 py-3
                            rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">

            <div>
              <label className="block text-sm font-semibold
                                text-gray-700 mb-1.5">
                Hospital Name
              </label>
              <input
                name="hospital_name"
                value={form.hospital_name}
                onChange={handle}
                placeholder="Bir Hospital"
                required
                className="w-full px-4 py-2.5 border border-gray-200
                           rounded-xl text-sm focus:outline-none
                           focus:ring-2 focus:ring-green-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="admin@hospital.com"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200
                             rounded-xl text-sm focus:outline-none
                             focus:ring-2 focus:ring-green-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold
                                  text-gray-700 mb-1.5">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handle}
                  placeholder="01-XXXXXXX"
                  className="w-full px-4 py-2.5 border border-gray-200
                             rounded-xl text-sm focus:outline-none
                             focus:ring-2 focus:ring-green-500 transition"
                />
              </div>
            </div>

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
                           focus:ring-2 focus:ring-green-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold
                                text-gray-700 mb-1.5">
                Address
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handle}
                placeholder="Mahaboudha, Kathmandu"
                className="w-full px-4 py-2.5 border border-gray-200
                           rounded-xl text-sm focus:outline-none
                           focus:ring-2 focus:ring-green-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold
                                text-gray-700 mb-1.5">
                License / Registration No.
                <span className="text-red-600"> *</span>
              </label>
              <input
                name="license_no"
                value={form.license_no}
                onChange={handle}
                placeholder="NMC-2024-XXXXX"
                required
                className="w-full px-4 py-2.5 border border-gray-200
                           rounded-xl text-sm focus:outline-none
                           focus:ring-2 focus:ring-green-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800
                         disabled:opacity-60 disabled:cursor-not-allowed
                         text-white font-semibold py-3 rounded-xl
                         transition-colors text-sm">
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already verified?{' '}
            <Link to="/login"
              className="text-green-700 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default HospitalRegister