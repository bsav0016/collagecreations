import React, { useState, useEffect, ChangeEvent } from 'react';
import AdminNavBar from '../../layout/navBars/adminNavBar';
import CategoryDisplay from '../../components/categoryDisplay';
import { useLocation, useNavigate } from 'react-router-dom';
import GeneralButton from '../../components/generalButton/generalButton';
import HeaderSection from '../../components/headerSection';
import TextInput from '../../components/textInput/textInput';
import { toastRef } from '../../context/toastContext/toastContext';
import { useAuth } from '../../context/authContext';

interface ResolvedProps {
  title: string;
  entryDisplay: string;
  navigationExtension: string;
  type: string;
}

interface Item {
  id: number;
}

function Resolved({ title, entryDisplay, navigationExtension, type }: ResolvedProps): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState<Item[]>([]);
  const [ids, setIds] = useState<number[]>([]);
  const [typedId, setTypedId] = useState<string>('');
  const { userToken } = useAuth();

  useEffect(() => {
    if (!userToken) {
      navigate('/admin/login');
    }

    try {
      const incomingItems = location.state?.items;
      const incomingIds = incomingItems.map((item: Item) => item.id);

      setItems(incomingItems);
      setIds(incomingIds);
    }
    catch {
      navigate('/admin/login');
    }
  }, [userToken, navigate, location.state]);

  const handleGoClick = (): void => {
    const currentId = parseInt(typedId);
    if (!Number.isNaN(currentId) && ids.includes(currentId)) {
      handleGoNavigate(currentId);
    } else {
      toastRef.current?.('Please insert a valid resolved ID.');
    }
  };

  const handleGoNavigate = (id: number): void => {
    const urlExtension = '/admin/' + navigationExtension;
    navigate(urlExtension, {
      state: { id: id }
    });
  };

  return (
    <div>
      <AdminNavBar />
      <div className="text-center py-5">
        <HeaderSection
          title={title}
          fontWeight='bold'
          fontSize={32}
          marginBottom={20}
        />

        <div className="flex flex-row justify-center">
          <TextInput 
            type="text" 
            value={typedId} 
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTypedId(e.target.value)} 
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
  );
}

export default Resolved;
