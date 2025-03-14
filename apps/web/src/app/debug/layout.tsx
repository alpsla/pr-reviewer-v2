import Link from 'next/link';

export default function DebugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-blue-600 text-white p-4">
        <div className="container max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-white font-bold text-xl flex items-center"
          >
            <span className="mr-2">🔍</span>
            PR Reviewer Debug
          </Link>
          
          <nav className="space-x-4">
            <Link
              href="/debug/fingerprint"
              className="text-white hover:text-blue-200 transition-colors"
            >
              Fingerprinting
            </Link>
            <Link
              href="/"
              className="text-white hover:text-blue-200 transition-colors"
            >
              Back to App
            </Link>
          </nav>
        </div>
      </header>
      
      <main>{children}</main>
      
      <footer className="py-6 text-center text-slate-500 dark:text-slate-400 text-sm border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto">
          Debug Tools - For Development Use Only
        </div>
      </footer>
    </div>
  );
}
