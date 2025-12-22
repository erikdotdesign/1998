import WindowContainer from "./WindowContainer";
import LoadingModal from "./LoadingModal";
import useWindowManager from './WindowManager';

import "./ThrongletWindow.css";
import { useState } from "react";

const ThrongletWindow = () => {
  const [loading, setLoading] = useState(true);
  const { windows, dispatch } = useWindowManager();
  
  const win = Object.values(windows).find(w => w.windowType === "thronglet");
  const min = win && win.minimized

  if (!win) {
    if (!loading) setLoading(true);
    return;
  };

  if (min) {
    if (!loading) setLoading(true);
  }

  return (
    <WindowContainer 
      id={win.id}
      menu={[
        {label: "File", submenu: [{label: "Close", onClick: () => dispatch({type: "CLOSE", id: win.id})}]}, 
        {label: "Edit", submenu: [{label: "Empty", disabled: true}]}, 
        {label: "Help", submenu: [{label: "Empty", disabled: true}]}
      ]}>
      <div className="c-thronglet-window field-border">
        {loading && (
          <LoadingModal />
        )}
        <iframe
          data-glitch-ignore
          className="c-thronglet-window__iframe"
          src="./thronglet/index.html"
          allow="autoplay; fullscreen"
          onLoad={() => setLoading(false)} />
      </div>
    </WindowContainer>
  );
};

export default ThrongletWindow;
