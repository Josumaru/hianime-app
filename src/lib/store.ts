import { Hianime } from "@/types/hianime";
import { create } from "zustand";

interface HianimeStore {
  data: Hianime | null;
  setData: (data: Hianime) => void;
}

export const useHianimeStore = create<HianimeStore>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));
