import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ReferralState {
  referralCode: string | null;
  setReferralCode: (code: string) => void;
  clearReferralCode: () => void;
}

export const useReferral = create<ReferralState>()(
  persist(
    (set) => ({
      referralCode: null,

      setReferralCode: (code) => set({ referralCode: code }),
      clearReferralCode: () => set({ referralCode: null }),
    }),
    {
      name: "oc-referral",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
