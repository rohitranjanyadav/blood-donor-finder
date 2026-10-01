import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => { logout(); navigate('/') }
    const isActive = (path) => location.pathname === path

    const linkClass = (path) =>
        `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(path)
            ? 'bg-white/10 text-white'
            : 'text-gray-400 hover:text-white hover:bg-white/10'
        }`

    return (
        <nav className="bg-[#1B2631] px-6 h-16 flex items-center
                    justify-between sticky top-0 z-50
                    shadow-[0_2px_12px_rgba(0,0,0,0.3)]">

            {/* Logo */}
            <Link to="/"
                className="flex items-center gap-2 text-white
                   no-underline font-bold text-lg hover:opacity-90">
                <span className="text-2xl">🩸</span>
                <span className="tracking-wide">Blood Donor Finder</span>
            </Link>

            {/* Right side links */}
            <div className="flex items-center gap-2">

                <Link to="/map" className={linkClass('/map')}>
                    🗺 Live Map
                </Link>

                {/* Guest */}
                {!user && (
                    <>
                        <Link to="/login" className={linkClass('/login')}>
                            Login
                        </Link>
                        <Link to="/register/donor"
                            className="bg-red-700 hover:bg-red-800 text-white
                         px-4 py-2 rounded-lg text-sm font-semibold
                         no-underline transition-colors">
                            Register as Donor
                        </Link>
                    </>
                )}

                {/* Donor */}
                {user?.role === 'donor' && (
                    <Link to="/dashboard" className={linkClass('/dashboard')}>
                        Dashboard
                    </Link>
                )}

                {/* Patient / Hospital */}
                {(user?.role === 'patient' || user?.role === 'hospital') && (
                    <Link to="/requests/new" className={linkClass('/requests/new')}>
                        + Post Request
                    </Link>
                )}

                {/* Admin */}
                {user?.role === 'admin' && (
                    <Link to="/admin" className={linkClass('/admin')}>
                        ⚙ Admin
                    </Link>
                )}

                {/* Logged in user */}
                {user && (
                    <div className="flex items-center gap-3 ml-2">
                        <div className="flex items-center gap-2 bg-white/10
                            text-white px-3 py-1.5 rounded-lg text-sm">
                            <span>👤 {user.full_name?.split(' ')[0] || user.username}</span>
                            {user.blood_group && (
                                <span className="bg-red-700 text-white text-xs
                                  font-bold px-2 py-0.5 rounded">
                                    {user.blood_group}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-gray-400 hover:text-white border
                         border-white/20 hover:border-white/40
                         px-3 py-1.5 rounded-lg text-sm
                         cursor-pointer transition-colors bg-transparent">
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar