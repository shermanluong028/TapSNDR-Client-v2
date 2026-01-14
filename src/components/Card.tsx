import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { useTheme } from "@/contexts/ThemeContext";

interface CardProps {
  children: ReactNode;
  loading?: boolean;
}

const Card: React.FC<CardProps> = ({ children, loading = false }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`relative ${isDarkMode ? "bg-[#1F2937]" : "bg-white"} rounded-xl p-6 ${isDarkMode ? "" : "shadow-sm"}`}>
      {loading && (
        <div className={`absolute inset-0 z-10 flex items-center justify-center rounded-xl ${isDarkMode ? "bg-gray-900/60" : "bg-gray-200/60"}`}>
          <Loader2 className={`h-10 w-10 animate-spin ${isDarkMode ? "text-gray-200" : "text-gray-600"}`} />
        </div>
      )}

      {children}
    </div>
  );
};

export default Card;
