import { Link } from "react-router-dom"
import { Menu } from "lucide-react"
import {
    LayoutDashboard, Monitor, Users, CreditCard, Ticket, Package,
    Database, LifeBuoy, Settings, Mail, Puzzle, BookOpen
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import logo from "@/assets/logo.png"

const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    // { name: "Frontend", icon: Monitor, path: "/frontend" },
    {
        name: "Client", icon: Users, path: "/client"
    },
    { name: "PaymentMethod", icon: CreditCard, path: "/payment-method" },
    { name: "Coupon List", icon: Ticket, path: "/coupons" },
    { name: "Theme", icon: Database, path: "/theme" },
    {
        name: "Package", icon: Package, path: "/packages"
    },


]

export default function Sidebar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [desktopCollapsed, setDesktopCollapsed] = useState(false)

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
            <aside className={`hidden md:block h-screen bg-white border-r transition-all duration-300 ${desktopCollapsed ? 'w-16' : 'w-64'
                }`}>
                {/* Header with toggle functionality */}
                <div className={`flex items-center p-6 border-b ${desktopCollapsed ? 'justify-center' : 'justify-start'}`}>
                    {desktopCollapsed ? (
                        // Show only Menu button when collapsed
                        <button
                            onClick={() => setDesktopCollapsed(!desktopCollapsed)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    ) : (
                        // Show only Logo when expanded
                        <img
                            src={logo}
                            alt="logo"
                            className="h-8 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setDesktopCollapsed(!desktopCollapsed)}
                        />
                    )}
                </div>

                {/* Menu items */}
                <ul className="pt-4">
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 p-3 mx-2 rounded-lg hover:bg-gray-100 transition-colors ${desktopCollapsed ? 'justify-center' : ''
                                    }`}
                                title={desktopCollapsed ? item.name : ''}
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
    )
}