const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const mediaUrl = (value) => {
  if (!value) return `${BACKEND_URL}/uploads/default.png`;
  if (value.startsWith("http")) return value;
  return `${BACKEND_URL}/uploads/${value}`;
};
