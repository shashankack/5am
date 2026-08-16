import type { ImageLoaderProps } from "next/image";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

/** Built Cloudinary URLs — avoid rebuilding the same transform string. */
const urlCache = new Map<string, string>();

export function isCloudinarySrc(src: string): boolean {
  return (
    src.includes("res.cloudinary.com") ||
    src.startsWith("cloudinary:") ||
    src.startsWith("image/upload/")
  );
}

function publicIdFromSrc(src: string): string {
  if (src.startsWith("cloudinary:")) {
    return src.slice("cloudinary:".length).replace(/^\//, "");
  }

  const uploadIndex = src.indexOf("/upload/");
  if (uploadIndex === -1) return src.replace(/^\//, "");

  const afterUpload = src.slice(uploadIndex + "/upload/".length);
  // Strip existing transform segment (v123 or f_auto,q_auto/... stay as versioned id)
  const withoutVersion = afterUpload.replace(/^v\d+\//, "");
  const maybeTransforms = withoutVersion.split("/");
  if (maybeTransforms[0]?.includes(",")) {
    return maybeTransforms.slice(1).join("/");
  }
  return withoutVersion;
}

export function cloudinaryUrl({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  const publicId = publicIdFromSrc(src);
  const q = quality ?? "auto";
  const key = `${CLOUD_NAME}:${publicId}:${width}:${q}`;
  const cached = urlCache.get(key);
  if (cached) return cached;

  const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,c_limit,w_${width},q_${q}/${publicId}`;
  urlCache.set(key, url);
  return url;
}

export function cloudinaryLoader(props: ImageLoaderProps): string {
  if (!CLOUD_NAME || !isCloudinarySrc(props.src)) {
    return props.src;
  }
  return cloudinaryUrl(props);
}

export function hasCloudinaryConfig(): boolean {
  return CLOUD_NAME.length > 0;
}
