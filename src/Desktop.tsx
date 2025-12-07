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
      <div className="c-desktop__inner">
        {children}
      </div>
    </div>
  );
});

export default Desktop;