"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CockpitState {
  projects: any[];
  risks: any[];
  decisions: any[];
  timeline: any[];
  reports: any[];
  setData: (data: Partial<CockpitState>) => void;
}

export const useCockpitStore = create<CockpitState>()(
  persist(
    (set) => ({
      projects: [],
      risks: [],
      decisions: [],
      timeline: [],
      reports: [],
      setData: (data) => set(data)
    }),
    {
      name: "powalyze-cockpit",
      version: 1
    }
  )
);
