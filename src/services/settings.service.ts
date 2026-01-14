import { newApi } from "./newApi";

import { Settings } from "@/types/settings";

export const settingsService = {
  async getSettings() {
    const response = await newApi.get("/settings");
    return response.data;
  },

  async updateSettings(data: Settings) {
    const response = await newApi.post("/settings", data);
    return response.data;
  },
};
