import React, { useState } from 'react';
import GeneralButton from '../../components/generalButton/generalButton';
import OrderService from '../../services/OrderService';
import { toastRef } from '../../context/toastContext/toastContext';

interface RefundPanelProps {
  token: string | null;
  orderId: string;
  refundedCents: number;
  disputed: boolean;
  canRefund: boolean;
  onRefunded: (totalRefundedCents: number) => void;
}

const dollars = (cents: number): string => `$${(cents / 100).toFixed(2)}`;

/** Whole cents from text such as "12.50"; null when blank (meaning "everything left") or malformed. */
export function parseDollarsToCents(text: string): number | null | 'invalid' {
  const trimmed = text.trim();
  if (trimmed === '') return null;
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return 'invalid';
  const cents = Math.round(parseFloat(trimmed) * 100);
  return cents > 0 ? cents : 'invalid';
}

function RefundPanel({ token, orderId, refundedCents, disputed, canRefund, onRefunded }: RefundPanelProps): React.ReactElement {
  const [amount, setAmount] = useState<string>('');
  const [confirming, setConfirming] = useState<boolean>(false);
  const [busy, setBusy] = useState<boolean>(false);
  const cents = parseDollarsToCents(amount);
  const invalid = cents === 'invalid';

  const refund = async (): Promise<void> => {
    if (invalid) return;
    setBusy(true);
    try {
      const total = await OrderService.refundOrder(token, orderId, cents ?? undefined);
      onRefunded(total);
      setAmount('');
      toastRef.current?.(`Refunded. Total refunded is now ${dollars(total)}`);
    } catch (error) {
      toastRef.current?.(typeof error === 'string' ? error : 'The refund failed. Nothing was recorded.');
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  };

  return (
    <div className="my-4 mx-auto max-w-md rounded border p-3 text-left" aria-label="Refunds">
      <p className="font-bold">Refunds</p>
      <p>Refunded so far: {dollars(refundedCents)}</p>
      {disputed && <p className="text-red-600">This order has a payment dispute. Check Stripe before refunding.</p>}
      {canRefund ? (
        <>
          <label htmlFor="refund-amount" className="block mt-2">Amount to refund in dollars (blank refunds everything left)</label>
          <input
            id="refund-amount"
            className="border rounded px-2 py-1 w-full"
            inputMode="decimal"
            value={amount}
            disabled={busy}
            onChange={e => { setAmount(e.target.value); setConfirming(false); }}
          />
          {invalid && <p className="text-red-600">Enter dollars and cents, like 12.50.</p>}
          {confirming ? (
            <div className="mt-2">
              <p>
                {cents === null || invalid
                  ? "Refund everything that is left to the customer's card?"
                  : `Refund ${dollars(cents)} to the customer's card?`} This cannot be undone.
              </p>
              <GeneralButton onClick={refund} disabled={busy} text={busy ? 'Refunding...' : 'Yes, refund'} />
              <GeneralButton onClick={() => setConfirming(false)} disabled={busy} text="Cancel" variant="ghost" />
            </div>
          ) : (
            <GeneralButton onClick={() => setConfirming(true)} disabled={invalid || busy} text="Refund" variant="ghost" />
          )}
        </>
      ) : (
        <p className="text-sm">Only a superuser can issue refunds, and only for orders paid through Stripe.</p>
      )}
    </div>
  );
}

export default RefundPanel;
