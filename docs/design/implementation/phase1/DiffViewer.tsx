import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { parseDiff, Diff, Hunk } from "react-diff-view";
import "react-diff-view/style/index.css";

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
  showLineNumbers?: boolean;
  gutterType?: "default" | "anchor" | "none";
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
  (
    {
      className,
      size,
      maxHeight,
      oldCode,
      newCode,
      filename = "file.txt",
      language = "typescript",
      viewType = "unified",
      showLineNumbers = true,
      gutterType = "default",
      ...props
    },
    ref
  ) => {
    // Generate a unified diff
    const diffText = createDiffText(oldCode, newCode, filename);
    const files = parseDiff(diffText);
    
    // There should be only one file in this case
    const file = files[0];

    // Styling for diff components
    const renderGutter = gutterType !== "none";
    
    return (
      <div 
        ref={ref}
        className={cn(diffViewerVariants({ size, maxHeight, className }))}
        {...props}
      >
        {filename && (
          <div className="bg-primary-50 dark:bg-primary-900 border-b border-border px-4 py-2 text-sm font-medium">
            <code>{filename}</code>
          </div>
        )}
        <div className="overflow-auto p-1">
          <Diff
            viewType={viewType}
            diffType={file.type}
            hunks={file.hunks}
            className={cn("react-diff-view", size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm")}
          >
            {(hunks) =>
              hunks.map((hunk) => (
                <Hunk 
                  key={hunk.content}
                  hunk={hunk}
                  gutterType={gutterType}
                  gutterEvents={{ onClick: () => {} }}
                  className="border-b border-border last:border-0"
                  lineClassName={(line) => {
                    if (line.type === 'insert') {
                      return "diff-added";
                    }
                    if (line.type === 'delete') {
                      return "diff-removed";
                    }
                    return "";
                  }}
                />
              ))
            }
          </Diff>
        </div>
      </div>
    );
  }
);

DiffViewer.displayName = "DiffViewer";
