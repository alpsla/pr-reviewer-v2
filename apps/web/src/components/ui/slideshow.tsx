import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const slideshowVariants = cva(
  "overflow-hidden border border-border rounded-lg bg-card",
  {
    variants: {
      size: {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        full: "w-full",
      },
      ratio: {
        "1:1": "aspect-square",
        "4:3": "aspect-[4/3]",
        "16:9": "aspect-video",
        auto: "h-auto",
      },
    },
    defaultVariants: {
      size: "md",
      ratio: "16:9",
    },
  }
);

export interface SlideProps {
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  content?: React.ReactNode;
}

interface SlideshowProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof slideshowVariants> {
  slides: SlideProps[];
  autoPlay?: boolean;
  interval?: number; // In milliseconds
  showDots?: boolean;
  showArrows?: boolean;
  showProgress?: boolean;
  allowSwipe?: boolean;
  loop?: boolean;
}

export const Slideshow = React.forwardRef<HTMLDivElement, SlideshowProps>(
  (
    {
      className,
      size,
      ratio,
      slides,
      autoPlay = false,
      interval = 5000,
      showDots = true,
      showArrows = true,
      showProgress = true,
      allowSwipe = true,
      loop = false,
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isPlaying, setIsPlaying] = React.useState(autoPlay);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
    const slideshowRef = React.useRef<HTMLDivElement>(null);
    
    // Touch/swipe handling
    const touchStartX = React.useRef<number | null>(null);
    const touchEndX = React.useRef<number | null>(null);
    
    const handleTouchStart = (e: React.TouchEvent) => {
      if (!allowSwipe) return;
      touchStartX.current = e.touches[0].clientX;
    };
    
    const handleTouchMove = (e: React.TouchEvent) => {
      if (!allowSwipe || touchStartX.current === null) return;
      touchEndX.current = e.touches[0].clientX;
    };
    
    const handleTouchEnd = () => {
      if (!allowSwipe || touchStartX.current === null || touchEndX.current === null) return;
      
      const diffX = touchStartX.current - touchEndX.current;
      
      // Threshold for swipe detection (50px)
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
      
      touchStartX.current = null;
      touchEndX.current = null;
    };

    const startAutoPlay = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        handleNext();
      }, interval);
    };

    const stopAutoPlay = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleNext = () => {
      setCurrentIndex((prev) => {
        if (prev === slides.length - 1) {
          return loop ? 0 : prev;
        }
        return prev + 1;
      });
    };

    const handlePrev = () => {
      setCurrentIndex((prev) => {
        if (prev === 0) {
          return loop ? slides.length - 1 : prev;
        }
        return prev - 1;
      });
    };

    const handleDotClick = (index: number) => {
      setCurrentIndex(index);
    };

    const toggleAutoPlay = () => {
      setIsPlaying((prev) => !prev);
    };

    React.useEffect(() => {
      if (isPlaying) {
        startAutoPlay();
      } else {
        stopAutoPlay();
      }

      return () => {
        stopAutoPlay();
      };
    }, [isPlaying, interval, currentIndex]);

    // Keyboard navigation
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!slideshowRef.current || !slideshowRef.current.contains(document.activeElement)) {
          return;
        }

        switch (e.key) {
          case "ArrowLeft":
            handlePrev();
            break;
          case "ArrowRight":
            handleNext();
            break;
          case "Space":
            toggleAutoPlay();
            break;
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, []);

    if (!slides.length) {
      return (
        <div
          ref={ref}
          className={cn(
            slideshowVariants({ size, ratio, className }),
            "flex items-center justify-center p-8"
          )}
          {...props}
        >
          <div className="text-muted-foreground">No slides to display</div>
        </div>
      );
    }

    const currentSlide = slides[currentIndex];

    return (
      <div
        ref={mergeRefs(ref, slideshowRef)}
        className={cn(slideshowVariants({ size, ratio, className }))}
        tabIndex={0}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        <div className="relative h-full">
          {/* Slide content */}
          <div className="h-full">
            {currentSlide.imageSrc ? (
              <div className="relative h-full">
                <img
                  src={currentSlide.imageSrc}
                  alt={currentSlide.imageAlt || `Slide ${currentIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                {(currentSlide.title || currentSlide.description) && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                    {currentSlide.title && (
                      <h3 className="text-xl font-semibold mb-2">{currentSlide.title}</h3>
                    )}
                    {currentSlide.description && (
                      <p className="text-sm opacity-90">{currentSlide.description}</p>
                    )}
                  </div>
                )}
              </div>
            ) : currentSlide.content ? (
              <div className="h-full p-4">{currentSlide.content}</div>
            ) : (
              <div className="flex items-center justify-center h-full p-8">
                {currentSlide.title && (
                  <h3 className="text-xl font-semibold mb-2">{currentSlide.title}</h3>
                )}
                {currentSlide.description && (
                  <p className="text-muted-foreground">{currentSlide.description}</p>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-2">
            {/* Progress bar */}
            {showProgress && (
              <div className="w-full h-1 bg-primary-200/30 dark:bg-primary-800/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
                />
              </div>
            )}

            <div className="flex items-center justify-between mt-2">
              {/* Dots */}
              {showDots && (
                <div className="flex items-center gap-1">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`Go to slide ${index + 1}`}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        index === currentIndex
                          ? "bg-primary scale-125"
                          : "bg-primary-200 dark:bg-primary-800 hover:bg-primary/70"
                      )}
                      onClick={() => handleDotClick(index)}
                    />
                  ))}
                </div>
              )}

              {/* Play/Pause and arrows */}
              <div className="flex items-center gap-2">
                {autoPlay && (
                  <button
                    type="button"
                    aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                    className="text-primary hover:text-primary/80 transition-colors p-1"
                    onClick={toggleAutoPlay}
                  >
                    {isPlaying ? (
                      <PauseIcon className="h-5 w-5" />
                    ) : (
                      <PlayIcon className="h-5 w-5" />
                    )}
                  </button>
                )}
                
                {showArrows && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous slide"
                      className="text-primary hover:text-primary/80 transition-colors p-1"
                      onClick={handlePrev}
                      disabled={!loop && currentIndex === 0}
                    >
                      <ArrowLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next slide"
                      className="text-primary hover:text-primary/80 transition-colors p-1"
                      onClick={handleNext}
                      disabled={!loop && currentIndex === slides.length - 1}
                    >
                      <ArrowRightIcon className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Slideshow.displayName = "Slideshow";

// Icon components
const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const PauseIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

// Utility for merging refs
function mergeRefs<T>(...refs: (React.Ref<T> | null | undefined)[]) {
  return (value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref) {
        (ref as React.MutableRefObject<T>).current = value;
      }
    });
  };
}
