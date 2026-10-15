import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  LayoutDashboard,
  Monitor,
  Users,
  CreditCard,
  Ticket,
  Package,
  Database,
  LifeBuoy,
  Settings,
  Mail,
  Puzzle,
  BookOpen,
  FolderOpen,
  BarChart3,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import logo from "@/assets/logo.jpg";

const allMenuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/", viewerHidden: true },
  {
    name: "Client",
    icon: Users,
    path: "/client",
    viewerHidden: true,
  },
  { name: "PaymentMethod", icon: CreditCard, path: "/payment-method", viewerHidden: true },
  { name: "Coupon List", icon: Ticket, path: "/coupons", viewerHidden: true },
  { name: "Theme", icon: Database, path: "/theme", viewerHidden: true },
  { name: "Theme Categories", icon: FolderOpen, path: "/theme-categories", viewerHidden: true },
  {
    name: "Package",
    icon: Package,
    path: "/packages",
    viewerHidden: true,
  },
  { name: "Operation Reports", icon: BarChart3, path: "/operation-reports" },
];

export default function Sidebar() {
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");
  const isViewer = admin.role === "viewer";
  const menuItems = isViewer
    ? allMenuItems.filter((item) => !item.viewerHidden)
    : allMenuItems;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  return (
    <>
      {/* ✅ Mobile toggle */}
      <div className="md:hidden p-2 border-b">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button className="p-2">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <nav className="h-full bg-white border-r">
              <img src={logo} alt="logo" className="p-10" />
              <ul>
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="flex items-center gap-2 p-3 hover:bg-gray-100"
                      onClick={() => setMobileOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* ✅ Desktop sidebar with toggle */}
      <aside
        className={`hidden md:block h-screen bg-white border-r transition-all duration-300 ${
          desktopCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Header with persistent toggle button */}
        <div
          className={`flex items-center border-b px-3 py-4 gap-2 ${desktopCollapsed ? "justify-center" : "justify-between"}`}
        >
          {!desktopCollapsed && (
            <img src={logo} alt="logo" className="h-8" />
          )}
          <button
            onClick={() => setDesktopCollapsed(!desktopCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            title={desktopCollapsed ? "توسيع القائمة" : "تصغير القائمة"}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Menu items */}
        <ul className="pt-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 p-3 mx-2 rounded-lg hover:bg-gray-100 transition-colors ${
                  desktopCollapsed ? "justify-center" : ""
                }`}
                title={desktopCollapsed ? item.name : ""}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!desktopCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
