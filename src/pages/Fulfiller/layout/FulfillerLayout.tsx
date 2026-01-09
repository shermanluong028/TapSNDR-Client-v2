import { useState } from "react";
import Panel from "@/components/Panel";
import { useTheme } from "@/contexts/ThemeContext";
import { BaseLayout } from "@/layout/BaseLayout";
import { HiOutlineTicket } from "react-icons/hi2";
import { GoArrowSwitch } from "react-icons/go";

interface FulfillerLayoutProps {
  children: React.ReactNode;
}

export const FulfillerLayout: React.FC<FulfillerLayoutProps> = ({ children }) => {
  const [visiblePanel, setVisiblePanel] = useState(false);
  const { isDarkMode } = useTheme();
  const panelItems = [
    {
      category: "Fulfiller",
      name: "Transactions",
      path: "/fulfiller/payment",
      icon: <GoArrowSwitch size={24} className="mr-2" />,
      isActive: location.pathname.includes("/payment"),
    },
    {
      category: "Fulfiller",
      name: "Tickets",
      path: "/fulfiller/ticket",
      icon: <HiOutlineTicket size={24} className="mr-2" />,
      isActive: location.pathname.includes("/ticket"),
    },
  ];
  return (
    <BaseLayout onHeaderBarClicked={() => setVisiblePanel((state) => !state)}>
      <div className={`flex min-h-screen ${isDarkMode ? "bg-[#111827] text-white" : "bg-gray-50 text-gray-900"}`}>
        <Panel
          className={`fixed md:static z-10 ${visiblePanel ? "" : " hidden md:block"}`}
          items={panelItems}
          onItemClicked={() => setVisiblePanel(false)}
        />
        <div className="flex-1 md:ml-0 p-4 w-full">{children}</div>
      </div>
    </BaseLayout>
  );
};
