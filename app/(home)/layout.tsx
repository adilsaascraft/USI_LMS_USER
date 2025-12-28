import Sidebar from '@/components/Sidebar'
import DashboardNavbar from '@/components/DashboardNavbar'
import MobileNavbar from '@/components/MobileNavbar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* ✅ Top Navbar (always visible) */}
        <DashboardNavbar />

        {/* ✅ Mobile Navbar (only visible on mobile & tablet) */}
        <div className="block lg:hidden sticky top-[56px] z-50">
          <MobileNavbar />
        </div>

        {/* ✅ Main layout (Sidebar + Content) */}
        <div className="flex flex-1">
          {/* Sidebar hidden on mobile/tablet */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  )
}
