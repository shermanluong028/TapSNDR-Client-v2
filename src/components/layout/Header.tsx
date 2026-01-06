import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { LegacyButton } from "../common/LegacyButton";
import { useAlert } from "../../contexts/AlertContext";
import { FaUserCircle } from "react-icons/fa";
import { IoIosMoon, IoMdNotificationsOutline, IoMdSunny } from "react-icons/io";
import { HiBellAlert, HiBars3, HiBellSlash  } from "react-icons/hi2";

interface HeaderProps {
  onBarClicked: React.MouseEventHandler,
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
    <header
      className={`fixed w-full h-[60px] z-[1] ${
        isDarkMode ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200"
      } border-b`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Breadcrumb */}
          <div>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white">
                <div className="w-4 h-4 bg-white/30 rounded-full"></div>
              </div>
              <span
                className={`text-xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Tapsndr
              </span>
            </div>
            <button
              className={`md:hidden ${
                isDarkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
              } relative`}
              onClick={onBarClicked}
            >
              <HiBars3 size={24} className="text-gray-400" />
            </button>
          </div>
          {/* Right side - Icons */}
          <div className="flex items-center gap-3">
            {/* Alert Bell */}
            <button
              className={`${
                isDarkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
              } relative`}
              onClick={() => {setAlarmSounds(!isAllowed);}}
            >
              {
                isAllowed ? <HiBellAlert size={24} className="text-gray-400" /> : <HiBellSlash size={24} className="text-gray-400" />
              }
              
              {/* <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg> */}
              {alerts?.length > 0 ? (
                <div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                  title={alerts[0].message}
                ></div>
              ) : null}
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
              <LegacyButton
                buttonType="circleBtn"
                isDarkMode={isDarkMode}
                isDisabled={false}
                onClickAction={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <FaUserCircle size={24} className="text-gray-400" />
              </LegacyButton>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 bg-[#1F2937] rounded-lg shadow-lg border border-gray-700 z-50 w-52">
                 <div className="p-2">
                    <button
                      onClick={() => {navigate("/reset-password")}}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg !border-0"
                    >
                      <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                        width="20px" height="20px" viewBox="0 0 512.000000 512.000000"
                        preserveAspectRatio="xMidYMid meet">

                        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                        fill="#ffffff" stroke="none">
                        <path d="M3396 4669 c-35 -28 -34 -61 9 -213 19 -69 35 -127 35 -130 0 -4 -26
                        7 -57 23 -231 115 -535 182 -835 182 -507 -1 -985 -192 -1356 -545 -291 -277
                        -493 -642 -577 -1046 -32 -153 -44 -426 -26 -589 26 -242 92 -468 197 -681 79
                        -159 115 -192 177 -158 64 34 61 65 -21 228 -141 281 -200 556 -189 884 8 257
                        60 472 172 704 274 571 816 954 1445 1023 145 16 387 6 524 -21 108 -21 319
                        -85 371 -112 26 -14 24 -15 -74 -42 -111 -31 -135 -49 -135 -103 0 -41 39 -83
                        77 -83 20 0 178 43 410 111 74 22 107 49 107 88 0 14 -27 123 -60 241 -49 176
                        -65 219 -85 238 -32 28 -74 28 -109 1z"/>
                        <path d="M2485 3834 c-163 -25 -323 -140 -400 -286 -52 -99 -65 -173 -65 -384
                        l0 -181 -42 -13 c-102 -30 -168 -83 -216 -173 l-27 -52 0 -490 0 -490 34 -63
                        c40 -73 97 -124 173 -155 52 -21 67 -22 565 -25 301 -2 540 1 582 7 126 17
                        212 76 268 183 l28 53 0 485 0 485 -24 52 c-31 70 -111 144 -184 171 -32 12
                        -62 22 -66 22 -5 0 -11 93 -13 208 -4 176 -8 217 -26 273 -53 161 -184 293
                        -346 349 -58 20 -185 32 -241 24z m240 -211 c103 -53 173 -147 195 -262 5 -30
                        10 -127 10 -217 l0 -164 -371 0 -371 0 4 203 c3 194 4 204 30 259 46 98 133
                        175 238 209 14 5 66 7 115 6 78 -3 98 -8 150 -34z m415 -835 c18 -13 43 -36
                        54 -51 20 -28 21 -40 24 -469 3 -427 2 -442 -18 -482 -11 -22 -33 -50 -48 -61
                        -26 -19 -45 -20 -582 -23 -630 -3 -603 -6 -647 78 -23 43 -23 45 -23 473 0
                        410 1 433 20 472 12 25 34 49 57 63 38 21 41 22 584 22 l546 0 33 -22z"/>
                        <path d="M2494 2641 c-94 -24 -172 -100 -200 -196 -36 -125 29 -264 151 -322
                        l35 -17 0 -102 c0 -99 1 -103 26 -123 35 -28 77 -26 111 3 27 23 28 29 31 125
                        l4 100 43 25 c90 53 137 133 138 236 1 109 -52 199 -146 247 -54 27 -140 38
                        -193 24z m137 -187 c29 -27 41 -81 25 -119 -18 -42 -52 -65 -96 -65 -71 0
                        -122 69 -99 137 22 67 118 94 170 47z"/>
                        <path d="M4139 3571 c-16 -16 -29 -40 -29 -53 0 -13 28 -80 63 -148 143 -283
                        206 -571 194 -885 -9 -241 -56 -450 -151 -664 -146 -333 -419 -641 -733 -828
                        -413 -245 -914 -316 -1378 -193 -88 23 -280 92 -293 104 -1 2 37 18 85 36 129
                        48 159 65 173 99 10 25 10 37 0 61 -29 70 -62 67 -309 -27 -230 -88 -278 -119
                        -268 -172 10 -50 171 -435 189 -453 27 -27 84 -23 113 7 34 34 32 65 -15 180
                        -22 54 -40 102 -40 107 0 4 17 1 38 -8 633 -273 1350 -201 1913 192 130 90
                        331 280 424 399 187 239 315 509 379 796 98 444 38 921 -166 1321 -82 161
                        -126 191 -189 129z"/>
                        </g>
                        </svg>

                      Reset Password
                    </button>
                  </div>

                  <div className="p-2">
                    <a
                      href="#"
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                          clipRule="evenodd"
                        />
                      </svg>
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
