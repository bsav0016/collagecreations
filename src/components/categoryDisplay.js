import { useNavigate } from "react-router-dom";
import GeneralButton from "./generalButton/generalButton";
import { toastRef } from "../context/toastContext/toastContext";

function CategoryDisplay({ title, type, items }) {
    const navigate = useNavigate();
    let navigationPath;
    let itemTitle;
    if (type === 'order') {
        navigationPath = '/admin/admin-order/';
        itemTitle = 'Order';
    }
    else if (type === 'supportTicket') {
        navigationPath = '/admin/admin-support-ticket/';
        itemTitle = 'Ticket';
    }
    else if (type === 'customOrder') {
        navigationPath = '/admin/admin-custom-order/';
        itemTitle = 'Ticket'
    }
    else {
        navigationPath = 'other';
        itemTitle = '';
    }

    const handleItemClick = (id) => {
        if (navigationPath === 'other') {
            toastRef.current('Invalid navigation path');
            return
        }
        navigate(navigationPath, {
            state: { id: id }
        })
    }

    return (
        <div>
            <h2>{title}</h2>
            {items.map(item => (
                <GeneralButton
                    onClick={() => handleItemClick(item.id)}
                    text={<>{itemTitle} {item.id}</>}
                    key={item.id}
                    fullWidth={true}
                />
            ))}
        </div>
    )
}

export default CategoryDisplay;