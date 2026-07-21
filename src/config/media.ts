const CLOUDINARY_VIDEO_BASE =
  "https://res.cloudinary.com/dwsstt7yc/video/upload";

function buildCloudinaryMp4VideoUrl(version: string, publicId: string) {
  return `${CLOUDINARY_VIDEO_BASE}/${version}/${publicId}.mp4`;
}

export const cloudinaryVideos = {
  lotus: {
    publicId: "output_dz3uul",
    version: "v1781588485",
    // Scroll scrubbing seeks more reliably against a fixed MP4 than an auto-transformed stream.
    url: buildCloudinaryMp4VideoUrl("v1781588485", "output_dz3uul"),
  },
} as const;
