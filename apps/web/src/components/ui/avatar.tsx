import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { CodeQualLogoFinal } from "./codequal-logo-final";

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
        primary: "ring-primary ring-opacity-100",
        accent: "ring-accent ring-opacity-100",
        success: "ring-success ring-opacity-100",
        warning: "ring-warning ring-opacity-100",
        error: "ring-error ring-opacity-100",
        blue: "ring-blue-500 ring-opacity-100",
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
      console.log("Using logo fallback instead of image");
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

        // If using logo is enabled, use the CodeQual logo
        if (useLogo) {
          return (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-white to-slate-50 dark:from-slate-700 dark:to-slate-800">
              <CodeQualLogoFinal className="w-4/5 h-4/5" />
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
            // Skip memory logging since it's Chrome-specific and causes TS errors
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
};
