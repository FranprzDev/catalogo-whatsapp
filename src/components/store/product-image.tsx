import Image from "next/image";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ProductImage({ src, alt, className }: ProductImageProps) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-neutral-100 text-xs font-medium text-neutral-400 ${className ?? ""}`}
        aria-label={alt}
        role="img"
      >
        Sin foto
      </div>
    );
  }
  if (src.startsWith("data:")) {
    // next/image cannot optimize data URLs; they are already compressed WebP.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} />;
  }
  return <Image src={src} alt={alt} width={800} height={800} className={className ?? ""} />;
}
