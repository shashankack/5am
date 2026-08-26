"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import {
  cloudinaryLoader,
  hasCloudinaryConfig,
  isCloudinarySrc,
} from "@/lib/cloudinary";

type MediaImageProps = Omit<ImageProps, "src"> & {
  src: string;
  /** Soft fade-in once the image has painted. Default true. */
  fadeIn?: boolean;
};

export function MediaImage({
  src,
  alt,
  className,
  sizes,
  fadeIn = true,
  onLoad,
  ...rest
}: MediaImageProps) {
  const [loaded, setLoaded] = useState(!fadeIn);

  if (!src.trim()) return null;

  const useCloudinary = hasCloudinaryConfig() && isCloudinarySrc(src);

  return (
    <Image
      src={src}
      alt={alt}
      className={[
        className,
        fadeIn
          ? "transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          : null,
        fadeIn && !loaded ? "scale-[1.02] opacity-0" : "scale-100 opacity-100",
      ]
        .filter(Boolean)
        .join(" ")}
      sizes={sizes}
      loader={useCloudinary ? cloudinaryLoader : undefined}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      {...rest}
    />
  );
}
