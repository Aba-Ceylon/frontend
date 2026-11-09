const CLOUDINARY_VIDEO_BASE =
  "https://res.cloudinary.com/dwsstt7yc/video/upload";

function buildCloudinaryMp4VideoUrl(version: string, publicId: string) {
  return `${CLOUDINARY_VIDEO_BASE}/${version}/${publicId}.mp4`;
}

const HERO_VIDEO_BASE = "https://res.cloudinary.com/dmehjr04o/video/upload";
const HERO_VIDEO_VERSION = "v1794242255";
const HERO_VIDEO_ID = "SeamlessSriLanka";

export const cloudinaryVideos = {
  lotus: {
    publicId: "output_dz3uul",
    version: "v1781588485",
    // Scroll scrubbing seeks more reliably against a fixed MP4 than an auto-transformed stream.
    url: buildCloudinaryMp4VideoUrl("v1781588485", "output_dz3uul"),
  },
  hero: {
    // The untouched upload is smaller than Cloudinary's re-encodes, so serve it as-is.
    url: `${HERO_VIDEO_BASE}/${HERO_VIDEO_VERSION}/${HERO_VIDEO_ID}.mp4`,
    // The clip opens on black, so the poster is taken from a few seconds in.
    poster: `${HERO_VIDEO_BASE}/so_6,q_auto,f_auto,w_1600/${HERO_VIDEO_VERSION}/${HERO_VIDEO_ID}.jpg`,
    // Seconds (clip is ~95.5s). Playback loops inside this window to skip the
    // black opening frame and the closing "Seamless Sri Lanka" titles and
    // tourism-board logos, which start fading in around 79s.
    loopStart: 0.8,
    loopEnd: 78.5,
  },
} as const;
