import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const PatientRegister = () => {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [form, setForm] = useState({
    full_name: '',
    email:     '',
    password:  '',
    phone:     '',
  })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handle = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register/patient', form)
      login(data.user, data.token)
      navigate('/map')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center
                    justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm
                        border border-gray-100 p-8">

          <div className="mb-8">
            <div className="w-14 h-14 bg-blue-50 rounded-xl
                            flex items-center justify-center
                            text-2xl mb-4">
              👤
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              I need blood
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Register to post urgent blood requests. Compatible
              donors in your area get an email alert within 60 seconds.
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
            <div>
              <label className="block text-sm font-semibold
                                text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handle}
                placeholder="Your name or patient's name"
                required
                className="w-full px-4 py-2.5 border border-gray-200
                           rounded-xl text-sm focus:outline-none
                           focus:ring-2 focus:ring-blue-500 transition"
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
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 border border-gray-200
                           rounded-xl text-sm focus:outline-none
                           focus:ring-2 focus:ring-blue-500 transition"
              />
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
                           focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold
                                text-gray-700 mb-1.5">
                Phone Number
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handle}
                placeholder="+977-98XXXXXXXX"
                className="w-full px-4 py-2.5 border border-gray-200
                           rounded-xl text-sm focus:outline-none
                           focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div className="bg-blue-50 border border-blue-100
                            rounded-xl px-4 py-3 text-sm text-blue-700">
              After registering, go to{' '}
              <strong>Post Request</strong> to send alerts to
              nearby donors with your blood group.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800
                         disabled:opacity-60 disabled:cursor-not-allowed
                         text-white font-semibold py-3 rounded-xl
                         transition-colors text-sm">
              {loading ? 'Creating account...' : 'Create Patient Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already registered?{' '}
            <Link to="/login"
              className="text-blue-700 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default PatientRegister