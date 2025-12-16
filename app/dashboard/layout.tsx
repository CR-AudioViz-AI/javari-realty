import Sidebar from '@/components/dashboard/Sidebar'
import UserHeader from '@/components/UserHeader'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header with User Profile */}
        <header className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
              RealtorPro
            </span>
          </div>
          <UserHeader />
        </header>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
        
        {/* CR AudioViz AI Footer */}
        <footer className="bg-white border-t px-6 py-3 text-center text-xs text-gray-500">
          Part of the{' '}
          <a 
            href="https://craudiovizai.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            CR AudioViz AI
          </a>
          {' '}ecosystem • Your Story. Our Design.
        </footer>
      </main>
    </div>
  )
}
