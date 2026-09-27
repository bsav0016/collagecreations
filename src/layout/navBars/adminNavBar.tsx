import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "../../components/ui/menubar";
import { cn } from "../../lib/utils";
import { toastRef } from "../../context/toastContext/toastContext";
import { Menu, X } from "lucide-react";

function AdminNavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string | string[]) => {
        const paths = Array.isArray(path) ? path : [path];
        return paths.some((p) => location.pathname.startsWith(p));
    };

    const activeClass = "bg-primary text-primary-foreground font-semibold";

    const handleNavigation = (path: string) => {
        navigate(path);
        setMenuOpen(false);
    };

    const confirmSignOut = () => {
        setMenuOpen(false);
        toastRef.current?.("Sign Out?", "info", async () => {
            signOut();
        });
    };

    const signOut = () => {
        sessionStorage.removeItem("token");
        navigate("/admin/login");
    };

    const navLinks = [
        { label: "Create Collage", path: "/admin/admin-collage" },
        { label: "Orders", path: "/admin/admin-orders" },
        { label: "Support Tickets", path: "/admin/admin-support-tickets" },
        { label: "Custom Orders", path: "/admin/admin-custom-orders" },
    ];

    return (
        <>
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 dark:bg-black/65 z-40 md:hidden"
                    onClick={() => setMenuOpen(false)}
                />
            )}
            <nav className="w-full bg-background border-b border-border shadow-sm relative z-50">
                <div className="flex items-center p-4">
                    <div className={cn("hidden md:flex justify-center flex-1")}>
                        <Menubar>
                            {navLinks.map(({ label, path }) => (
                                <MenubarMenu key={path}>
                                    <MenubarTrigger
                                        onClick={() => handleNavigation(path)}
                                        className={cn(isActive(path) && activeClass)}
                                    >
                                        {label}
                                    </MenubarTrigger>
                                </MenubarMenu>
                            ))}

                            <MenubarMenu>
                                <MenubarTrigger
                                    className={cn(
                                        isActive(["/admin/admin-add-order", "/admin/admin-add-white"]) && activeClass
                                    )}
                                >
                                    Other
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarItem onClick={() => handleNavigation("/admin/admin-add-order")}>
                                        Add Order
                                    </MenubarItem>
                                    <MenubarItem onClick={() => handleNavigation("/admin/admin-add-white")}>
                                        Add White
                                    </MenubarItem>
                                    <MenubarItem onClick={confirmSignOut}>
                                        Sign Out
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                    </div>

                    <button
                        className="md:hidden ml-auto p-2"
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {menuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-lg flex flex-col">
                        {navLinks.map(({ label, path }) => (
                            <button
                                key={path}
                                onClick={() => handleNavigation(path)}
                                className={cn(
                                    "text-left px-6 py-3 hover:bg-muted",
                                    isActive(path) && activeClass
                                )}
                            >
                                {label}
                            </button>
                        ))}
                        <div className="px-6 py-1 text-sm text-muted-foreground font-medium">Other</div>
                        <button
                            onClick={() => handleNavigation("/admin/admin-add-order")}
                            className="text-left px-8 py-2 hover:bg-muted"
                        >
                            Add Order
                        </button>
                        <button
                            onClick={() => handleNavigation("/admin/admin-add-white")}
                            className="text-left px-8 py-2 hover:bg-muted mb-2"
                        >
                            Add White
                        </button>
                        <button
                            onClick={confirmSignOut}
                            className="text-left px-8 py-2 hover:bg-muted mb-2"
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </nav>
        </>
    );
}

export default AdminNavBar;
