import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Highlight, themes } from "prism-react-renderer";

const codeBlockVariants = cva(
  "font-mono text-sm rounded-md overflow-hidden",
  {
    variants: {
      variant: {
        primary: "bg-primary-50 dark:bg-primary-900 border border-primary-200 dark:border-primary-800",
        secondary: "bg-card text-card-foreground border border-border",
        ghost: "bg-transparent",
      },
      size: {
        sm: "text-xs p-2",
        md: "text-sm p-4",
        lg: "text-base p-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface CodeBlockProps
  extends React.HTMLAttributes<HTMLPreElement>,
    VariantProps<typeof codeBlockVariants> {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  maxHeight?: string;
  title?: string;
}

function getLanguageFromClassName(className?: string): string {
  if (!className) {
    return "typescript";
  }
  const match = className.match(/language-(\w+)/);
  return match ? match[1] : "typescript";
}

export const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  (
    {
      className,
      variant,
      size,
      code,
      language,
      showLineNumbers = true,
      highlightLines = [],
      maxHeight = "400px",
      title,
      ...props
    },
    ref
  ) => {
    // Extract language from className if provided (e.g. 'language-typescript')
    const languageFromClass = getLanguageFromClassName(className);
    const codeLanguage = language || languageFromClass;

    return (
      <div className={cn("group relative", className)}>
        {title && (
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-primary-50 dark:bg-primary-900 text-sm font-medium">
            {title}
            <button
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(code);
              }}
              aria-label="Copy code"
            >
              <CopyIcon className="h-4 w-4" />
            </button>
          </div>
        )}
        <div
          className={cn("relative overflow-auto", !title && "rounded-t-md")}
          style={{ maxHeight }}
        >
          <Highlight
            theme={themes.nightOwl}
            code={code.trim()}
            language={codeLanguage as any}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                ref={ref}
                className={cn(
                  codeBlockVariants({ variant, size }),
                  className
                )}
                style={style}
                {...props}
              >
                {!title && (
                  <button
                    className="absolute top-2 right-2 p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                    onClick={() => {
                      navigator.clipboard.writeText(code);
                    }}
                    aria-label="Copy code"
                  >
                    <CopyIcon className="h-4 w-4" />
                  </button>
                )}
                <code>
                  {tokens.map((line, lineIndex) => {
                    const lineNumber = lineIndex + 1;
                    const isHighlighted = highlightLines.includes(lineNumber);
                    const lineProps = getLineProps({ line, key: lineIndex });

                    return (
                      <div
                        key={lineIndex}
                        {...lineProps}
                        className={cn(
                          lineProps.className,
                          "px-4 border-l-2 border-transparent",
                          isHighlighted && "bg-primary-100 dark:bg-primary-800 border-l-2 border-accent"
                        )}
                      >
                        {showLineNumbers && (
                          <span className="inline-block w-8 pr-4 text-right select-none text-muted-foreground">
                            {lineNumber}
                          </span>
                        )}
                        <span>
                          {line.map((token, tokenIndex) => (
                            <span
                              key={tokenIndex}
                              {...getTokenProps({ token, key: tokenIndex })}
                            />
                          ))}
                        </span>
                      </div>
                    );
                  })}
                </code>
              </pre>
            )}
          </Highlight>
        </div>
      </div>
    );
  }
);

CodeBlock.displayName = "CodeBlock";

// Simple copy icon component
const CopyIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-4 w-4", className)}
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
