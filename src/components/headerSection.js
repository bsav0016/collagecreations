import React from 'react';

const HeaderSection = ({ title, children, fontSize = 18, marginTop = 0, marginBottom = 0, fontWeight = 'normal' }) => (
  <div style={{ marginTop: marginTop, marginBottom: marginBottom }}>
    <header style={{ fontSize: fontSize, fontWeight: fontWeight }}>
        {title}
    </header>
    {children}
  </div>
);

export default HeaderSection;