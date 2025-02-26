import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const logoVariants = cva("inline-block", {
  variants: {
    size: {
      xs: "h-6 w-6",
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
      "2xl": "h-24 w-24",
      "3xl": "h-32 w-32",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface LogoProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof logoVariants> {
  withText?: boolean;
  textPosition?: "right" | "bottom";
  altText?: string;
  greenCheckmark?: boolean;
  fillBackground?: boolean;
}

export const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  (
    {
      className,
      size,
      withText = false,
      textPosition = "right",
      altText = "CodeQual.dev",
      greenCheckmark = true,
      fillBackground = true,
      ...props
    },
    ref
  ) => {
    const checkmarkColor = greenCheckmark ? "#10b981" : "currentColor"; // Success color from theme

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          textPosition === "bottom" ? "flex-col" : "flex-row",
          "items-center transition-all duration-150",
          className
        )}
        {...props}
      >
        <div className={logoVariants({ size })}>
          <svg
            viewBox="0 0 800 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden={true}
            className="w-full h-full"
          >
            {/* Background Circle */}
            <circle
              cx="400"
              cy="400"
              r="400"
              fill="none"
            />
            
            {/* Shield shape - positioned slightly lower to have tips extend above circle */}
            <path
              d="M400 70
               L700 200
               L700 450
               Q700 600 400 730
               Q100 600 100 450
               L100 200
               Z"
              fill={fillBackground ? "#ffffff" : "none"}
              stroke="currentColor"
              strokeWidth="25"
            />
            
            {/* Inner shield */}
            <path
              d="M400 130
               L630 240
               L630 430
               Q630 550 400 650
               Q170 550 170 430
               L170 240
               Z"
              fill={fillBackground ? "#ffffff" : "none"}
              stroke="currentColor"
              strokeWidth="8"
            />
            
            {/* Upper section with code brackets */}
            <path
              d="M400 130
               L630 240
               L630 320
               L170 320
               L170 240
               Z"
              fill="currentColor"
            />
            
            {/* Code brackets */}
            <g>
              <text
                x="330"
                y="265"
                fontFamily="monospace"
                fontSize="100"
                fill="white"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {"{"}
              </text>
              <text
                x="470"
                y="265"
                fontFamily="monospace"
                fontSize="100"
                fill="white"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {"}"}
              </text>
            </g>
            
            {/* Checkmark - make it more visible */}
            <path
              d="M540 420L380 580L260 460"
              stroke={checkmarkColor}
              strokeWidth="50"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
        {withText && (
          <div
            className={cn(
              "font-semibold",
              textPosition === "bottom" ? "mt-2" : "ml-2",
              size === "xs" || size === "sm"
                ? "text-lg"
                : size === "md"
                ? "text-xl"
                : size === "lg"
                ? "text-2xl"
                : "text-3xl"
            )}
          >
            CodeQual.dev
          </div>
        )}
        {altText && <span className="sr-only">{altText}</span>}
      </div>
    );
  }
);

Logo.displayName = "Logo";

// Icon-only version of the logo
export const LogoIcon = React.forwardRef<
  HTMLDivElement,
  Omit<LogoProps, "withText" | "textPosition">
>(({ className, size, greenCheckmark = true, fillBackground = true, ...props }, ref) => {
  return <Logo 
    ref={ref} 
    className={className} 
    size={size} 
    withText={false} 
    greenCheckmark={greenCheckmark}
    fillBackground={fillBackground}
    {...props} 
  />;
});

LogoIcon.displayName = "LogoIcon";
