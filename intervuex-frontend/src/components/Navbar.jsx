import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProtectedNav = (path) => {
    if (!user) {
      navigate("/login"); // redirect to login if not logged in
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          IntervueX
        </Link>

        {/* Nav Links */}
        <div className="flex space-x-6 items-center">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 transition duration-200"
          >
            Home
          </Link>

          <Link
          to="/resume-analyzer"
            
            className="text-gray-700 hover:text-blue-600 transition duration-200"
          >
            Resume Analyzer
          </Link>

          <button
            onClick={() => handleProtectedNav("/interview")}
            className="text-gray-700 hover:text-blue-600 transition duration-200"
          >
            Interview
          </button>

          <button
            onClick={() => handleProtectedNav("/dashboard")}
            className="text-gray-700 hover:text-blue-600 transition duration-200"
          >
            Dashboard
          </button>

          <Link
            to="/faq"
            className="text-gray-700 hover:text-blue-600 transition duration-200"
          >
            FAQ
          </Link>

          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white"
              >
                Get Started
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
