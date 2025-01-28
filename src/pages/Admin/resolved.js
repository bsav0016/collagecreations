import React, { useState, useEffect } from 'react';
import AdminNavBar from '../../layout/navBars/adminNavBar';
import CategoryDisplay from '../../components/categoryDisplay';
import { useLocation, useNavigate } from 'react-router-dom';
import GeneralButton from '../../components/generalButton/generalButton';
import HeaderSection from '../../components/headerSection';
import TextInput from '../../components/textInput/textInput';
import styles from './search.module.css';
import { toastRef } from '../../context/toastContext/toastContext';
import { useAuth } from '../../context/authContext';

function Resolved({ title, entryDisplay, navigationExtension, type }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [items, setItems] = useState([]);
    const [ids, setIds] = useState([]);
    const [typedId, setTypedId] = useState('');
    const { userToken } = useAuth();

    useEffect(() => {
        if (!userToken) {
            navigate('/admin/login');
        }

        try {
            const incomingItems = location.state.items;
            const incomingIds = incomingItems.map(item => item.id);

            setItems(incomingItems);
            setIds(incomingIds);
        }
        catch {
            navigate('/admin/login');
        }
    }, []);

    const handleGoClick = () => {
        const currentId = parseInt(typedId);
        if (!Number.isNaN(currentId) && ids.includes(currentId)) {
            handleGoNavigate(currentId);
        } else {
            toastRef.current('Please insert a valid resolved ID.');
        }
    }

    const handleGoNavigate = (id) => {
        const urlExtension = '/admin/' + navigationExtension;
        navigate(urlExtension, {
            state: { id: id }
        });
      }

    return(
        <div>
            <AdminNavBar />
            <div className="App">
                <HeaderSection
                    title={title}
                    fontWeight='bold'
                    fontSize={32}
                    marginBottom={20}
                />

                <div className={styles.search}>
                    <TextInput 
                        type="text" 
                        value={typedId} 
                        onChange={(e) => setTypedId(e.target.value)} 
                        placeholder={entryDisplay}
                        maxWidth='300px'
                    />

                    <GeneralButton
                        onClick={handleGoClick}
                        text={"Go"}
                    />
                </div>

                <CategoryDisplay title='' type={type} items={items} />
            </div>
        </div>
    )
}

export default Resolved;