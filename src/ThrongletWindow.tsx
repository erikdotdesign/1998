import WindowContainer from "./WindowContainer";
import useWindowManager from './WindowManager';

import "./ThrongletWindow.css";

const ThrongletWindow = () => {
  const { windows, dispatch } = useWindowManager();
  
  const win = Object.values(windows).find(w => w.windowType === "thronglet");

  if (!win) return;

  return (
    <WindowContainer 
      id={win.id}
      menu={[
        {label: "File", submenu: [{label: "Close", onClick: () => dispatch({type: "CLOSE", id: win.id})}]}, 
        {label: "Edit", submenu: [{label: "Empty", disabled: true}]}, 
        {label: "Help", submenu: [{label: "Empty", disabled: true}]}
      ]}>
      <div className="c-thronglet-window field-border">
        <iframe
          data-glitch-ignore
          className="c-thronglet-window__iframe"
          src="./thronglet/index.html"
          allow="autoplay; fullscreen" />
      </div>
    </WindowContainer>
  );
};

export default ThrongletWindow;
