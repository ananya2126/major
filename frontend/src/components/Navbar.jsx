import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          EduPortal
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-6 text-sm font-medium">

          <Link to="/" className="hover:text-indigo-600">
            Home
          </Link>

          <Link to="/about" className="hover:text-indigo-600">
            About
          </Link>

          <Link to="/how-to-use" className="hover:text-indigo-600">
            How To Use
          </Link>

          <Link to="/notifications" className="hover:text-indigo-600 flex items-center gap-1">
            <Bell size={18} />
            Notifications
          </Link>

          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
