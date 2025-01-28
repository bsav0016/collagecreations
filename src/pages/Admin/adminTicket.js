import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminNavBar from '../../layout/navBars/adminNavBar';
import GeneralButton from '../../components/generalButton/generalButton';
import LoadingDots from '../../components/loadingDots';
import TicketDTO from '../../dtos/TicketDTO/TicketDTO';
import formatDateString from '../../utils/formatDateString';
import HeaderSection from '../../components/headerSection';
import TicketService from '../../services/TicketService';
import FormField from '../../components/form/formField';
import Form from '../../components/form/form';
import LoadingScreen from '../../components/loadingScreen/loadingScreen';
import { toastRef } from '../../context/toastContext/toastContext';
import { useAuth } from '../../context/authContext';

function AdminTicket({ customOrder }) {
  const [ticketId, setTicketId] = useState(null);
  const [ticketData, setTicketData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userToken } = useAuth();

  useEffect(() => {
    if (!userToken) {
      navigate('/admin/login');
      return;
    }

    const fetchTicketData = async () => {
      setLoading(true);
      try {
        const ticketId = location.state.id;
        setTicketId(ticketId);
        const data = await TicketService.getTicket(userToken, ticketId, customOrder);
        const ticketDTO = TicketDTO.fromResponse(data);
        setTicketData(ticketDTO);
      } catch (error) {
        console.error('Error:', error);
        navigate(customOrder ? '/admin/admin-custom-orders/' : '/admin/admin-support-tickets/');
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, []);

  const updateTicketData = async () => {
    if (!userToken) {
      navigate('/admin/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await TicketService.updateTicket(userToken, location.state.id, ticketData);
      if (response) {
        navigate(customOrder ? '/admin/admin-custom-orders/' : '/admin/admin-support-tickets/');
      } else {
        toastRef.current('Error updating ticket');
      }
    } catch (error) {
      toastRef.current('Error updating ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const fields = [
    { type: 'label', id: 'firstname', text: 'First Name: ', value: ticketData.firstname },
    { type: 'label', id: 'lastname', text: 'Last Name: ', value: ticketData.lastname },
    { type: 'label', id: 'email', text: 'Email: ', value: ticketData.email },
    ...(ticketData.orderNumber !== 'N/A' ? 
      [{ type: 'label', id: 'orderNumber', text: 'Order Number: ', value: ticketData.orderNumber}] : []),
    { type: 'label', id: 'message', text: 'Message: ', value: ticketData.message },
    { type: 'label', id: 'creationDate', text: 'Creation Date: ', value: formatDateString(ticketData.creationDate) },
    { type: 'checkbox', id: 'inProgress', text: 'In Progress: ', checked: ticketData.inProgress },
    { type: 'checkbox', id: 'resolved', text: 'Resolved: ', checked: ticketData.resolved },
    { type: 'multilineTextInput', id: 'notes', text: 'Notes: ', value: ticketData.notes}
  ];

  const handleFieldChange = (fieldName, checkbox) => (e) => {
    setTicketData(prev => {
      const updatedTicketData = Object.create(Object.getPrototypeOf(prev));
      Object.assign(updatedTicketData, prev);
      if (checkbox) {
        updatedTicketData.updateField(fieldName, e.target.checked);
        if (fieldName === 'inProgress' && e.target.checked){
          updatedTicketData.updateField('resolved', false);
        }
        else if (fieldName === 'resolved' && e.target.checked){
          updatedTicketData.updateField('inProgress', false);
        }
      }
      else {
        updatedTicketData.updateField(fieldName, e.target.value);
      }
      return updatedTicketData;
    });
  };

  return (
    <div>
      <AdminNavBar />
      { loading ? 
      <LoadingScreen />
      :
      <div className="App">
        <HeaderSection
          title={`Ticket Number: ${ticketId}`}
          fontWeight='bold'
          fontSize={32}
          marginBottom={20}
        />

        <Form onSubmit={updateTicketData}>
          {fields.map(field => (
            <FormField
              key={field.id}
              type={field.type}
              id={field.id}
              text={field.text}
              value={field.value}
              checked={field.checked}
              onChange={handleFieldChange(field.id, field.type === "checkbox")}
            />
          ))}

          <GeneralButton
            type="submit"
            disabled={isSubmitting}
            text={isSubmitting ? <>Processing<LoadingDots /></> : 'Update'}
          />
        </Form>
      </div>
      }
    </div>
  );
}

export default AdminTicket;
