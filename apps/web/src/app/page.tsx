import { DashboardLink } from "@/components/ui/dashboard-link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Welcome to PR Reviewer</h1>
        
        <p className="mb-4">
          This application helps you review and manage pull requests efficiently.
        </p>

        <DashboardLink />
        
        {/* Alternative direct link */}
        <div className="mt-4 text-gray-500 text-xs">
          If the button doesn&apos;t work, try a <a 
            href="/dashboard" 
            className="text-blue-500 underline"
          >
            direct link
          </a> to the dashboard.
        </div>
      </div>
    </main>
  )
}