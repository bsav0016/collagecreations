import { useNavigate } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../../components/ui/menubar";

function NavBar() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="w-full flex justify-center p-4">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger onClick={() => handleNavigation("/")}>
            Home
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger onClick={() => handleNavigation("/collage")}>
            Create Collage
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger onClick={() => handleNavigation("/tips")}>
            Helpful Tips
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Other Order</MenubarTrigger>
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
          <MenubarTrigger onClick={() => handleNavigation("/support")}>
            Support
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    </nav>
  );
}

export default NavBar;
