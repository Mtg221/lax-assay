// Cloudinary uploads use an UNSIGNED upload preset configured in the Cloudinary
// console (Settings > Upload > Upload presets > Signing mode: Unsigned).
// This never exposes the API Secret to the frontend. Restrict the preset to
// an "laxassaye" folder and reasonable file size/type limits in the console,
// and only call this from the admin dashboard (which is route-protected).

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

export async function uploadImage(file: File, folder = "laxassaye/products"): Promise<CloudinaryUploadResult> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary n'est pas configuré (variables d'environnement manquantes).");
  }
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Échec de l'envoi de l'image vers Cloudinary.");
  }

  const data = await res.json();
  return { url: data.secure_url as string, publicId: data.public_id as string };
}

// Builds an optimized, responsive delivery URL (auto format + quality, lazy-friendly).
export function optimizedUrl(url: string, width?: number): string {
  if (!url.includes("/upload/")) return url;
  const transform = `f_auto,q_auto${width ? `,w_${width}` : ""}`;
  return url.replace("/upload/", `/upload/${transform}/`);
}

export async function deleteImageNotice(): Promise<void> {
  // Actual deletion requires the API Secret and must happen server-side
  // (e.g. a Vercel serverless function using the Admin API), never in the
  // frontend. This app leaves orphaned Cloudinary assets to be cleaned up
  // periodically from the Cloudinary console/media library, or wire up
  // /api/cloudinary-delete.ts as a signed serverless endpoint if needed.
  return;
}
