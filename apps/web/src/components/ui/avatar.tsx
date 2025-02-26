import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Image from "next/image";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "h-6 w-6",
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
        "2xl": "h-24 w-24",
      },
      ring: {
        none: "",
        sm: "ring-1",
        md: "ring-2",
        lg: "ring-4",
      },
      ringColor: {
        default: "ring-border",
        primary: "ring-primary",
        accent: "ring-accent",
        success: "ring-success",
        warning: "ring-warning",
        error: "ring-error",
      },
    },
    defaultVariants: {
      size: "md",
      ring: "none",
      ringColor: "default",
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  fallback?: React.ReactNode;
  useLogo?: boolean;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      size,
      ring,
      ringColor,
      src,
      alt = "User avatar",
      fallback,
      useLogo = true,
      ...props
    },
    ref
  ) => {
    const [hasError, setHasError] = React.useState(false);
    const [hasClicked, setHasClicked] = React.useState(false);

    // Handle image load error
    const handleError = () => {
      console.log("Avatar image failed to load:", { src });
      setHasError(true);
    };

    // Determine what to render
    const renderContent = () => {
      // If no source or error occurred, render fallback
      if (!src || hasError) {
        // If fallback is provided, use it
        if (fallback) {
          return <div className="flex h-full w-full items-center justify-center">{fallback}</div>;
        }

        // If using logo is enabled, use the shield logo
        if (useLogo) {
          return (
            <div className="flex h-full w-full items-center justify-center bg-white dark:bg-gray-800">
              <ShieldLogo />
            </div>
          );
        }

        // Otherwise, use initials from alt text
        const initials = getInitials(alt);
        return (
          <div className="flex h-full w-full items-center justify-center bg-blue-600 text-white font-medium dark:bg-blue-500 dark:text-blue-50">
            {initials}
          </div>
        );
      }

      // Otherwise, render the image
      return (
        <Image
          src={src}
          alt={alt}
          fill
          onError={handleError}
          className="object-cover"
        />
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          avatarVariants({ size, ring, ringColor, className }),
          hasClicked && "ring-2 ring-offset-2 ring-blue-500"
        )}
        onClick={(e) => {
          // Log click details for debugging
          console.log('Avatar clicked:', {
            src,
            alt,
            hasError,
            useLogo,
            hasFallback: !!fallback,
            size,
            ring,
            clickCount: hasClicked ? 'second+' : 'first',
            time: new Date().toISOString(),
            memory: window.performance?.memory ? 
              `${Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024))}MB / ${Math.round(window.performance.memory.jsHeapSizeLimit / (1024 * 1024))}MB` : 
              'Not available'
          });
          
          setHasClicked(true);
          
          if (props.onClick) {
            props.onClick(e);
          }
        }}
        {...props}
      >
        {renderContent()}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// Enhanced shield logo component with gradient and better colors
const ShieldLogo = () => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={true}
    className="w-4/5 h-4/5"
  >
    {/* Gradient definitions */}
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4338ca" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    
    {/* Shield shape */}
    <path
      d="M50 10 L90 30 L90 60 Q90 80 50 90 Q10 80 10 60 L10 30 Z"
      fill="url(#shieldGradient)"
      stroke="#1e3a8a"
      strokeWidth="3"
    />
    
    {/* Upper section with code brackets */}
    <path
      d="M50 10 L90 30 L90 40 L10 40 L10 30 Z"
      fill="#1e3a8a"
    />
    
    {/* Code brackets - simplified for small size */}
    <text
      x="40"
      y="30"
      fontFamily="monospace"
      fontSize="15"
      fill="#ffffff"
      textAnchor="middle"
    >
      {"{"}
    </text>
    <text
      x="60"
      y="30"
      fontFamily="monospace"
      fontSize="15"
      fill="#ffffff"
      textAnchor="middle"
    >
      {"}"}
    </text>
    
    {/* Checkmark */}
    <path
      d="M70 50 L45 75 L30 60"
      stroke="#10b981"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
