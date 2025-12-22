import { useEffect } from "react";
import { type Action } from "./reducer";
import "./Menu.css";

const Menu = ({
  dispatch,
  title,
  detail,
  handleBack,
  onClose,
  children
}: {
  dispatch: (action: Action) => void;
  title: string;
  detail?: string;
  handleBack?: () => void;
  onClose?: () => void;
  children?: React.ReactNode | React.ReactNode[];
}) => {

  useEffect(() => {
    // Add keydown listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: "CLOSE_MENU" });
      }
    };
    window.addEventListener("keydown", handleKeyDown, { capture: true });

    // Cleanup on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [dispatch]);
  
  return (
    <div className="c-menu">
      <div className="c-menu__border" />
      <div className="c-menu__header">
        <button 
          className={`c-menu__button ${!handleBack ? 'c-menu__button--hidden' : ""}`}
          onClick={handleBack}>
          {`<`}
        </button>
        <div className="c-menu__title">{title}</div>
        <button 
          className="c-menu__button"
          onClick={() => {
            if (onClose) onClose();
            dispatch({ type: "CLOSE_MENU" });
          }}>
          X
        </button>
      </div>
      <div className="c-menu__body">
        {detail && (
          <span className="c-menu__detail">{detail}</span>
        )}
        {children}
      </div>
    </div>
  );
};

export default Menu;