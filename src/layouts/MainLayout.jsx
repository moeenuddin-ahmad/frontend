import { Link, Outlet, useNavigate } from "react-router-dom";
import { Store, LogOut, User } from "lucide-react";
import { useGetMeQuery } from "../redux/features/auth/authApi";
import { Button } from "@/components/ui/button";

export default function MainLayout() {
  const navigate = useNavigate();
  const { data: user } = useGetMeQuery();

  const handleLogout = () => {
    // Basic logout logic
    localStorage.removeItem("token");
    window.location.href = "/login"; // Force full reload to reset all RTK states safely
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 flex flex-col">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-neutral-900 group"
            >
              <div className="bg-blue-600 p-2 rounded-lg text-white group-hover:bg-blue-700 transition">
                <Store size={20} />
              </div>
              <span className="tracking-tight">TenantHub</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
              <Link to="/" className="hover:text-black transition-colors">
                Shops
              </Link>
              <Link to="/about" className="hover:text-black transition-colors">
                About
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-full border border-neutral-200">
              <div className="bg-neutral-300 p-1 rounded-full text-neutral-600">
                <User size={14} />
              </div>
              <span className="text-sm font-medium text-neutral-700 mr-2">
                {user?.name || "Admin"}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <Outlet />
      </main>

      <footer className="border-t py-8 bg-white">
        <div className="container mx-auto px-4 text-center text-sm font-medium text-neutral-500">
          © {new Date().getFullYear()} Store Management System. Built with
          Antigravity.
        </div>
      </footer>
    </div>
  );
}
