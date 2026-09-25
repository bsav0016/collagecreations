import React from 'react';
import LegalPageLayout from './legalPageLayout';

function RefundPolicy(): React.ReactElement {
  return (
    <LegalPageLayout title="Refund & Return Policy" lastUpdated="September 24, 2026">
      <p>
        Every collage and print we make is custom-produced for you, so our return and refund
        options work a little differently than they would for an off-the-shelf product. Here's
        exactly where you stand.
      </p>

      <h2>1. Before You Order</h2>
      <p>
        We show you a watermarked preview of your finished design before you pay, specifically
        so you can catch any issue with cropping, layout, or image quality beforehand. Please
        review it carefully — once an order is placed, production can begin quickly.
      </p>

      <h2>2. Cancelling an Order</h2>
      <p>
        If you need to cancel, contact <a href="/support">Support</a> with your order number as
        soon as possible. If production or shipping hasn't started yet, we'll cancel the order
        and refund you in full. Once a physical order has been printed or shipped, it can no
        longer be cancelled, but our damage/defect policy below still applies.
      </p>

      <h2>3. Physical Prints and Collages</h2>
      <p>We'll offer a full refund or a free reprint, your choice, if:</p>
      <ul>
        <li>your order arrives damaged in shipping;</li>
        <li>your order was printed with a defect not shown in your approved preview; or</li>
        <li>you received the wrong item.</li>
      </ul>
      <p>
        To request one, contact <a href="/support">Support</a> within 14 days of delivery with
        your order number and a photo showing the issue. We don't offer refunds for
        dissatisfaction with a design choice you approved in the preview (for example, a specific
        crop, color mode, or photo selection), since that reflects what you confirmed before
        ordering.
      </p>

      <h2>4. Digital Downloads</h2>
      <p>
        Because a digital download can't be "returned" once delivered, download orders are
        final sale except where the file you received is genuinely defective (for example, it
        won't open or doesn't match your approved preview) or you didn't receive your download
        link due to an error on our end. Contact <a href="/support">Support</a> within 14 days if
        either applies.
      </p>

      <h2>5. Lost or Undelivered Packages</h2>
      <p>
        If USPS tracking shows a package as lost or significantly delayed, let us know through{' '}
        <a href="/support">Support</a> and we'll help you file a carrier claim or work out a
        reprint, depending on the situation.
      </p>

      <h2>6. How Refunds Are Issued</h2>
      <p>
        Approved refunds are returned to your original payment method through Stripe. Please
        allow a few business days for your bank or card issuer to reflect the refund. Discount
        codes used on a refunded order are not reissued.
      </p>

      <h2>7. Contact</h2>
      <p>
        For any order issue, the fastest way to reach us is through our{' '}
        <a href="/support">Support</a> page with your order number. We aim to respond within 48
        hours.
      </p>
    </LegalPageLayout>
  );
}

export default RefundPolicy;
