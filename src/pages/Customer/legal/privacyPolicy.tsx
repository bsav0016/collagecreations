import React from 'react';
import LegalPageLayout from './legalPageLayout';

function PrivacyPolicy(): React.ReactElement {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="October 2, 2026">
      <p>
        This Privacy Policy explains what information Collage Creations ("we," "us," or "our")
        collects through collagecreations.org (the "Site"), why we collect it, and how it's
        handled.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We collect information in a few ways:</p>
      <ul>
        <li>
          <strong>Information you give us directly:</strong> your name, email address, and, for
          physical orders, your shipping address, when you place an order or contact support.
        </li>
        <li>
          <strong>Sign-in information:</strong> if you sign in with Google or Microsoft, we
          receive your email address and name from them; if you sign in with an emailed code, we
          receive the email address you enter. We never receive your Google or Microsoft
          password. We keep this with the collages you've saved so you can come back to them.
        </li>
        <li>
          <strong>The photos you upload:</strong> to build your collage or print. We also
          generate a smaller, watermarked preview so you can review your order before paying.
        </li>
        <li>
          <strong>Payment information:</strong> handled directly by our payment processor,
          Stripe. We never receive or store your full card number — only Stripe does, subject to
          its own privacy practices.
        </li>
        <li>
          <strong>Order and support records:</strong> such as order status, order history, and
          any messages you send us through the Support page.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information above to:</p>
      <ul>
        <li>create, print or generate, and ship or deliver your order;</li>
        <li>send you order confirmations, shipping updates, and download links;</li>
        <li>respond to support requests and custom-order inquiries;</li>
        <li>
          keep your saved collages linked to you, and email you a reminder if you leave a
          collage unordered (see "Your Choices" to opt out);
        </li>
        <li>calculate applicable sales tax and shipping cost; and</li>
        <li>
          keep our Service secure — for example, limiting how often the same visitor can attempt
          a payment or apply a discount code, to prevent abuse.
        </li>
      </ul>
      <p>We don't sell your personal information, and we don't use your photos for anything other than fulfilling your order unless you separately give us permission (for example, if you ask us to feature your collage as an example on the Site).</p>

      <h2>3. How Long We Keep Your Photos</h2>
      <p>
        If you upload photos but don't complete a purchase, that data — including the images
        themselves — is automatically deleted from our systems. If you aren't signed in, that
        happens within about 48 hours. If you sign in, we keep your collage for about 7 days so
        you can come back to it, and then delete it. Once you complete an order, we keep the associated image on file to fulfill that order, handle
        any support issue or reprint request related to it, and comply with our recordkeeping
        obligations. You can ask us to delete a completed order's stored image at any time by
        contacting <a href="/support">Support</a>, though we may need to retain limited order
        records (such as the order number and amount) for accounting purposes.
      </p>

      <h2>4. Who We Share Information With</h2>
      <p>
        We share information only with the service providers we need to run the Service,
        including:
      </p>
      <ul>
        <li><strong>Stripe</strong>, to process payments;</li>
        <li>
          <strong>Google</strong> and <strong>Microsoft</strong>, only if you choose to sign in
          with them (they learn that you signed in to our Site, subject to their own privacy
          practices);
        </li>
        <li><strong>USPS</strong>, to calculate shipping costs and ship physical orders;</li>
        <li>our email delivery provider, to send order and account-related emails; and</li>
        <li>our hosting and infrastructure providers, to store data and run the Site.</li>
      </ul>
      <p>
        We don't share your information with third parties for their own marketing purposes. We
        may disclose information if required by law, or to protect the rights, property, or
        safety of Collage Creations, our customers, or others.
      </p>

      <h2>5. Cookies and Local Storage</h2>
      <p>
        The Site uses your browser's local storage to remember things like your in-progress
        order and cart contents between steps of checkout, and to keep you signed in for up to
        30 days if you've signed in. We don't currently use third-party
        advertising or analytics cookies.
      </p>

      <h2>6. Data Security</h2>
      <p>
        We use reasonable technical and organizational measures to protect your information,
        including encrypting connections to the Site and never handling raw card numbers
        ourselves. That said, no method of transmission or storage is perfectly secure, and we
        can't guarantee absolute security.
      </p>

      <h2>7. Children's Privacy</h2>
      <p>
        The Service is not directed to children under 13, and we don't knowingly collect
        personal information from children under 13. If you believe a child has provided us
        information, please contact us so we can delete it.
      </p>

      <h2>8. Your Choices</h2>
      <p>
        You can ask us what personal information we have about you, request a correction, or
        request deletion (subject to the limits described in Section 3) by contacting us through{' '}
        <a href="/support">Support</a>. Every reminder email we send includes an unsubscribe link
        that stops further reminders immediately.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. If we make material changes, we'll
        update the "Last updated" date above.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about this Privacy Policy? Reach out through our{' '}
        <a href="/support">Support</a> page.
      </p>
    </LegalPageLayout>
  );
}

export default PrivacyPolicy;
