import Image, { type ImageProps } from "next/image";
import {
  cloudinaryLoader,
  hasCloudinaryConfig,
  isCloudinarySrc,
} from "@/lib/cloudinary";

type MediaImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

export function MediaImage({ src, alt, className, sizes, ...rest }: MediaImageProps) {
  const useCloudinary = hasCloudinaryConfig() && isCloudinarySrc(src);

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      sizes={sizes}
      loader={useCloudinary ? cloudinaryLoader : undefined}
      {...rest}
    />
  );
}
