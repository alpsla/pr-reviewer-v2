import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Heading component variants
const headingVariants = cva("font-bold tracking-tight text-foreground", {
  variants: {
    size: {
      h1: "text-4xl leading-tight",
      h2: "text-3xl leading-tight",
      h3: "text-2xl leading-snug",
      h4: "text-xl leading-snug",
      h5: "text-lg leading-snug",
      h6: "text-base leading-snug",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
  },
  defaultVariants: {
    size: "h1",
    align: "left",
    weight: "bold",
  },
});

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, align, weight, as, ...props }, ref) => {
    const Component = as || (size as any) || "h1";
    
    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ size, align, weight, className }))}
        {...props}
      />
    );
  }
);

Heading.displayName = "Heading";

// Text component variants
const textVariants = cva("text-foreground", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    variant: {
      default: "",
      muted: "text-muted-foreground",
      accent: "text-accent",
      success: "text-success",
      warning: "text-warning",
      error: "text-error",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "normal",
    align: "left",
    variant: "default",
  },
});

interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: React.ElementType;
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, weight, align, variant, as = "p", ...props }, ref) => {
    const Component = as;
    
    return (
      <Component
        ref={ref}
        className={cn(textVariants({ size, weight, align, variant, className }))}
        {...props}
      />
    );
  }
);

Text.displayName = "Text";

// Code component variants
const codeVariants = cva(
  "font-mono rounded px-1.5 py-0.5 bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-100",
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
      },
      variant: {
        inline: "px-1.5 py-0.5",
        block: "block p-4 overflow-x-auto",
      },
    },
    defaultVariants: {
      size: "sm",
      variant: "inline",
    },
  }
);

interface CodeProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof codeVariants> {
  as?: "code" | "pre";
}

const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ className, size, variant, as = variant === "block" ? "pre" : "code", ...props }, ref) => {
    const Component = as;
    
    return (
      <Component
        ref={ref}
        className={cn(codeVariants({ size, variant, className }))}
        {...props}
      />
    );
  }
);

Code.displayName = "Code";

// Link component variants
const linkVariants = cva("cursor-pointer", {
  variants: {
    variant: {
      default: "text-accent hover:underline",
      underlined: "text-foreground underline underline-offset-4 hover:text-accent",
      subtle: "text-muted-foreground hover:text-foreground",
      nav: "text-muted-foreground hover:text-foreground transition-colors",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  external?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, external, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(linkVariants({ variant, className }))}
        {...(external && {
          target: "_blank",
          rel: "noopener noreferrer",
        })}
        {...props}
      />
    );
  }
);

Link.displayName = "Link";

export { Heading, Text, Code, Link, headingVariants, textVariants, codeVariants, linkVariants };
