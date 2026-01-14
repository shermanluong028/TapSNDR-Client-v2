import React from "react";

import { useTheme } from "@/contexts/ThemeContext";

import { useAuth } from "@/hooks/useAuth";

import Card from "@/components/Card";
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";
import { LowBalanceThresholdSetting } from "@/components/settings/LowBalanceThresholdSetting";
import { ClientLayout } from "./layout";

export const ClientSettingsPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className={`text-2xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Settings</h2>
            <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Manage your account and preferences.</div>
          </div>
        </div>

        <Card>
          <div className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Security</div>
          <div className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-sm`}>Change your account password.</div>
          <ChangePasswordForm defaultEmail={user?.email || ""} />
        </Card>

        <Card>
          <div className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Notifications</div>
          <LowBalanceThresholdSetting />
        </Card>
      </div>
    </ClientLayout>
  );
};
