import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Container component
const containerVariants = cva("mx-auto px-4 sm:px-6 lg:px-8", {
  variants: {
    size: {
      sm: "max-w-screen-sm",
      md: "max-w-screen-md",
      lg: "max-w-screen-lg",
      xl: "max-w-screen-xl",
      "2xl": "max-w-screen-2xl",
      full: "max-w-full",
    },
  },
  defaultVariants: {
    size: "xl",
  },
});

interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(containerVariants({ size, className }))} 
      {...props} 
    />
  )
);

Container.displayName = "Container";

// Stack component
interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column";
  spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    { 
      className, 
      direction = "column", 
      spacing = 4, 
      align, 
      justify,
      wrap = false,
      ...props 
    }, 
    ref
  ) => {
    // Map spacing to Tailwind classes
    const spacingMap: Record<number, string> = {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
      16: "gap-16",
    };

    // Map align to Tailwind classes
    const alignMap: Record<string, string> = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    };

    // Map justify to Tailwind classes
    const justifyMap: Record<string, string> = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    };

    const stackClasses = cn(
      "flex",
      direction === "column" ? "flex-col" : "flex-row",
      spacingMap[spacing],
      align && alignMap[align],
      justify && justifyMap[justify],
      wrap && "flex-wrap",
      className
    );

    return <div ref={ref} className={stackClasses} {...props} />;
  }
);

Stack.displayName = "Stack";

// Grid component
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  rowGap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  columnGap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, columns = 3, gap, rowGap, columnGap, ...props }, ref) => {
    // Map columns to grid template columns
    const columnsMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
      6: "grid-cols-1 sm:grid-cols-3 lg:grid-cols-6",
      12: "grid-cols-2 sm:grid-cols-4 lg:grid-cols-12",
    };

    // Map gap to Tailwind classes
    const gapMap: Record<number, string> = {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
    };

    // Map row gap to Tailwind classes
    const rowGapMap: Record<number, string> = {
      0: "gap-y-0",
      1: "gap-y-1",
      2: "gap-y-2",
      3: "gap-y-3",
      4: "gap-y-4",
      5: "gap-y-5",
      6: "gap-y-6",
      8: "gap-y-8",
      10: "gap-y-10",
      12: "gap-y-12",
    };

    // Map column gap to Tailwind classes
    const columnGapMap: Record<number, string> = {
      0: "gap-x-0",
      1: "gap-x-1",
      2: "gap-x-2",
      3: "gap-x-3",
      4: "gap-x-4",
      5: "gap-x-5",
      6: "gap-x-6",
      8: "gap-x-8",
      10: "gap-x-10",
      12: "gap-x-12",
    };

    const gridClasses = cn(
      "grid",
      columnsMap[columns],
      gap !== undefined && gapMap[gap],
      rowGap !== undefined && rowGapMap[rowGap],
      columnGap !== undefined && columnGapMap[columnGap],
      className
    );

    return <div ref={ref} className={gridClasses} {...props} />;
  }
);

Grid.displayName = "Grid";

// Divider component
interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "dashed" | "dotted";
}

const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ className, orientation = "horizontal", variant = "solid", ...props }, ref) => {
    const dividerClasses = cn(
      "border-border",
      orientation === "horizontal" ? "w-full" : "h-full",
      variant === "solid" ? "border-0 border-t" : variant === "dashed" ? "border-0 border-t border-dashed" : "border-0 border-t border-dotted",
      orientation === "vertical" && "border-t-0 border-l h-full mx-1",
      className
    );

    return <hr ref={ref} className={dividerClasses} {...props} />;
  }
);

Divider.displayName = "Divider";

// Aspect Ratio component
interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number;
  children: React.ReactNode;
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ className, ratio = 16 / 9, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("relative w-full", className)} {...props}>
        <div
          className="w-full"
          style={{
            paddingBottom: `${(1 / ratio) * 100}%`,
          }}
        />
        <div className="absolute inset-0">{children}</div>
      </div>
    );
  }
);

AspectRatio.displayName = "AspectRatio";

export { Container, Stack, Grid, Divider, AspectRatio };
