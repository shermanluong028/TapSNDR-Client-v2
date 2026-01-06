import { useState } from "react";
import Panel from "../../../components/Panel";
import { useTheme } from "../../../contexts/ThemeContext";
import { BaseLayout } from "../../../layout/BaseLayout";
import { IoCard } from "react-icons/io5";
import { HiDocumentDuplicate } from "react-icons/hi2";
import { HiOutlineMenu } from "react-icons/hi";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const [visiblePanel, setVisiblePanel] = useState(false);
  const { isDarkMode } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const panelItems = [
    {
      category: "Client",
      name: "Payments",
      path: "/client/payment",
      icon: <IoCard size={24} className="mr-2" />,
      isActive: location.pathname.includes("/payment"),
    },
    {
      category: "Client",
      name: "Tickets",
      path: "/client/ticket",
      icon: <HiDocumentDuplicate size={24} className="mr-2" />,
      isActive: location.pathname.includes("/ticket"),
    },
  ];

  return (
    <BaseLayout onHeaderBarClicked={() => setVisiblePanel((state) => !state)}>
      <div className={`flex min-h-screen ${isDarkMode ? "bg-[#111827] text-white" : "bg-gray-50 text-gray-900"}`}>
        {/* Hamburger Button for Mobile */}
        {/* <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="absolute top-4 left-4 z-50 md:hidden">
          <HiOutlineMenu size={28} />
        </button> */}

        {/* Sidebar */}
        {/* <div
          className={`fixed z-40 top-0 left-0 h-full bg-white dark:bg-[#1F2937] transition-transform transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 md:flex`}
        ></div> */}
        <Panel
          className={`fixed md:static z-10 ${visiblePanel ? "" : " hidden md:block"}`}
          items={panelItems}
          onItemClicked={() => setVisiblePanel(false)}
        />

        {/* Overlay for mobile when sidebar is open */}
        {/* {isSidebarOpen && (
          <div className="fixed inset-0 bg-black opacity-40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
        )} */}

        {/* Main content */}
        <div className="flex-1 md:ml-0 p-4 w-full">{children}</div>
      </div>
    </BaseLayout>
  );
};
