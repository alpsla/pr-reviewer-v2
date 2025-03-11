import * as React from "react"
import { Toast, Toaster as ToastContainer } from "../toast"
import { useToast } from "../use-toast"

export function Toaster() {
  const { toast } = useToast()
  const [toasts, setToasts] = React.useState<React.ComponentProps<typeof Toast>[]>([])

  React.useEffect(() => {
    const handleToast = (event: CustomEvent<any>) => {
      setToasts((current) => [...current, event.detail])
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setToasts((current) => current.filter(t => t !== event.detail))
      }, 5000)
    }

    window.addEventListener("toast" as any, handleToast as EventListener)
    return () => window.removeEventListener("toast" as any, handleToast as EventListener)
  }, [])

  return <ToastContainer toasts={toasts} />
}
