import React from 'react';
import LegalPageLayout from './legalPageLayout';

function TermsOfService(): React.ReactElement {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="September 24, 2026">
      <p>
        These Terms of Service ("Terms") govern your use of collagecreations.org (the "Site")
        and any purchase you make through it (together, the "Service"), operated by Collage
        Creations ("Collage Creations," "we," "us," or "our"). By using the Site or placing an
        order, you agree to these Terms. If you do not agree, please do not use the Service.
      </p>

      <h2>1. The Service</h2>
      <p>
        Collage Creations lets you upload your own photos, or choose from provided text or
        symbol options, to create a custom photo collage or print. You can order the result as a
        physical print, shipped to you, or as a digital download. Before you pay, we show you a
        watermarked preview of the finished product so you can confirm it looks right.
      </p>

      <h2>2. Your Content</h2>
      <p>
        "Your Content" means any photo, image, or text you upload or submit to create your
        order. You keep all ownership rights to Your Content. By uploading it, you give us a
        limited license to use, reproduce, and modify Your Content solely to create, preview,
        and fulfill your order.
      </p>
      <p>You confirm that:</p>
      <ul>
        <li>
          you own Your Content, or have permission from whoever does, to use it the way described
          above;
        </li>
        <li>
          Your Content doesn't infringe anyone else's copyright, trademark, privacy, or other
          rights; and
        </li>
        <li>
          Your Content isn't illegal, hateful, obscene, or otherwise something we'd reasonably
          object to printing.
        </li>
      </ul>
      <p>
        We may refuse to process an order if we believe Your Content violates the above. Photos
        you upload while building an order are automatically deleted from our systems within
        about 48 hours if you don't complete the purchase; see our{' '}
        <a href="/privacy">Privacy Policy</a> for more on how we handle images tied to completed
        orders.
      </p>

      <h2>3. Orders, Pricing, and Payment</h2>
      <p>
        Prices are shown in U.S. dollars and include applicable sales tax, calculated at
        checkout. Payments are processed securely by Stripe; we never see or store your full
        card number. An order is placed once your payment is successfully authorized and we've
        sent you an order confirmation email. We reserve the right to refuse or cancel an order
        — for example, for a suspected pricing error, a payment issue, or content we can't print
        — in which case we'll refund any payment already collected.
      </p>
      <p>
        Discount codes are subject to the terms shown at the time they're offered (such as an
        expiration date, order-type restriction, or limited number of uses), may be changed or
        discontinued at any time, and have no cash value.
      </p>

      <h2>4. Shipping</h2>
      <p>
        Physical orders currently ship via USPS from Hawaii to addresses within the United
        States. Shipping costs are calculated at checkout based on your address and order size.
        Delivery estimates are provided by USPS and are not guaranteed; we're not responsible
        for carrier delays. Risk of loss passes to you once your order is handed to the carrier,
        though we're glad to help you file a claim if a package is lost or arrives damaged — see
        our <a href="/refund-policy">Refund &amp; Return Policy</a>.
      </p>

      <h2>5. Digital Downloads</h2>
      <p>
        A download order gives you a secure link, sent to the email you provide, to download
        your finished image. Digital downloads are for your personal use; please don't resell or
        redistribute the file commercially without our permission.
      </p>

      <h2>6. Cancellations, Returns, and Refunds</h2>
      <p>
        Because every order is custom-made for you, our ability to cancel or refund an order is
        limited once production has started. Full details, including how to request a refund
        for a defective or damaged item, are in our{' '}
        <a href="/refund-policy">Refund &amp; Return Policy</a>.
      </p>

      <h2>7. Support and Custom Orders</h2>
      <p>
        Questions, order issues, and custom-order requests can be sent through the{' '}
        <a href="/support">Support</a> page. We aim to respond within 48 hours.
      </p>

      <h2>8. Intellectual Property</h2>
      <p>
        Other than Your Content, everything on the Site — including its design, text, graphics,
        logo, and software — belongs to Collage Creations or our licensors and is protected by
        copyright and other laws. You may not copy, modify, or redistribute it without our
        written permission.
      </p>

      <h2>9. Disclaimer of Warranties</h2>
      <p>
        The Service is provided "as is." We try to accurately represent how your finished
        product will look, but colors, materials, and print results can vary slightly from what
        you see on your screen. To the fullest extent permitted by law, we disclaim all other
        warranties, express or implied, regarding the Service.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, Collage Creations will not be liable for any
        indirect, incidental, or consequential damages arising from your use of the Service, and
        our total liability for any claim relating to an order will not exceed the amount you
        paid for that order.
      </p>

      <h2>11. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. If we make material changes, we'll update
        the "Last updated" date above. Continuing to use the Service after a change means you
        accept the updated Terms.
      </p>

      <h2>12. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the State of Hawaii, without regard to its
        conflict-of-law principles.
      </p>

      <h2>13. Contact</h2>
      <p>
        Questions about these Terms? Reach out through our <a href="/support">Support</a> page.
      </p>
    </LegalPageLayout>
  );
}

export default TermsOfService;
