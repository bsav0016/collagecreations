import React, { ReactNode } from "react";

interface HeaderSectionProps {
  title: string;
  children?: ReactNode;
  fontSize?: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  marginTop?: string | number;
  marginBottom?: string | number;
  fontWeight?: string;
}

const fontSizeClasses = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
};

const HeaderSection: React.FC<HeaderSectionProps> = ({
  title,
  children,
  fontSize = "xl",
  marginTop = 0,
  marginBottom = 0,
  fontWeight = "normal",
}) => (
  <div style={{ marginTop, marginBottom }} className="text-foreground">
    <header style={{ fontWeight }} className={`text-foreground ${fontSizeClasses[fontSize]}`}>{title}</header>
    {children}
  </div>
);

export default HeaderSection;
