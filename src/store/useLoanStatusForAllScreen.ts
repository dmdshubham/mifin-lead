import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface StatusForAllScreenStore {
  hideValidationComponent: boolean;
  updateHideValidationComponent: (value: boolean) => void;
}

export const useLoanStatusForAllScreen = create<StatusForAllScreenStore>()(
  persist(
    set => ({
      hideValidationComponent: false,
      updateHideValidationComponent: value =>
        set({ hideValidationComponent: value }),
    }),
    {
      name: "statusForAllScreen",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
