import type { PackageItem } from "@/types/package";

type ImageGalleryItem = {
  image: string;
  images?: string[];
};

/**
 * Returns images in the order supplied by the database, falling back to the
 * cover image when no gallery has been configured.
 */
export function getGalleryImages(item: ImageGalleryItem) {
  const galleryImages = (item.images ?? []).filter(
    (image): image is string => typeof image === "string" && image.trim().length > 0,
  );

  return galleryImages.length ? galleryImages : [item.image];
}

export function getPackageImages(pkg: Pick<PackageItem, "image" | "images">) {
  return getGalleryImages(pkg);
}
