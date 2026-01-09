import { useTheme } from "@/contexts/ThemeContext";

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  const { isDarkMode } = useTheme();

  return <div className={`${isDarkMode ? "bg-[#1F2937]" : "bg-white"} rounded-xl p-6 ${isDarkMode ? "" : "shadow-sm"}`}>{children}</div>;
};

export default Card;
