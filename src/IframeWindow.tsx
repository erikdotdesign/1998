import { useState, useEffect } from "react";
import WindowContainer from "./WindowContainer";
import LoadingModal from "./LoadingModal";
import useWindowManager from "./WindowManager";

const IFrameWindow = ({ 
  windowType, 
  iframeSrc, 
  className,
  children
}: {
  windowType: string;
  iframeSrc: string;
  className?: string;
  children?: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(true);
  const { windows, dispatch } = useWindowManager();

  const win = Object.values(windows).find(w => w.windowType === windowType);
  const min = win?.minimized;

  useEffect(() => {
    if (!win || min) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
    }
  }, [win, min]);

  if (!win) return null;

  const defaultMenu = [
    { label: "File", submenu: [{ label: "Close", onClick: () => dispatch({ type: "CLOSE", id: win.id }) }] },
    { label: "Edit", submenu: [{ label: "Empty", disabled: true }] },
    { label: "Help", submenu: [{ label: "Empty", disabled: true }] }
  ];

  return (
    <WindowContainer id={win.id} menu={defaultMenu}>
      <div className={className}>
        {loading && <LoadingModal />}
        <iframe
          data-glitch-ignore
          className={`${className}__iframe`}
          src={iframeSrc}
          allow="autoplay; fullscreen"
          onLoad={() => setLoading(false)} />
        {children}
      </div>
    </WindowContainer>
  );
};

export default IFrameWindow;