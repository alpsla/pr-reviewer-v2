import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { parseDiff, Diff } from "react-diff-view";
// Note: CSS import removed to avoid build errors - add appropriate styles in globals.css

const diffViewerVariants = cva(
  "font-mono text-sm rounded-md overflow-hidden border border-border bg-background",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
      maxHeight: {
        default: "max-h-[400px]",
        large: "max-h-[600px]",
        full: "max-h-none",
      },
    },
    defaultVariants: {
      size: "md",
      maxHeight: "default",
    },
  }
);

interface DiffViewerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof diffViewerVariants> {
  oldCode: string;
  newCode: string;
  filename?: string;
  language?: string;
  viewType?: "split" | "unified";
}

function createDiffText(oldCode: string, newCode: string, filename: string = "file.txt") {
  return `--- a/${filename}\n+++ b/${filename}\n@@ -1,${
    oldCode.split("\n").length
  } +1,${newCode.split("\n").length} @@\n${oldCode
    .split("\n")
    .map((line) => `-${line}`)
    .join("\n")}\n${newCode
    .split("\n")
    .map((line) => `+${line}`)
    .join("\n")}`;
}

export const DiffViewer = React.forwardRef<HTMLDivElement, DiffViewerProps>(
  (props, ref) => {
    const {
      className,
      size,
      maxHeight,
      oldCode,
      newCode,
      filename = "file.txt",
      language = "typescript",
      viewType = "unified",
      ...otherProps
    } = props;

    // Generate a unified diff
    const diffText = createDiffText(oldCode, newCode, filename);
    const files = parseDiff(diffText);
    
    // There should be only one file in this case
    const file = files[0];
    
    return (
      <div 
        ref={ref}
        className={cn(diffViewerVariants({ size, maxHeight, className }))}
        {...otherProps}
      >
        {filename && (
          <div className="bg-primary-50 dark:bg-primary-900 border-b border-border px-4 py-2 text-sm font-medium">
            <code>{filename}</code>
          </div>
        )}
        <div className="overflow-auto p-1">
          <Diff
            viewType={viewType === 'split' ? 'split' : 'unified'}
            diffType={file.type}
            hunks={file.hunks}
            className={cn("react-diff-view", size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm")}
          />
        </div>
      </div>
    );
  }
);

DiffViewer.displayName = "DiffViewer";
