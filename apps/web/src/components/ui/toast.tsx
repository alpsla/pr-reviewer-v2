import * as React from "react"
import { cn } from "@/lib/utils"

export type ToastProps = {
  className?: string
  children?: React.ReactNode
  title?: string
  description?: string
  variant?: "default" | "destructive"
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export type ToastActionElement = React.ReactElement

const Toast = React.forwardRef<
  HTMLDivElement,
  ToastProps
>(({ className, title, description, variant = "default", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "fixed top-0 right-0 z-50 m-4 max-w-sm rounded-lg border p-4 shadow-md",
        variant === "destructive" && "border-red-500 bg-red-100 text-red-700",
        variant === "default" && "border-gray-200 bg-white text-gray-800",
        className
      )}
      {...props}
    >
      {title && <h3 className="font-medium">{title}</h3>}
      {description && <p className="text-sm opacity-90">{description}</p>}
      {children}
    </div>
  )
})
Toast.displayName = "Toast"

export { Toast }

interface ToasterProps {
  toasts: ToastProps[]
}

const Toaster: React.FC<ToasterProps> = ({ toasts }) => {
  return (
    <>
      {toasts.map((toast, index) => (
        <Toast key={index} {...toast} />
      ))}
    </>
  )
}

export { Toaster }
