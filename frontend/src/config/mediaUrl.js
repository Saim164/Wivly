const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Resolves a stored media value to a usable URL.
// - Cloudinary (or any absolute) URLs are returned as-is
// - legacy filenames are served from the backend's /uploads folder
// - empty values fall back to the default avatar
export const mediaUrl = (value) => {
  if (!value) return `${BACKEND_URL}/uploads/default.png`;
  if (value.startsWith("http")) return value;
  return `${BACKEND_URL}/uploads/${value}`;
};
