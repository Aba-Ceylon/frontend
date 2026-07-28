import type { PackageItem } from "@/types/package";

export function getTopPackages(
  items: PackageItem[],
  limit = 6,
): PackageItem[] {
  if (limit <= 0) return [];
  return items.slice(0, limit);
}
