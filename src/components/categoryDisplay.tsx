import { useNavigate } from "react-router-dom";
import GeneralButton from "./generalButton/generalButton";
import { toastRef } from "../context/toastContext/toastContext";

interface Item {
    id: string | number;
}

interface CategoryDisplayProps {
    title: string;
    type: "order" | "supportTicket" | "customOrder" | string;
    items: Item[];
}

function CategoryDisplay({ title, type, items }: CategoryDisplayProps) {
    const navigate = useNavigate();
    let navigationPath: string;
    let itemTitle: string;

    if (type === "order") {
        navigationPath = "/admin/admin-order/";
        itemTitle = "Order";
    } else if (type === "supportTicket") {
        navigationPath = "/admin/admin-support-ticket/";
        itemTitle = "Ticket";
    } else if (type === "customOrder") {
        navigationPath = "/admin/admin-custom-order/";
        itemTitle = "Ticket";
    } else {
        navigationPath = "other";
        itemTitle = "";
    }

    const handleItemClick = (id: string | number) => {
        if (navigationPath === "other") {
            toastRef.current?.("Invalid navigation path");
            return;
        }
        navigate(navigationPath, {
            state: { id: id },
        });
    };

    return (
        <div>
            <h2>{title}</h2>
            {items.map((item) => (
                <GeneralButton
                    onClick={() => handleItemClick(item.id)}
                    text={
                        <>
                            {itemTitle} {item.id}
                        </>
                    }
                    key={item.id}
                    fullWidth={true}
                />
            ))}
        </div>
    );
}

export default CategoryDisplay;
