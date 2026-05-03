import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-neutral-50/50">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-xl font-bold bg-neutral-900 text-white px-3 py-1 rounded"
            >
              StoreAdmin
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link to="/" className="hover:text-black transition-colors">
                Products
              </Link>
              <Link to="/about" className="hover:text-black transition-colors">
                About
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {/* Account/Status placeholder */}
            <div className="size-8 rounded-full bg-neutral-200 border border-neutral-300" />
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t py-6 bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-neutral-500">
          © 2026 Store Management System. Built with Antigravity.
        </div>
      </footer>
    </div>
  );
}
