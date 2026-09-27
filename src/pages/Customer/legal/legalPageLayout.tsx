import React from 'react';
import NavBar from '../../../layout/navBars/navBar';
import MediumLogoHeader from '../../../layout/mediumLogoHeader/mediumLogoHeader';
import Footer from '../../../layout/footer/footer';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

// Shared chrome for the legal pages (terms, privacy, refund policy) so headings/spacing/lists
// read consistently across all three without repeating the same utility classes in each file.
function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps): React.ReactElement {
  return (
    <div>
      <NavBar />
      <MediumLogoHeader title={title} />
      <div className="max-w-3xl mx-auto px-4 pb-16 text-foreground">
        <p className="text-sm text-muted-foreground mb-8">Last updated: {lastUpdated}</p>
        <div
          className="space-y-4 leading-relaxed
                     [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-2
                     [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1
                     [&_a]:underline [&_a]:underline-offset-2"
        >
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LegalPageLayout;
