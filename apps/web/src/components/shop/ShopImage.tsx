import Image from "next/image";

import { isCdnMediaSrc } from "@/lib/media";

type ShopImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function ShopImage({ src, alt, width, height, className, sizes, priority }: ShopImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes ?? "(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"}
      quality={70}
      priority={priority}
      unoptimized={isCdnMediaSrc(src)}
    />
  );
}
