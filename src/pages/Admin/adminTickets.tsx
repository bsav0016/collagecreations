import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from '../../layout/navBars/adminNavBar';
import CategoryDisplay from '../../components/categoryDisplay';
import GeneralButton from '../../components/generalButton/generalButton';
import TicketService from '../../services/TicketService';
import TextInput from '../../components/textInput/textInput';
import LoadingScreen from '../../components/loadingScreen/loadingScreen';
import HeaderSection from '../../components/headerSection';
import { toastRef } from '../../context/toastContext/toastContext';
import { useAuth } from '../../context/authContext';

interface AdminTicketsProps {
  customOrder: boolean;
}

interface Ticket {
  id: number;
  isCustomOrder: boolean;
  inProgress: boolean;
  resolved: boolean;
}

function AdminTickets({ customOrder }: AdminTicketsProps): React.ReactElement {
  const [ticketId, setTicketId] = useState<string>('');
  const [ticketIds, setTicketIds] = useState<number[]>([]);
  const [unactionedTickets, setUnactionedTickets] = useState<Ticket[]>([]);
  const [inProgressTickets, setInProgressTickets] = useState<Ticket[]>([]);
  const [resolvedTickets, setResolvedTickets] = useState<Ticket[]>([]);
  const [invalidTickets, setInvalidTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { userToken } = useAuth();
  
  useEffect(() => {
    const fetchTickets = async (): Promise<void> => {
      setLoading(true);
      if (!userToken) {
        navigate('/admin/login');
      }
      try {
        const retrievedTickets = await TicketService.getTickets(userToken);

        const ids = retrievedTickets.map((ticket: Ticket) => ticket.id);
        setTicketIds(ids);

        const currentTickets = retrievedTickets.filter((ticket: Ticket) => ticket.isCustomOrder === customOrder);
        setUnactionedTickets(currentTickets.filter((ticket: Ticket) => !ticket.inProgress && !ticket.resolved));
        setInProgressTickets(currentTickets.filter((ticket: Ticket) => ticket.inProgress));
        setResolvedTickets(currentTickets.filter((ticket: Ticket) => ticket.resolved));
        setInvalidTickets(currentTickets.filter((ticket: Ticket) => ticket.inProgress && ticket.resolved));
      } catch {
        toastRef.current?.('Network request error');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [customOrder, userToken, navigate]);
  
  const handleTicketClick = (id: number): void => {
    const navigationDestination = customOrder ? '/admin/admin-custom-order/' : '/admin/admin-support-ticket/';
    navigate(navigationDestination, {
      state: { id: id }
    });
  };

  const handleGoClick = (): void => {
    const currentId = parseInt(ticketId);
    if (!Number.isNaN(currentId) && ticketIds.includes(currentId)) {
      handleTicketClick(currentId);
    } else {
      toastRef.current?.('Please insert a valid ID.');
    }
  };

  const navigateResolved = (): void => {
    const navigationDestination = customOrder ? '/admin/resolved-custom-orders/' : '/admin/resolved-support-tickets/';
    navigate(navigationDestination, {
      state: { items: resolvedTickets }
    });
  };

  return (
    <div>
      <AdminNavBar />
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="text-center py-5">
          <HeaderSection
            title={customOrder ? 'Custom Order' : 'Support Ticket'}
            fontWeight='bold'
            fontSize={32}
            marginBottom={20}
          />

          <div className="flex flex-row justify-center">
            <TextInput
              type="text"
              value={ticketId}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTicketId(e.target.value)}
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
      )}
    </div>
  );
}

export default AdminTickets;
