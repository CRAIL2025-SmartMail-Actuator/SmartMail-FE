import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTEPATHS } from "../../../routing";

interface HeaderProps {
  userEmail: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userEmail, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const initial = userEmail?.charAt(0)?.toUpperCase() || "?";
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white shadow-md h-[80px]">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold">📧</span>
        <span className="text-lg font-semibold cursor-pointer" onClick={() => navigate(ROUTEPATHS.MAIL)}>MyMail</span>
      </div>

      {/* Profile */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-full bg-white text-blue-600 font-bold flex items-center justify-center focus:outline-none"
        >
          {initial}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-50">
            <div className="px-4 py-2 border-b text-sm font-medium">
              {userEmail}
            </div>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              onClick={() => navigate(ROUTEPATHS.PROFILE)}
            >
              Profile
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
