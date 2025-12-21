import WindowContainer from "./WindowContainer";
import useWindowManager from './WindowManager';

import "./DoomWindow.css";

const DoomWindow = () => {
  const { windows, dispatch } = useWindowManager();
  
  const win = Object.values(windows).find(w => w.windowType === "doom");

  if (!win) return;

  return (
    <WindowContainer 
      id={win.id}
      menu={[
        {label: "File", submenu: [{label: "Close", onClick: () => dispatch({type: "CLOSE", id: win.id})}]}, 
        {label: "Edit", submenu: [{label: "Empty", disabled: true}]}, 
        {label: "Help", submenu: [{label: "Empty", disabled: true}]}
      ]}>
      <div className="c-doom-window field-border">
        <iframe
          data-glitch-ignore
          className="c-doom-window__iframe"
          src="./doom/index.html"
          allow="autoplay; fullscreen" />
      </div>
    </WindowContainer>
  );
};

export default DoomWindow;
