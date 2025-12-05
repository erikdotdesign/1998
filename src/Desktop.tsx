import { forwardRef } from "react";

import "./Desktop.css";

type DesktopProps = {
  children: React.ReactNode;
};

const Desktop = forwardRef<HTMLDivElement, DesktopProps>(({
  children
}, ref) => {
  return (
    <div 
      ref={ref}
      className="c-desktop">
      {children}
    </div>
  );
});

export default Desktop;