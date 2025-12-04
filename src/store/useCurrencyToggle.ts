import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useCurrencyToggle = create<{
  isUsCurrency: boolean;
  toggleCurrency: () => void;
}>()(
  persist(
    set => ({
      isUsCurrency: false,
      toggleCurrency: () =>
        set(state => ({
          isUsCurrency: !state.isUsCurrency,
        })),
    }),
    {
      name: "currency-toggle",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// New store for managing currency code
export const useCurrencyStore = create<{
  currencyCode: string;
  setCurrencyCode: (code: string) => void;
}>()(
  persist(
    set => ({
      currencyCode: "en-IN",
      setCurrencyCode: code => set({ currencyCode: code }),
    }),
    {
      name: "currency-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
