import WindowContainer from "./WindowContainer";
import useWindowManager from './WindowManager';
import InfoIcon from "./assets/images/icons/info.png";

import "./DoomWindow.css";
import { useState } from "react";

const DoomWindow = () => {
  const { windows, dispatch } = useWindowManager();
  const [showModal, setShowModal] = useState(true);
  
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
        {
          showModal
          ? <div className="c-doom-window__modal">
              <img src={InfoIcon} />
              <div>
                <h5>Keyboard Required</h5>
                <p><i>This game also has sound</i></p>
              </div>
              <button onClick={() => setShowModal(false)}>Ok</button>
            </div>
          : null
        }
      </div>
    </WindowContainer>
  );
};

export default DoomWindow;
