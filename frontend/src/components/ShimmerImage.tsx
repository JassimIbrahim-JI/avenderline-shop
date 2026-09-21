"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

import { shimmerBlurDataUrl } from "@/lib/shimmer";
export { shimmerBlurDataUrl };

export interface ShimmerImageProps extends Omit<ImageProps, "placeholder" | "blurDataURL"> {
  fallbackSrc?: string;
  showShimmer?: boolean;
}

export default function ShimmerImage({
  src,
  alt,
  className = "",
  fallbackSrc = "https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=1000&q=85",
  showShimmer = true,
  onLoad,
  onError,
  ...rest
}: ShimmerImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <>
      {showShimmer && !isLoaded && (
        <div
          className="absolute inset-0 z-0 bg-gradient-to-r from-[#f5f2ec] via-[#ebe5da] to-[#f5f2ec] bg-[length:200%_100%] animate-shimmer pointer-events-none transition-opacity duration-700"
          aria-hidden="true"
        />
      )}

      <Image
        {...rest}
        src={hasError ? fallbackSrc : imgSrc}
        alt={alt}
        placeholder="blur"
        blurDataURL={shimmerBlurDataUrl(600, 800)}
        onLoad={(e) => {
          setIsLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setHasError(true);
          setIsLoaded(true);
          onError?.(e);
        }}
        className={`${className} transition-all duration-700 ease-out ${
          isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-[2px]"
        }`}
      />
    </>
  );
}


