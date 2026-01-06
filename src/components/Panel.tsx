import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

interface PanelProps {
  className: string,
  items: {
    category: string;
    name: string;
    path: string;
    isActive?: boolean;
    icon?: React.ReactNode;
    badge?: string;
    description?: string;
  }[];
  onItemClicked: React.MouseEventHandler
}

const Panel: React.FC<PanelProps> = ({ className, items, onItemClicked }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div
      className={`w-64 min-h-screen ${
        isDarkMode ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200"
      } border-r${className ? " " + className : ""}`}
    >
      <div
        className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2 ml-3">
          <span
            className={`text-xl font-bold ${
              isDarkMode ? "text-gray-300" : "text-gray-900"
            }`}
          >
            {items[0].category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-8">
          <div
            className={`text-xl font-medium text-left px-4 ${
              isDarkMode ? "text-gray-300" : "text-gray-400"
            } mb-4`}
          >
            {/* {items[0].category} */}
          </div>
          <nav className="space-y-1">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                } py-2 px-3 rounded-lg ${
                  item.isActive
                    ? isDarkMode
                      ? "bg-gray-800"
                      : "bg-gray-100 text-gray-900"
                    : ""
                }`}
                title={item.description || item.name}
                onClick={onItemClicked}
              >
                {item.icon}
                <span className="text-lg font-bold">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Panel;
