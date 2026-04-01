import { create } from "zustand";
import { PackageItem } from "@/types/package";

export type { PackageItem };

type PackageStore = {
  selectedPackage: PackageItem | null;
  setSelectedPackage: (pkg: PackageItem) => void;
  clearSelectedPackage: () => void;
};

export const usePackageStore = create<PackageStore>((set) => ({
  selectedPackage: null,
  setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
  clearSelectedPackage: () => set({ selectedPackage: null }),
}));
