import { useNavigate, useLocation } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../../components/ui/menubar";
import { cn } from "../../lib/utils";
//import MosaicMakerLogo from "../../assets/MosaicMakerNoText.png";
import Logo from "../../assets/medium-logo.png"

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/collage";

  const handleNavigation = (path: string) => {
    navigate(path);
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

  return (
    <nav className="w-full flex items-center p-4">
        <img
          src={Logo}
          alt="Collage Creations Logo"
          className="h-12 cursor-pointer ml-4"
          onClick={() => handleNavigation("/")}
        />
      <div className={cn("flex justify-center", isHomePage ? "w-full" : "flex-1")}>
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
            <MenubarItem
              onClick={() => handleNavigation("/regular-image-order")}
            >
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
    </nav>
  );
}

export default NavBar;
