import { lngs } from "@mifin/translations";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useI18nLng = create<{
  lng: string;
  toggleLng: (lng: (typeof lngs)[number]) => void;
}>()(
  persist(
    set => ({
      lng: "en",
      toggleLng: lng =>
        set({
          lng,
        }),
    }),
    {
      name: "i18-lng",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
