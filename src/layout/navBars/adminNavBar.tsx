import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toastRef } from "../../context/toastContext/toastContext";

function AdminNavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<number>(-1);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        setOpenDropdown(-1);
    };

    const toggleDropdown = (index: number) => {
        if (openDropdown === index) {
            setOpenDropdown(-1);
        } else {
            setOpenDropdown(index);
        }
    };

    const confirmSignOut = () => {
        toastRef.current?.("Sign Out?", "info", async () => {
            signOut();
        });
    };

    const signOut = () => {
        sessionStorage.removeItem("token");
        navigate("/admin/login");
    };

    return (
        <nav className="bg-white">
            <div
                className="hidden max-md:block cursor-pointer p-[3px] text-white text-2xl bg-[#282c34] ml-[15px] pt-2"
                onClick={toggleMenu}
            >
                ☰ Menu
            </div>
            <ul
                className={`list-none py-[3px] px-0 m-0 flex justify-around max-md:flex-col max-md:w-full max-md:text-center ${
                    isOpen ? "max-md:flex" : "max-md:hidden"
                }`}
            >
                <li className="relative text-center max-md:w-full">
                    <Link
                        to="/admin/admin-collage"
                        className="block text-white no-underline p-[10px] cursor-pointer max-md:border-t max-md:border-b max-md:border-[#444]"
                    >
                        Create Collage
                    </Link>
                </li>
                <li className="relative text-center max-md:w-full">
                    <Link
                        to="/admin/admin-orders"
                        className="block text-white no-underline p-[10px] cursor-pointer max-md:border-t max-md:border-b max-md:border-[#444]"
                    >
                        Orders
                    </Link>
                </li>
                <li className="relative text-center max-md:w-full">
                    <Link
                        to="/admin/admin-support-tickets"
                        className="block text-white no-underline p-[10px] cursor-pointer max-md:border-t max-md:border-b max-md:border-[#444]"
                    >
                        Support Tickets
                    </Link>
                </li>
                <li className="relative text-center max-md:w-full">
                    <Link
                        to="/admin/admin-custom-orders"
                        className="block text-white no-underline p-[10px] cursor-pointer max-md:border-t max-md:border-b max-md:border-[#444]"
                    >
                        Custom Orders
                    </Link>
                </li>
                <li className="relative text-center max-md:w-full group">
                    <span
                        onClick={() => toggleDropdown(0)}
                        className="block text-white no-underline p-[10px] cursor-pointer"
                    >
                        Other
                        <span className="ml-[10px] text-xs">
                            {openDropdown === 0 ? "▲" : "▼"}
                        </span>
                    </span>
                    {openDropdown === 0 && (
                        <ul
                            className={`absolute top-full left-1/2 -translate-x-1/2 bg-[#282c34] min-w-[200px] shadow-lg z-10 text-white list-none p-0 m-0 max-md:relative max-md:top-0 max-md:w-full max-md:shadow-none ${
                                openDropdown === 0 ? "block max-md:flex max-md:flex-col max-md:items-center" : "hidden"
                            }`}
                        >
                            <li className="p-[2px]">
                                <Link
                                    to="/admin/admin-add-order"
                                    className="block text-white no-underline p-[10px] hover:bg-[#282c34] max-md:text-sm"
                                >
                                    Add Order
                                </Link>
                            </li>
                            <li className="p-[2px]">
                                <Link
                                    to="/admin/admin-add-white"
                                    className="block text-white no-underline p-[10px] hover:bg-[#282c34] max-md:text-sm"
                                >
                                    Add White
                                </Link>
                            </li>
                            <li
                                onClick={confirmSignOut}
                                className="m-2 cursor-pointer text-white p-[10px]"
                            >
                                Sign Out
                            </li>
                        </ul>
                    )}
                </li>
            </ul>
        </nav>
    );
}

export default AdminNavBar;
