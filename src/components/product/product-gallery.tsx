'use client';

import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ProductGalleryProps {
  images: string[];
  alt: string;
  productName: string;
}

const PLACEHOLDER_IMAGE = 'https://picsum.photos/seed/placeholder/800/800';

export function ProductGallery({ images, alt, productName }: ProductGalleryProps) {
  const imageList = images.length > 0 ? images : [PLACEHOLDER_IMAGE];

  // Main image state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Thumbnail carousel state
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentImage = imageList[currentImageIndex];
  const thumbnailsPerPage = isMobile ? 4 : 6;
  const maxThumbnailStartIndex = Math.max(0, imageList.length - thumbnailsPerPage);

  // Navigation handlers
  const goToImage = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setIsImageLoaded(false);
    setIsZoomed(false);
  }, []);

  const nextImage = useCallback(() => {
    goToImage((currentImageIndex + 1) % imageList.length);
  }, [currentImageIndex, imageList.length, goToImage]);

  const prevImage = useCallback(() => {
    goToImage((currentImageIndex - 1 + imageList.length) % imageList.length);
  }, [currentImageIndex, imageList.length, goToImage]);

  const nextThumbnailPage = useCallback(() => {
    setThumbnailStartIndex(Math.min(thumbnailStartIndex + 1, maxThumbnailStartIndex));
  }, [thumbnailStartIndex, maxThumbnailStartIndex]);

  const prevThumbnailPage = useCallback(() => {
    setThumbnailStartIndex(Math.max(thumbnailStartIndex - 1, 0));
  }, [thumbnailStartIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevImage();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextImage();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setIsLightboxOpen(false);
        }
      } else {
        if (e.key === 'ArrowLeft') {
          prevImage();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, nextImage, prevImage]);

  // Zoom handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsZoomed(true);
    }
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  // Touch handling for swipe on thumbnails
  const handleThumbnailWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaX > 0) {
      nextThumbnailPage();
    } else {
      prevThumbnailPage();
    }
  };

  // Thumbnail swipe on mobile
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      nextThumbnailPage();
    } else if (diff < -50) {
      prevThumbnailPage();
    }
  };

  // Scroll thumbnail into view if current image is out of view
  useEffect(() => {
    if (currentImageIndex < thumbnailStartIndex) {
      setThumbnailStartIndex(currentImageIndex);
    } else if (currentImageIndex >= thumbnailStartIndex + thumbnailsPerPage) {
      setThumbnailStartIndex(currentImageIndex - thumbnailsPerPage + 1);
    }
  }, [currentImageIndex, thumbnailStartIndex, thumbnailsPerPage]);

  // Handle image error
  const handleImageError = () => {
    // Try next image or use placeholder
    if (currentImageIndex < imageList.length - 1) {
      goToImage(currentImageIndex + 1);
    } else {
      setIsImageLoaded(false);
    }
  };

  const visibleThumbnails = imageList.slice(
    thumbnailStartIndex,
    thumbnailStartIndex + thumbnailsPerPage
  );

  return (
    <div className="w-full space-y-4">
      {/* Main Image Container */}
      <div
        className="relative w-full aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden group cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsLightboxOpen(true)}
      >
        {/* Loading skeleton */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
        )}

        {/* Main Image */}
        <div
          className={cn(
            'relative w-full h-full transition-transform duration-200',
            isZoomed && 'scale-150'
          )}
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }
              : undefined
          }
        >
          <Image
            src={currentImage}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={cn(
              'object-cover transition-opacity duration-300',
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            priority={currentImageIndex === 0}
            onLoad={() => setIsImageLoaded(true)}
            onError={handleImageError}
          />
        </div>

        {/* Zoom Icon */}
        <div className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="h-4 w-4" />
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1.5 rounded-full font-medium">
          {currentImageIndex + 1} / {imageList.length}
        </div>

        {/* Navigation Arrows - Desktop */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Image précédente"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Image suivante"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Carousel */}
      {imageList.length > 1 && (
        <div className="space-y-2">
          <div
            ref={carouselRef}
            className="flex gap-2 overflow-hidden"
            onWheel={handleThumbnailWheel}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {visibleThumbnails.map((image, idx) => {
              const actualIndex = thumbnailStartIndex + idx;
              const isActive = actualIndex === currentImageIndex;

              return (
                <button
                  key={actualIndex}
                  onClick={() => goToImage(actualIndex)}
                  className={cn(
                    'relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border-2 transition-all',
                    isActive
                      ? 'border-accent ring-2 ring-accent/50'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                  aria-label={`View image ${actualIndex + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${alt} thumbnail ${actualIndex + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Thumbnail Navigation */}
          {imageList.length > thumbnailsPerPage && (
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={prevThumbnailPage}
                disabled={thumbnailStartIndex === 0}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex gap-1 items-center">
                {Array.from({
                  length: Math.ceil(imageList.length / thumbnailsPerPage),
                }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setThumbnailStartIndex(Math.min(idx * thumbnailsPerPage, maxThumbnailStartIndex))
                    }
                    className={cn(
                      'h-1.5 rounded-full transition-all',
                      idx * thumbnailsPerPage === thumbnailStartIndex
                        ? 'w-6 bg-accent'
                        : 'w-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                    )}
                    aria-label={`Go to thumbnail set ${idx + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={nextThumbnailPage}
                disabled={thumbnailStartIndex >= maxThumbnailStartIndex}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl max-h-screen p-0 bg-black border-0">
          <div className="relative w-full aspect-square">
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Image */}
            <Image
              src={imageList[currentImageIndex]}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
              onError={handleImageError}
            />

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1.5 rounded-full">
              {currentImageIndex + 1} / {imageList.length}
            </div>

            {/* Navigation Arrows */}
            {imageList.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
                  aria-label="Image suivante"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
