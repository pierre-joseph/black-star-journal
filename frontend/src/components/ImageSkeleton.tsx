import { useState } from 'react';

interface ImageSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

export function ImageSkeleton({ src, alt, className = '', imgClassName = '' }: ImageSkeletonProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded" />
      )}
      <img
        src={src}
        alt={alt}
        className={`${imgClassName} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
    </div>
  );
}
