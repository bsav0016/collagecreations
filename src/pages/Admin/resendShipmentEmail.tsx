import React, { useState } from 'react';
import GeneralButton from '../../components/generalButton/generalButton';
import OrderService from '../../services/OrderService';
import { toastRef } from '../../context/toastContext/toastContext';

interface ResendShipmentEmailProps {
  token: string | null;
  orderId: string;
}

/** The shipped email goes out by itself when an order is saved as shipped; this sends it again on request. */
function ResendShipmentEmail({ token, orderId }: ResendShipmentEmailProps): React.ReactElement {
  const [busy, setBusy] = useState<boolean>(false);

  const resend = async (): Promise<void> => {
    setBusy(true);
    try {
      await OrderService.resendShipmentEmail(token, orderId);
      toastRef.current?.('Shipping email sent again');
    } catch {
      toastRef.current?.('Could not send the shipping email');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="my-4 mx-auto max-w-md rounded border p-3 text-left" aria-label="Shipping email">
      <p className="font-bold">Shipping email</p>
      <p>The customer is emailed automatically when the order is saved as shipped with a tracking number.</p>
      <GeneralButton text={busy ? 'Sending...' : 'Resend shipping email'} onClick={resend} disabled={busy} />
    </div>
  );
}

export default ResendShipmentEmail;
