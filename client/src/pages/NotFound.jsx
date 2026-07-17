import { Link } from "react-router-dom";

const NotFound = () => (
  <div
    className="min-h-screen flex flex-col items-center
                  justify-center gap-4 bg-gray-50"
  >
    <span className="text-8xl font-bold text-red-700">404</span>
    <p className="text-gray-500 text-lg">Page not found</p>
    <Link
      to="/"
      className="bg-red-700 hover:bg-red-800 text-white
                 px-6 py-2.5 rounded-xl font-semibold
                 no-underline transition-colors"
    >
      Go Home
    </Link>
  </div>
);

export default NotFound;
