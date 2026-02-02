import React, { ReactNode } from "react";

interface HeaderSectionProps {
  title: string;
  children?: ReactNode;
  fontSize?: number;
  marginTop?: string | number;
  marginBottom?: string | number;
  fontWeight?: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  title,
  children,
  fontSize = 18,
  marginTop = 0,
  marginBottom = 0,
  fontWeight = "normal",
}) => (
  <div style={{ marginTop, marginBottom, color: "black" }}>
    <header style={{ fontSize, fontWeight, color: "black" }}>{title}</header>
    {children}
  </div>
);

export default HeaderSection;
