import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        filled: "bg-primary-50 dark:bg-primary-900 border-transparent focus:bg-background",
        flushed: "rounded-none border-0 border-b px-0 focus:border-primary",
        outlined: "bg-transparent",
      },
      inputSize: {  // renamed from 'size' to 'inputSize'
        default: "h-10 px-3 py-2",
        sm: "h-8 px-2 py-1 text-xs",
        lg: "h-12 px-4 py-3 text-base",
      },
      status: {
        default: "",
        error: "border-error focus-visible:ring-error",
        success: "border-success focus-visible:ring-success",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",  // updated here too
      status: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    Omit<VariantProps<typeof inputVariants>, "type"> {
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  status?: "default" | "error" | "success";
  inputSize?: "default" | "sm" | "lg";  // renamed prop
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      inputSize,  // renamed from 'size'
      status,
      leftElement,
      rightElement,
      type,
      ...props
    },
    ref
  ) => {
    const wrapperClasses = cn(
      "relative flex items-center",
      {
        "space-x-2": leftElement || rightElement,
      }
    );

    return (
      <div className={wrapperClasses}>
        {leftElement && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftElement}
          </div>
        )}

        <input
          type={type}
          className={cn(
            inputVariants({ variant, inputSize, status, className }),  // updated here
            leftElement && "pl-10",
            rightElement && "pr-10"
          )}
          ref={ref}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
