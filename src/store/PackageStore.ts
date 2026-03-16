import {create} from 'zustand';

export type PackageItem = {
    id: string;
    title: string;
    duration: string;
    route: string[];
    summary: string;
    km: number;
    image: string;
}

type PackageStore = {
    selectedPackage: PackageItem | null;
    setSelectedPackage: (pkg: PackageItem) => void;
    clearSelectedPackage: () => void;
}

export const usePackageStore = create<PackageStore>((set) => ({
    selectedPackage: null,
    setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
    clearSelectedPackage: () => set({ selectedPackage: null }),
}));