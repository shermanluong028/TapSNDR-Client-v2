import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Form } from "@/components/form/Form";

import { useAlert } from "@/contexts/AlertContext";
import { useTheme } from "@/contexts/ThemeContext";

import { settingsService } from "@/services/settings.service";

import { Settings } from "@/types/settings";

interface LowBalanceThresholdSettingProps {}

export const LowBalanceThresholdSetting: React.FC<LowBalanceThresholdSettingProps> = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);

  const { isDarkMode } = useTheme();
  const { showAlert } = useAlert();

  useEffect(() => {
    (async () => {
      try {
        const resData = await settingsService.getSettings();
        if (resData.status !== 1) {
          console.error(resData.message);
          return;
        }
        setSettings(resData.data[0]);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const resData = await settingsService.updateSettings({
        id: settings?.id,
        low_balance_threshold: settings?.low_balance_threshold,
      });
      if (resData.status !== 1) {
        showAlert("error", resData.message);
        return;
      }
      showAlert("success", "Updated successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <div>
        <Form.Label htmlFor="low-balance-threshold">Low balance threshold (USDC)</Form.Label>
        <Form.Control
          id="low-balance-threshold"
          name="lowBalanceThreshold"
          type="number"
          min={0}
          step={"any"}
          placeholder="e.g. 50"
          value={settings?.low_balance_threshold ?? ""}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              low_balance_threshold: Number(e.target.value),
            }))
          }
        />
        <div className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
          You'll be notified once when your balance drops below this value.
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 rounded-lg font-medium text-gray-200 bg-primary-400 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 disabled:opacity-50 transition-colors duration-200"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
        </button>
      </div>
    </div>
  );
};
