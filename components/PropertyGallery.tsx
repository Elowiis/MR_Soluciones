"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  url: string;
  alt: string;
}

interface PropertyGalleryProps {
  mainImage: GalleryImage;
  gallery: GalleryImage[];
}

export function PropertyGallery({ mainImage, gallery }: PropertyGalleryProps) {
  const allImages: GalleryImage[] = [mainImage, ...gallery];
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalImages = allImages.length;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  const showPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  const showNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        showPrev();
      } else if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showPrev, showNext]);

  const sidebarThumbnails = gallery.slice(0, 4);
  const extraImagesCount = Math.max(totalImages - 5, 0);
  const showExtraBadge = totalImages > 5 && sidebarThumbnails.length > 0;

  return (
    <>
      {/* Desktop / tablet layout */}
      <div className="hidden lg:grid grid-cols-3 gap-4 mb-8">
        {/* Main image */}
        <div className="lg:col-span-2">
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="group relative block w-full h-[420px] rounded-lg overflow-hidden bg-muted focus:outline-none focus:ring-2 focus:ring-primary/60"
          >
            <Image
              src={mainImage.url}
              alt={mainImage.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/0" />
          </button>
        </div>

        {/* Sidebar thumbnails */}
        {sidebarThumbnails.length > 0 && (
          <div className="grid grid-rows-4 gap-3">
            {sidebarThumbnails.map((img, index) => {
              const isLastVisible = index === sidebarThumbnails.length - 1;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => openLightbox(index + 1)}
                  className="group relative block rounded-lg overflow-hidden bg-muted focus:outline-none focus:ring-2 focus:ring-primary/60"
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {showExtraBadge && isLastVisible && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="px-4 py-2 rounded-full bg-black/70 text-white text-sm font-medium">
                        +{extraImagesCount} fotos
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden mb-6 space-y-3">
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="group relative block w-full aspect-[4/3] rounded-lg overflow-hidden bg-muted focus:outline-none focus:ring-2 focus:ring-primary/60"
        >
          <Image
            src={mainImage.url}
            alt={mainImage.alt}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </button>

        {gallery.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-2 px-2 scrollbar-hide">
            {gallery.map((img, index) => (
              <button
                key={index}
                type="button"
                onClick={() => openLightbox(index + 1)}
                className="relative flex-none w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-muted focus:outline-none focus:ring-2 focus:ring-primary/60 shrink-0"
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col"
          onClick={closeLightbox}
        >
          <div className="relative flex-1 flex items-center justify-center px-4 py-6 md:px-8">
            {/* Close button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              className="absolute top-4 right-4 md:top-6 md:right-8 rounded-full bg-black/60 hover:bg-black/80 text-white p-2.5 sm:p-3 min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/70"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs md:text-sm font-medium text-white/80">
              {currentIndex + 1} / {totalImages}
            </div>

            {/* Prev button - Touch gestures en móvil */}
            {totalImages > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                  className="hidden md:flex absolute left-4 md:left-8 rounded-full bg-black/60 hover:bg-black/80 text-white p-2 md:p-3 min-w-[44px] min-h-[44px] items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/70"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                {/* Touch area para móvil */}
                <div 
                  className="md:hidden absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                />
              </>
            )}

            {/* Next button - Touch gestures en móvil */}
            {totalImages > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                  className="hidden md:flex absolute right-4 md:right-8 rounded-full bg-black/60 hover:bg-black/80 text-white p-2 md:p-3 min-w-[44px] min-h-[44px] items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/70"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                {/* Touch area para móvil */}
                <div 
                  className="md:hidden absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                />
              </>
            )}

            {/* Main lightbox image */}
            <div
              className="relative max-w-5xl w-full max-h-full aspect-[4/3] bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={allImages[currentIndex].url}
                alt={allImages[currentIndex].alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>

          {/* Thumbnails strip */}
          {totalImages > 1 && (
            <div
              className="w-full border-t border-white/10 bg-black/95 py-3 px-3 md:px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-2 overflow-x-auto">
                {allImages.map((img, index) => {
                  const isActive = index === currentIndex;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      className={`relative flex-none w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border ${
                        isActive
                          ? "border-primary ring-2 ring-primary/70"
                          : "border-white/10 hover:border-white/40"
                      } focus:outline-none`}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}


