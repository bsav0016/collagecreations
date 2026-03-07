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
import Logo from "../../assets/medium-logo.png";
import { Menu, X } from "lucide-react";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/collage";
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const isActive = (path: string | string[]) => {
    const paths = Array.isArray(path) ? path : [path];
    return paths.some((p) => {
      if (p === "/") {
        return location.pathname === "/" || location.pathname === "/collage";
      }
      return location.pathname.startsWith(p);
    });
  };

  const activeClass = "bg-primary text-primary-foreground font-semibold";

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Helpful Tips", path: "/tips" },
    { label: "Support", path: "/support" },
    { label: "Settings", path: "/settings" },
  ];

  return (
    <>
      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/65 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    <nav className="w-full bg-background border-b border-border shadow-sm relative z-50">
      <div className="flex items-center p-4">
        <img
          src={Logo}
          alt="Collage Creations Logo"
          className="h-12 cursor-pointer ml-4"
          onClick={() => handleNavigation("/")}
        />

        {/* Desktop menu */}
        <div className={cn("hidden md:flex justify-center", isHomePage ? "w-full" : "flex-1")}>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger
                onClick={() => handleNavigation("/")}
                className={cn(isActive("/") && activeClass)}
              >
                Home
              </MenubarTrigger>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger
                onClick={() => handleNavigation("/tips")}
                className={cn(isActive("/tips") && activeClass)}
              >
                Helpful Tips
              </MenubarTrigger>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger
                className={cn(isActive(["/regular-image-order", "/custom-order"]) && activeClass)}
              >
                Other Order
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => handleNavigation("/regular-image-order")}>
                  Regular Large Format Print
                </MenubarItem>
                <MenubarItem onClick={() => handleNavigation("/custom-order")}>
                  Request Custom Order
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger
                onClick={() => handleNavigation("/support")}
                className={cn(isActive("/support") && activeClass)}
              >
                Support
              </MenubarTrigger>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger
                onClick={() => handleNavigation("/settings")}
                className={cn(isActive("/settings") && activeClass)}
              >
                Settings
              </MenubarTrigger>
            </MenubarMenu>
          </Menubar>
        </div>

        {/* Hamburger button */}
        <button
          className="md:hidden ml-auto p-2"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown overlay */}
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
          <div className="px-6 py-1 text-sm text-muted-foreground font-medium">Other Order</div>
          <button
            onClick={() => handleNavigation("/regular-image-order")}
            className={cn("text-left px-8 py-2 hover:bg-muted", isActive("/regular-image-order") && activeClass)}
          >
            Regular Large Format Print
          </button>
          <button
            onClick={() => handleNavigation("/custom-order")}
            className={cn("text-left px-8 py-2 hover:bg-muted mb-2", isActive("/custom-order") && activeClass)}
          >
            Request Custom Order
          </button>
        </div>
      )}
    </nav>
    </>
  );
}

export default NavBar;
