import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from '../../layout/navBars/adminNavBar';
import CategoryDisplay from '../../components/categoryDisplay';
import GeneralButton from '../../components/generalButton/generalButton';
import TicketService from '../../services/TicketService'
import TextInput from '../../components/textInput/textInput';
import LoadingScreen from '../../components/loadingScreen/loadingScreen';
import styles from './search.module.css';
import HeaderSection from '../../components/headerSection';
import { toastRef } from '../../context/toastContext/toastContext';
import { useAuth } from '../../context/authContext';
import appStyles from '../../App.module.css';

function AdminTickets({ customOrder }) {
  const [ticketId, setTicketId] = useState('');
  const [ticketIds, setTicketIds] = useState([]);
  const [unactionedTickets, setUnactionedTickets] = useState([]);
  const [inProgressTickets, setInProgressTickets] = useState([]);
  const [resolvedTickets, setResolvedTickets] = useState([]);
  const [invalidTickets, setInvalidTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userToken } = useAuth();
  
  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      if (!userToken) {
        navigate('/admin/login');
      }
      try {
        const retrievedTickets = await TicketService.getTickets(userToken);

        const ids = retrievedTickets.map(ticket => ticket.id);
        setTicketIds(ids);

        const currentTickets = retrievedTickets.filter(ticket => ticket.isCustomOrder === customOrder);
        setUnactionedTickets(currentTickets.filter(ticket => !ticket.inProgress && !ticket.resolved));
        setInProgressTickets(currentTickets.filter(ticket => ticket.inProgress));
        setResolvedTickets(currentTickets.filter(ticket => ticket.resolved));
        setInvalidTickets(currentTickets.filter(ticket => ticket.inProgress && ticket.resolved));
      } catch {
        toastRef.current('Network request error');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [customOrder]);
  
  const handleTicketClick = (id) => {
    let navigationDestination = customOrder ? '/admin/admin-custom-order/' : '/admin/admin-support-ticket/'
    navigate(navigationDestination, {
      state: { id: id }
    });
  }

  const handleGoClick = () => {
    const currentId = parseInt(ticketId);
    if (!Number.isNaN(currentId) && ticketIds.includes(currentId)) {
      handleTicketClick(currentId);
    } else {
      toastRef.current('Please insert a valid ID.');
    }
  }

  const navigateResolved = () => {
    let navigationDestination = customOrder ? '/admin/resolved-custom-orders/' : '/admin/resolved-support-tickets/'
    navigate(navigationDestination, {
      state: { items: resolvedTickets }
    })
  }

  return (
    <div>
      <AdminNavBar />
      { loading ?
      <LoadingScreen />
      :
      <div className={appStyles.App}>
        <HeaderSection
          title={customOrder ? 'Custom Order' : 'Support Ticket'}
          fontWeight='bold'
          fontSize={32}
          marginBottom={20}
        />

        <div className={styles.search}>
          <TextInput
            type="text"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder={customOrder ? 'Enter custom order ID' : 'Enter support ticket ID'}
            maxWidth='300px'
          />

          <GeneralButton
            onClick={handleGoClick}
            text={"Go"}
          />
        </div>

        <CategoryDisplay 
          title='Invalid Tickets' 
          type={customOrder ? 'customOrder' : 'supportTicket'} 
          items={invalidTickets} 
        />
        <CategoryDisplay 
          title='Unactioned Tickets'
          type={customOrder ? 'customOrder' : 'supportTicket'} 
          items={unactionedTickets}
        />
        <CategoryDisplay 
          title='In Progress Tickets' 
          type={customOrder ? 'customOrder' : 'supportTicket'} 
          items={inProgressTickets} 
        />

        <GeneralButton
          onClick={navigateResolved}
          text={<>Resolved {customOrder ? 'Custom Orders' : 'Support Tickets'}</>}
        />
      </div>
      }
    </div>
  );
}

export default AdminTickets;
