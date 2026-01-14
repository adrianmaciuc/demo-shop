import { useState, useEffect, useRef } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "4/3" | "16/9" | "3/4";
  "data-testid"?: string;
}

const LazyImage = ({
  src,
  alt,
  className = "",
  aspectRatio = "square",
  "data-testid": testId,
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before image enters viewport
      },
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const aspectRatioClasses = {
    square: "aspect-square",
    "4/3": "aspect-[4/3]",
    "16/9": "aspect-video",
    "3/4": "aspect-[3/4]",
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${aspectRatioClasses[aspectRatio]}`}
      data-testid={testId ? `${testId}-container` : "lazy-image-container"}
    >
      {/* Skeleton Loader */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"
          style={{
            backgroundSize: "200% 100%",
          }}
          data-testid={testId ? `${testId}-skeleton` : "lazy-image-skeleton"}
        />
      )}

      {/* Actual Image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${
            isLoaded ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          data-testid={testId}
        />
      )}
    </div>
  );
};

export default LazyImage;
