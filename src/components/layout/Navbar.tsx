import { Link } from 'react-router-dom';
import { MapPin, BarChart3 } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">
                Medical AI Assistant
              </span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Home
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
