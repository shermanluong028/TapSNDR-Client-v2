import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { LegacyButton } from "../common/LegacyButton";
import { useAlert } from "../../contexts/AlertContext";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut, FiSettings } from "react-icons/fi";
import { HiBellAlert, HiBars3, HiBellSlash } from "react-icons/hi2";
import { RiLockPasswordLine } from "react-icons/ri";

interface HeaderProps {
  onBarClicked: React.MouseEventHandler;
}

const Header: React.FC<HeaderProps> = ({ onBarClicked }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { alerts, setAlarmSounds, isAllowed } = useAlert();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const userRole = user?.roles?.[0]?.name?.toLowerCase() || "user";
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className={`fixed w-full h-[60px] z-[1] ${isDarkMode ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200"} border-b`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Breadcrumb */}
          <div>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white">
                <div className="w-4 h-4 bg-white/30 rounded-full"></div>
              </div>
              <span className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>TapSNDR</span>
            </div>
            <button
              className={`md:hidden ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"} relative`}
              onClick={onBarClicked}
            >
              <HiBars3 size={24} className="text-gray-400" />
            </button>
          </div>
          {/* Right side - Icons */}
          <div className="flex items-center gap-3">
            {/* Alert Bell */}
            <button
              className={`${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"} relative`}
              onClick={() => {
                setAlarmSounds(!isAllowed);
              }}
            >
              {isAllowed ? <HiBellAlert size={24} className="text-gray-400" /> : <HiBellSlash size={24} className="text-gray-400" />}

              {/* <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg> */}
              {alerts?.length > 0 ? <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" title={alerts[0].message}></div> : null}
            </button>

            {/* Dark Mode Toggle */}
            {/* <button
              className={`${
                isDarkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {!isDarkMode ? (
                <IoMdSunny size={24} className="text-gray-400" />
              ) : (
                <IoIosMoon size={24} className="text-gray-400" />
              )}
            </button> */}

            {/* Profile */}
            <div className="relative">
              <LegacyButton buttonType="circleBtn" isDarkMode={isDarkMode} isDisabled={false} onClickAction={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                <FaUserCircle size={24} className="text-gray-400" />
              </LegacyButton>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 bg-[#1F2937] rounded-lg shadow-lg border border-gray-700 z-50 w-52">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        if (userRole === 'user') {
                          navigate("/client/settings");
                        } else {
                          navigate("/fulfiller/settings");
                        }
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg !border-0 w-full"
                    >
                      <FiSettings className="w-5 h-5" />
                      Settings
                    </button>
                  </div>
                  <div className="p-2">
                    <a
                      href="#"
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg"
                    >
                      <FiLogOut className="w-5 h-5" />
                      Logout
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
