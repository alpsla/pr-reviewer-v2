import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const videoPlayerVariants = cva(
  "overflow-hidden rounded-lg border border-border bg-card",
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
        "21:9": "aspect-[21/9]",
      },
    },
    defaultVariants: {
      size: "md",
      ratio: "16:9",
    },
  }
);

type VideoSource = "youtube" | "vimeo" | "local";

interface VideoPlayerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof videoPlayerVariants> {
  src: string;
  type?: VideoSource;
  title?: string;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  startAt?: number; // Seconds to start the video at
}

export const VideoPlayer = React.forwardRef<HTMLDivElement, VideoPlayerProps>(
  (
    {
      className,
      size,
      ratio,
      src,
      type = "youtube",
      title = "Video player",
      poster,
      autoPlay = false,
      controls = true,
      loop = false,
      muted = false,
      startAt = 0,
      ...props
    },
    ref
  ) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const renderVideoContent = () => {
      switch (type) {
        case "youtube": {
          // Process YouTube URL to get video ID
          const videoId = getYouTubeVideoId(src);
          if (!videoId) {
            return <div className="text-error p-4">Invalid YouTube URL</div>;
          }

          // Construct YouTube embed URL with parameters
          const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
          
          // Add optional parameters
          if (autoPlay) embedUrl.searchParams.append("autoplay", "1");
          if (controls) embedUrl.searchParams.append("controls", "1");
          else embedUrl.searchParams.append("controls", "0");
          if (loop) embedUrl.searchParams.append("loop", "1");
          if (muted) embedUrl.searchParams.append("mute", "1");
          if (startAt > 0) embedUrl.searchParams.append("start", startAt.toString());
          
          return (
            <iframe
              src={embedUrl.toString()}
              title={title}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
              onError={() => setError("Failed to load YouTube video")}
            />
          );
        }
        
        case "vimeo": {
          // Process Vimeo URL to get video ID
          const videoId = getVimeoVideoId(src);
          if (!videoId) {
            return <div className="text-error p-4">Invalid Vimeo URL</div>;
          }

          // Construct Vimeo embed URL with parameters
          const embedUrl = new URL(`https://player.vimeo.com/video/${videoId}`);
          
          // Add optional parameters
          if (autoPlay) embedUrl.searchParams.append("autoplay", "1");
          if (!controls) embedUrl.searchParams.append("controls", "0");
          if (loop) embedUrl.searchParams.append("loop", "1");
          if (muted) embedUrl.searchParams.append("muted", "1");
          if (startAt > 0) embedUrl.searchParams.append("t", startAt.toString());
          
          return (
            <iframe
              src={embedUrl.toString()}
              title={title}
              className="absolute inset-0 w-full h-full border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
              onError={() => setError("Failed to load Vimeo video")}
            />
          );
        }
        
        case "local":
          return (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              poster={poster}
              autoPlay={autoPlay}
              controls={controls}
              loop={loop}
              muted={muted}
              onLoadedData={() => setIsLoading(false)}
              onError={() => setError("Failed to load video")}
            >
              <source src={src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          );
          
        default:
          return <div className="text-error p-4">Unsupported video type</div>;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(videoPlayerVariants({ size, ratio, className }))}
        {...props}
      >
        <div className="relative w-full h-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-card">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
          )}
          
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-card text-error">
              {error}
            </div>
          ) : (
            renderVideoContent()
          )}
        </div>
      </div>
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";

// Helper functions for extracting video IDs
function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function getVimeoVideoId(url: string): string | null {
  const regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
  const match = url.match(regExp);
  return match && match[5] ? match[5] : null;
}
