import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PlaySquare } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-white flex items-center gap-2 hover:text-indigo-400 transition-colors">
              <PlaySquare className="w-6 h-6 text-indigo-500" />
              <span>YT Summarizer</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={handleLogout}
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors border border-transparent hover:border-slate-700 hover:bg-slate-800"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
