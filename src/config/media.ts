const CLOUDINARY_VIDEO_BASE =
  "https://res.cloudinary.com/dwsstt7yc/video/upload";

function buildCloudinaryOptimizedVideoUrl(version: string, publicId: string) {
  return `${CLOUDINARY_VIDEO_BASE}/q_auto,f_auto/${version}/${publicId}`;
}

function buildCloudinaryMp4VideoUrl(version: string, publicId: string) {
  return `${CLOUDINARY_VIDEO_BASE}/${version}/${publicId}.mp4`;
}

export const cloudinaryVideos = {
  hero: {
    publicId: "SriLanka_dr2jzw",
    version: "v1781588514",
    url: buildCloudinaryOptimizedVideoUrl("v1781588514", "SriLanka_dr2jzw"),
  },
  lotus: {
    publicId: "output_dz3uul",
    version: "v1781588485",
    // Scroll scrubbing seeks more reliably against a fixed MP4 than an auto-transformed stream.
    url: buildCloudinaryMp4VideoUrl("v1781588485", "output_dz3uul"),
  },
} as const;

export const homeVideoSources = [
  cloudinaryVideos.hero.url,
  cloudinaryVideos.lotus.url,
] as const;
